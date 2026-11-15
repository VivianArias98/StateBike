import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TUNJA_CENTRO, TUNJA_LIMITES, estaDentroDeTunja } from './limitesTunja.js';
// Importar los estilos de Leaflet ANTES del módulo propio (el módulo debe ganar)
import styles from './MapaTunja.module.css';

// Iconos propios
const iconoPunto = L.divIcon({
  className: styles.punto,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

// Icono con onda animada para la ubicación en tiempo real exacta
const iconoActual = L.divIcon({
  className: styles.actualContenedor,
  html: `<div class="${styles.actualOnda}"></div><div class="${styles.actualCentro}"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function crearIconoEstacion(bicicletas, esMasCercana = false) {
  return L.divIcon({
    className: `${styles.estacion} ${esMasCercana ? styles.estacionMasCercana : ''}`,
    html: esMasCercana
      ? `<span class="${styles.badgeCercanaEstrella}" aria-hidden="true">★</span><span class="${styles.estacionNumero}">${String(Number(bicicletas) || 0)}</span>`
      : `<span class="${styles.estacionNumero}">${String(Number(bicicletas) || 0)}</span>`,
    iconSize: esMasCercana ? [40, 40] : [36, 36],
    iconAnchor: esMasCercana ? [20, 20] : [18, 18],
  });
}

// useMapEvents solo funciona DENTRO de MapContainer, por eso es un componente aparte
function CapturaClics({ onSeleccionar }) {
  useMapEvents({
    click(evento) {
      onSeleccionar(evento.latlng.lat, evento.latlng.lng);
    },
  });
  return null;
}

// Controlador de cámara para vuelos suaves (flyTo) hacia la ubicación del usuario
function ManejadorCamara({ destino, trigger }) {
  const map = useMap();
  useEffect(() => {
    if (destino && trigger > 0) {
      map.flyTo([destino.lat, destino.lng], 16, { animate: true, duration: 1.2 });
    }
  }, [destino, trigger, map]);
  return null;
}

function IconoGpsSvg() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      <circle cx="12" cy="12" r="7" />
    </svg>
  );
}

// Componente de presentación enriquecido:
// - estaciones: estaciones de referencia [{ id, nombre, lat, lng, bicicletas, distanciaTexto, esMasCercana }]
// - punto: ubicación elegida { lat, lng } o null
// - onSeleccionar: si se pasa, el mapa es clicable y el punto se puede arrastrar
// - ruta: recorrido [[lat, lng], ...] que se dibuja como una línea (opcional)
// - ubicacionActual: { lat, lng } o null (opcional)
// - idEstacionMasCercana: id numérico de la estación más próxima
// - distanciaMasCercanaTexto: texto de distancia (ej: "150 m")
// - mostrarLineaCercana: si se conecta el usuario con la estación más cercana
// - onActivarUbicacion: callback para solicitar permiso de GPS
// - leyendas: avisos sobre el mapa [{ id, contenido }] (opcional)
// - titulo: si se pasa null, no se muestra el título
function MapaTunja({
  titulo = 'Ubicación en Tunja',
  estaciones = [],
  punto = null,
  ruta = [],
  ubicacionActual = null,
  idEstacionMasCercana = null,
  distanciaMasCercanaTexto = '',
  mostrarLineaCercana = true,
  onSeleccionar,
  onSeleccionarEstacion,
  onActivarUbicacion,
  ayuda,
  leyendas = [],
  nota,
}) {
  const seleccionable = typeof onSeleccionar === 'function';
  const [triggerCentrado, setTriggerCentrado] = useState(0);

  // Encontrar la estación más cercana para conectar con línea punteada
  const estacionMasCercana = estaciones.find(
    (e) => (idEstacionMasCercana && e.id === idEstacionMasCercana) || e.esMasCercana
  );

  // Si la ubicación está fuera de los límites estrictos de Tunja (ej. durante pruebas remotas),
  // relajamos maxBounds para que el usuario pueda ver su ubicación exacta sin restricciones.
  const fueraDeTunja = ubicacionActual && !estaDentroDeTunja(ubicacionActual.lat, ubicacionActual.lng);
  const limitesEfectivos = fueraDeTunja ? null : TUNJA_LIMITES;
  const zoomMinimoEfectivo = fueraDeTunja ? 6 : 13;

  function centrarEnMiUbicacion() {
    if (ubicacionActual) {
      setTriggerCentrado((prev) => prev + 1);
    } else if (onActivarUbicacion) {
      onActivarUbicacion();
    }
  }

  return (
    <section className={`tarjeta ${styles.raiz}`}>
      {titulo && <h2 className={styles.titulo}>{titulo}</h2>}

      <div className={styles.contenedor}>
        <MapContainer
          center={ubicacionActual ? [ubicacionActual.lat, ubicacionActual.lng] : TUNJA_CENTRO}
          zoom={14}
          minZoom={zoomMinimoEfectivo}
          maxBounds={limitesEfectivos}
          maxBoundsViscosity={limitesEfectivos ? 1 : 0}
          className={styles.mapa}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ManejadorCamara destino={ubicacionActual} trigger={triggerCentrado} />

          {seleccionable && <CapturaClics onSeleccionar={onSeleccionar} />}

          {ruta.length > 1 && (
            <Polyline positions={ruta} pathOptions={{ className: styles.ruta, interactive: false }} />
          )}

          {/* Línea hacia la estación más cercana */}
          {mostrarLineaCercana &&
            ubicacionActual &&
            estacionMasCercana &&
            estacionMasCercana.lat != null &&
            estacionMasCercana.lng != null && (
              <Polyline
                positions={[
                  [ubicacionActual.lat, ubicacionActual.lng],
                  [estacionMasCercana.lat, estacionMasCercana.lng],
                ]}
                pathOptions={{
                  className: styles.lineaCercana,
                  dashArray: '6, 8',
                  interactive: false,
                }}
              />
            )}

          {/* Marcador de ubicación en tiempo real exacta */}
          {ubicacionActual && (
            <Marker
              position={[ubicacionActual.lat, ubicacionActual.lng]}
              icon={iconoActual}
              zIndexOffset={1000}
            >
              <Tooltip
                permanent
                direction="top"
                offset={[0, -14]}
                className={styles.etiquetaUbicacionActual}
              >
                <span className={styles.etiquetaUbicacionTexto}>
                  📍 Tu ubicación actual
                  {distanciaMasCercanaTexto && (
                    <span className={styles.etiquetaDistanciaSub}>
                      · Más cercana a {distanciaMasCercanaTexto}
                    </span>
                  )}
                </span>
              </Tooltip>
            </Marker>
          )}

          {/* Marcadores de estaciones */}
          {estaciones.map((estacion) => {
            const esCercana =
              (idEstacionMasCercana && estacion.id === idEstacionMasCercana) ||
              estacion.esMasCercana;

            return (
              <Marker
                key={estacion.id}
                position={[estacion.lat, estacion.lng]}
                icon={crearIconoEstacion(estacion.bicicletas, esCercana)}
                interactive={Boolean(onSeleccionarEstacion)}
                zIndexOffset={esCercana ? 500 : 0}
                eventHandlers={
                  onSeleccionarEstacion
                    ? {
                        click: () => onSeleccionarEstacion(estacion),
                      }
                    : undefined
                }
              >
                <Tooltip
                  permanent
                  direction="bottom"
                  offset={[0, 14]}
                  className={`${styles.etiqueta} ${esCercana ? styles.etiquetaCercana : ''}`}
                >
                  {esCercana ? `⭐ ${estacion.nombre}` : estacion.nombre}
                  {estacion.distanciaTexto ? ` (${estacion.distanciaTexto})` : ''}
                </Tooltip>
              </Marker>
            );
          })}

          {punto && (
            <Marker
              position={[punto.lat, punto.lng]}
              icon={iconoPunto}
              draggable={seleccionable}
              eventHandlers={{
                dragend(evento) {
                  const { lat, lng } = evento.target.getLatLng();
                  onSeleccionar(lat, lng);
                },
              }}
            />
          )}
        </MapContainer>

        {/* Botón flotante para centrar o activar ubicación en tiempo real */}
        <div className={styles.controlesFlotantes}>
          <button
            type="button"
            className={`${styles.botonGps} ${ubicacionActual ? styles.botonGpsActivo : ''}`}
            onClick={centrarEnMiUbicacion}
            title={ubicacionActual ? 'Centrar en mi ubicación actual' : 'Activar ubicación en tiempo real'}
            aria-label={ubicacionActual ? 'Centrar en mi ubicación actual' : 'Activar ubicación en tiempo real'}
          >
            <IconoGpsSvg />
            <span className={styles.botonGpsTexto}>
              {ubicacionActual ? 'Mi ubicación' : 'Ubicarme'}
            </span>
          </button>
        </div>

        {ayuda && <span className={styles.ayuda}>{ayuda}</span>}

        {leyendas.length > 0 && (
          <div className={styles.leyendas}>
            {leyendas.map((leyenda) => (
              <p key={leyenda.id} className={styles.leyenda}>
                {leyenda.contenido}
              </p>
            ))}
          </div>
        )}
      </div>

      {nota && <p className={styles.nota}>{nota}</p>}
    </section>
  );
}

export default MapaTunja;
