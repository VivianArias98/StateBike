import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TUNJA_CENTRO, TUNJA_LIMITES } from './limitesTunja.js';
// Importar los estilos de Leaflet ANTES del módulo propio (el módulo debe ganar)
import styles from './MapaTunja.module.css';

// Iconos propios
const iconoPunto = L.divIcon({
  className: styles.punto,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const iconoActual = L.divIcon({
  className: styles.actual,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

function crearIconoEstacion(bicicletas) {
  return L.divIcon({
    className: styles.estacion,
    html: String(Number(bicicletas) || 0),
    iconSize: [36, 36],
    iconAnchor: [18, 18],
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

// Componente de presentación: no guarda estado, todo llega por props.
// - estaciones: estaciones de referencia [{ id, nombre, lat, lng, bicicletas }]
// - punto: ubicación elegida { lat, lng } o null
// - onSeleccionar: si se pasa, el mapa es clicable y el punto se puede arrastrar
// - ruta: recorrido [[lat, lng], ...] que se dibuja como una línea (opcional)
// - ubicacionActual: { lat, lng } o null (opcional)
// - leyendas: avisos sobre el mapa [{ id, contenido }] (opcional)
// - titulo: si se pasa null, no se muestra el título
function MapaTunja({
  titulo = 'Ubicación en Tunja',
  estaciones = [],
  punto = null,
  ruta = [],
  ubicacionActual = null,
  onSeleccionar,
  ayuda,
  leyendas = [],
  nota,
}) {
  const seleccionable = typeof onSeleccionar === 'function';

  return (
    <section className={`tarjeta ${styles.raiz}`}>
      {titulo && <h2 className={styles.titulo}>{titulo}</h2>}

      <div className={styles.contenedor}>
        <MapContainer
          center={TUNJA_CENTRO}
          zoom={14}
          minZoom={13}
          maxBounds={TUNJA_LIMITES}
          maxBoundsViscosity={1}
          className={styles.mapa}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {seleccionable && <CapturaClics onSeleccionar={onSeleccionar} />}

          {ruta.length > 1 && (
            <Polyline positions={ruta} pathOptions={{ className: styles.ruta, interactive: false }} />
          )}

          {ubicacionActual && (
            <Marker
              position={[ubicacionActual.lat, ubicacionActual.lng]}
              icon={iconoActual}
              interactive={false}
            />
          )}

          {estaciones.map((estacion) => (
            <Marker
              key={estacion.id}
              position={[estacion.lat, estacion.lng]}
              icon={crearIconoEstacion(estacion.bicicletas)}
              interactive={false}
            >
              <Tooltip
                permanent
                direction="bottom"
                offset={[0, 14]}
                className={styles.etiqueta}
              >
                {estacion.nombre}
              </Tooltip>
            </Marker>
          ))}

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
