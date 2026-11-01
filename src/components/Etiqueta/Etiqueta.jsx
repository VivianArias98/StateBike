import styles from './Etiqueta.module.css';

// Etiqueta de color reutilizable: solo cambia el texto y el color.
// color: 'amarilla' | 'verde' | 'menta'
// conPunto: muestra el punto parpadeante antes del texto
function Etiqueta({ texto, color = 'menta', conPunto = false }) {
  return (
    <span className={`${styles.raiz} ${styles[color]}`}>
      {conPunto && <span className="punto-vivo" aria-hidden="true" />}
      {texto}
    </span>
  );
}

export default Etiqueta;