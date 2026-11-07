import styles from './FiltroActivo.module.css';

// Barra inferior que explica el filtro activo y cuántos registros coinciden.
// Copia propia de la pantalla de historial (el compartido queda para otra tarea).
function FiltroActivo({ texto, estado }) {
  return (
    <section className={`tarjeta ${styles.raiz}`} aria-label="Filtro activo">
      <p className={styles.texto}>
        <span className={styles.titulo}>Filtro activo:</span> {texto}
      </p>
      <span className={styles.estado}>{estado}</span>
    </section>
  );
}

export default FiltroActivo;
