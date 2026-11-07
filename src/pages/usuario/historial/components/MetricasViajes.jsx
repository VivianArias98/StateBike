import styles from './MetricasViajes.module.css';

// Una sola tarjeta dividida en tres columnas: total, tiempo acumulado y periodo consultado.
function MetricasViajes({ total, minutos, horas, periodo }) {
  return (
    <section className={`tarjeta ${styles.raiz}`} aria-label="Resumen del periodo consultado">
      <div className={styles.celda}>
        <p className={styles.etiqueta}>Total recorridos</p>
        <p className={styles.valor}>
          {total} <span className={styles.unidad}>viajes registrados</span>
        </p>
      </div>

      <div className={styles.celda}>
        <p className={styles.etiqueta}>Tiempo total acumulado</p>
        <p className={styles.valor}>
          {minutos} min <span className={styles.insignia}>({horas})</span>
        </p>
      </div>

      <div className={`${styles.celda} ${styles.celdaVerde}`}>
        <p className={styles.etiqueta}>Periodo consultado</p>
        <span className={styles.periodo}>{periodo}</span>
      </div>
    </section>
  );
}

export default MetricasViajes;
