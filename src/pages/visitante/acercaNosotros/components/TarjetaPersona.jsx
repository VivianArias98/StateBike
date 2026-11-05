import styles from './TarjetaPersona.module.css';

// Tarjeta de integrante del equipo. Sin fotos todavía: se muestran las iniciales.
function TarjetaPersona({ iniciales, nombre, rol, cita }) {
  return (
    <article className={`tarjeta ${styles.raiz}`}>
      <span className={styles.avatar} aria-hidden="true">{iniciales}</span>
      <h3 className={styles.nombre}>{nombre}</h3>
      <span className={`insignia ${styles.rol}`}>{rol}</span>
      <p className={styles.cita}>{cita}</p>
    </article>
  );
}

export default TarjetaPersona;
