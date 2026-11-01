import styles from './BannerEstado.module.css';

// Muestra el estado del viaje y la referencia. Solo dibuja, no guarda estado.
function BannerEstado({ mensaje, referencia }) {
  return (
    <div className={styles.raiz}>
      <p className={styles.mensaje}>
        <span className={styles.icono} aria-hidden="true">✓</span>
        {mensaje}
      </p>
      <div className={styles.ref}>
        <span className={styles.refEtiqueta}>REF:</span>
        <strong className={styles.refCodigo}>{referencia}</strong>
      </div>
    </div>
  );
}

export default BannerEstado;
