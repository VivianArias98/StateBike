import { MapContainer, TileLayer, Marker, Tooltip, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TUNJA_CENTRO, TUNJA_LIMITES } from './limitesTunja.js';
import './MapaTunja.css';

// Iconos propios
const iconoPunto = L.divIcon({
  className: 'mapa-tunja__punto',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function crearIconoEstacion(bicicletas) {
  return L.divIcon({
    className: 'mapa-tunja__estacion',
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
function MapaTunja({
  titulo = 'Ubicación en Tunja',
  estaciones = [],
  punto = null,
  onSeleccionar,
  ayuda,
  nota,
}) {
  const seleccionable = typeof onSeleccionar === 'function';

  return (
    <section className="mapa-tunja">
      <h2 className="mapa-tunja__titulo">{titulo}</h2>

      <div className="mapa-tunja__contenedor">
        <MapContainer
          center={TUNJA_CENTRO}
          zoom={14}
          minZoom={13}
          maxBounds={TUNJA_LIMITES}
          maxBoundsViscosity={1}
          className="mapa-tunja__mapa"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {seleccionable && <CapturaClics onSeleccionar={onSeleccionar} />}

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
                className="mapa-tunja__etiqueta"
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

        {ayuda && <span className="mapa-tunja__ayuda">{ayuda}</span>}
      </div>

      {nota && <p className="mapa-tunja__nota">{nota}</p>}
    </section>
  );
}

export default MapaTunja;