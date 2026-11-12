import styles from './FiltroFechas.module.css';

// Barra de filtro por rango de fechas (historial de viajes y de pagos).
// Los valores y los handlers viven en la página que la usa.
// idPrefijo evita ids repetidos cuando hay más de un filtro en la pantalla.
function FiltroFechas({ idPrefijo = 'filtro', desde, hasta, onDesde, onHasta, onConsultar, onLimpiar }) {
  return (
    <form
      className={`contexto-oscuro ${styles.raiz}`}
      aria-label="Filtrar por fechas"
      onSubmit={(e) => {
        e.preventDefault();
        onConsultar();
      }}
    >
      <div className={styles.campos}>
        <div className="campo">
          <label htmlFor={`${idPrefijo}-desde`}>Desde (fecha inicial)</label>
          <input
            id={`${idPrefijo}-desde`}
            type="date"
            className={`input ${styles.input}`}
            value={desde}
            onChange={(e) => onDesde(e.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor={`${idPrefijo}-hasta`}>Hasta (fecha final)</label>
          <input
            id={`${idPrefijo}-hasta`}
            type="date"
            className={`input ${styles.input}`}
            value={hasta}
            onChange={(e) => onHasta(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.acciones}>
        <button type="submit" className="boton boton--acento">
          Consultar
        </button>
        <button type="button" className="boton" onClick={onLimpiar}>
          Limpiar
        </button>
      </div>
    </form>
  );
}

export default FiltroFechas;
