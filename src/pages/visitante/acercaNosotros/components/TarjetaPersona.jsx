import styles from './TarjetaPersona.module.css';

// Tarjeta de integrante del equipo. Si no hay foto se muestran las iniciales.
function TarjetaPersona({ iniciales, nombre, rol, cita, foto }) {
  return (
    <article className={`tarjeta ${styles.raiz}`}>
      {foto ? (
        <img src={foto} alt={`Foto de ${nombre}`} className={styles.foto} loading="lazy" />
      ) : (
        <span className={styles.avatar} aria-hidden="true">{iniciales}</span>
      )}
      <h3 className={styles.nombre}>{nombre}</h3>
      <span className={`insignia ${styles.rol}`}>{rol}</span>
      <p className={styles.cita}>{cita}</p>
    </article>
  );
}

export default TarjetaPersona;
