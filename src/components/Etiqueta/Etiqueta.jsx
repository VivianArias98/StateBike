import styles from './Etiqueta.module.css';

// Etiqueta de color reutilizable: solo cambia el texto y el color.
function Etiqueta({ texto, color = 'menta' }) {
  return <span className={`${styles.raiz} ${styles[color]}`}>{texto}</span>;
}

export default Etiqueta;