import styles from './FiltroFechas.module.css';

// Componente de presentación: barra de filtrado por rango de fechas.
// El estado de los campos y los handlers viven en HistorialPage.
function FiltroFechas({ desde, hasta, onDesde, onHasta, onConsultar, onLimpiar }) {
  return (
    <section className={`tarjeta ${styles.raiz}`}>
      <div className={styles.campos}>
        <div className="campo">
          <label htmlFor="historial-desde">Desde (fecha inicial)</label>
          <input
            id="historial-desde"
            type="date"
            className="input"
            value={desde}
            onChange={(e) => onDesde(e.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="historial-hasta">Hasta (fecha final)</label>
          <input
            id="historial-hasta"
            type="date"
            className="input"
            value={hasta}
            onChange={(e) => onHasta(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.acciones}>
        <button
          type="button"
          className="boton boton--primario"
          onClick={onConsultar}
        >
          🔍 Consultar
        </button>
        <button
          type="button"
          className="boton"
          onClick={onLimpiar}
        >
          Limpiar
        </button>
      </div>
    </section>
  );
}

export default FiltroFechas;
