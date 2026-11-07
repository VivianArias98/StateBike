import styles from './ViajeBanner.module.css';

// Banner superior del viaje en curso. Solo dibuja, no guarda estado.
function ViajeBanner({ usuario }) {
  return (
    <section className={`tarjeta ${styles.raiz}`}>
      <div className={styles.texto}>
        <p className={styles.estado}>
          <span className={styles.punto} aria-hidden="true" />
          <span className={styles.titulo}>VIAJE INICIADO. ¡BUEN RECORRIDO!</span>
          <span className={styles.chip}>EN CURSO</span>
        </p>
        <p className={styles.subtitulo}>
          Tiene 40 minutos incluidos en su plan mensual para este trayecto. Devuélvela en una estación con anclajes libres.
        </p>
      </div>

      <span className={styles.usuario}>Usuario: {usuario}</span>
    </section>
  );
}

export default ViajeBanner;
