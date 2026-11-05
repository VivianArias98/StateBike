import styles from './FooterVisitante.module.css';

// Pie de página del visitante: fondo negro (superficie inversa) con la marca.
function FooterVisitante() {
  return (
    <footer className={`contexto-oscuro ${styles.raiz}`}>
      <span className={styles.marca}>StationBike</span>
    </footer>
  );
}

export default FooterVisitante;
