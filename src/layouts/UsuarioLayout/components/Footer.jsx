import styles from './Footer.module.css';

// Pie de página compartido del rol usuario
function Footer() {
  return (
    <footer className={`contexto-oscuro ${styles.raiz}`}>
      <div className={styles.contenido}>
        <span>StationBike</span>
      </div>
    </footer>
  );
}

export default Footer;
