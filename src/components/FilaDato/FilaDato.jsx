import styles from './FilaDato.module.css';

// Fila "etiqueta ... valor" para comprobantes y detalles. Va dentro de un <dl>.
// tono: 'normal' | 'positivo' | 'negativo'
function FilaDato({ etiqueta, valor, tono = 'normal' }) {
  return (
    <div className={styles.raiz}>
      <dt className={styles.etiqueta}>{etiqueta}</dt>
      <dd className={`${styles.valor} ${styles[tono]}`}>{valor}</dd>
    </div>
  );
}

export default FilaDato;
