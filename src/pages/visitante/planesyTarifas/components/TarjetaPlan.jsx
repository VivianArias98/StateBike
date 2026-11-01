import styles from './TarjetaPlan.module.css';

function TarjetaPlan({ plan }) {
  return (
    <article className={`${styles.raiz} ${plan.destacado ? styles.destacado : ''}`}>
      {plan.destacado && <span className={styles.etiqueta}>Más elegido</span>}

      <h2 className={styles.nombre}>{plan.nombre}</h2>
      <p className={styles.costo}>{plan.costo}</p>

      <div className={styles.separador} />
      <p className={styles.referencia}>Tiempo de referencia</p>
      <p className={styles.minutos}>{plan.tiempo} min</p>
    </article>
  );
}

export default TarjetaPlan;