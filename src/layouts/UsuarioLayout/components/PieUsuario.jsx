import styles from './PieUsuario.module.css';

// Pie de página compartido del rol usuario
function PieUsuario() {
  return (
    <footer className={`contexto-oscuro ${styles.raiz}`}>
      <div className={styles.contenido}>
        <span>StationBike</span>
      </div>
    </footer>
  );
}

export default PieUsuario;