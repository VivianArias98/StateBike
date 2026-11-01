import styles from './MapaBicicletas.module.css';

function MapaBicicletas({ estaciones, seleccionadaId, onSeleccionar }) {
  return (
    <div className={styles.contenedor}>
      <div className={styles.lienzo}>
        {estaciones.map((estacion) => {
          const activa = estacion.id === seleccionadaId;

          return (
            <button
              key={estacion.id}
              type="button"
              aria-label={`${estacion.nombre}: ${estacion.bicicletas} bicicletas disponibles`}
              aria-pressed={activa}
              className={`${styles.pin} ${activa ? styles.pinActivo : ''}`}
              style={{ left: `${estacion.x}%`, top: `${estacion.y}%` }}
              onClick={() => onSeleccionar(estacion.id)}
            >
              {estacion.bicicletas}
            </button>
          );
        })}
      </div>

      <p className={styles.leyenda}>
        <span className={styles.indicador} aria-hidden="true" />
        El número es la cantidad de bicicletas disponibles
      </p>
    </div>
  );
}

export default MapaBicicletas;