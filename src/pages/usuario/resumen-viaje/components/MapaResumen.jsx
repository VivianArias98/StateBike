import MapaTunja from '../../../../components/MapaTunja/MapaTunja.jsx';
import styles from './MapaResumen.module.css';

// Envuelve MapaTunja para mostrar el recorrido del último viaje.
// Agrega el encabezado del mapa (ciudad, tramo y coordenadas) y el pie (velocidad y desnivel).
function MapaResumen({ estaciones, ruta, velocidad, desnivel, tramoCiclorruta }) {
  const leyendas = [
    {
      id: 'tramo',
      contenido: (
        <>
          <span className={styles.puntoOrigen} aria-hidden="true" />
          {tramoCiclorruta}
        </>
      ),
    },
  ];

  return (
    <div className={styles.raiz}>
      {/* Encabezado del mapa */}
      <div className={styles.encabezado}>
        <span className={styles.ciudad}>Tunja · Recorrido urbano</span>
        <span className={styles.coordenadas}>Coordenadas Urbanas Centro - Norte</span>
      </div>

      {/* Mapa Leaflet sin título propio (titulo=null) */}
      <div className={styles.mapa}>
        <MapaTunja
          titulo={null}
          estaciones={estaciones}
          ruta={ruta}
          leyendas={leyendas}
        />
      </div>

      {/* Pie del mapa */}
      <div className={styles.pie}>
        <span>Velocidad media estimada: <strong>{velocidad}</strong></span>
        <span>Desnivel: <strong>{desnivel}</strong></span>
      </div>
    </div>
  );
}

export default MapaResumen;
