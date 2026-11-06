import Etiqueta from '../../../../components/Etiqueta/Etiqueta.jsx';
import styles from './EncabezadoPaso.module.css';

// Encabezado de las pantallas de varios pasos (Recargar saldo, Pagar cobro pendiente)
function EncabezadoPaso({ titulo, subtitulo, paso, onVolver }) {
  return (
    <header className={styles.raiz}>
      <button type="button" className={`enlace ${styles.volver}`} onClick={onVolver}>
        ← Volver a Mi Billetera
      </button>
      <div className={styles.fila}>
        <div className={styles.textos}>
          <h1 className={styles.titulo}>{titulo}</h1>
          <p className={styles.subtitulo}>{subtitulo}</p>
        </div>
        <Etiqueta texto={paso} color="menta" />
      </div>
    </header>
  );
}

export default EncabezadoPaso;
