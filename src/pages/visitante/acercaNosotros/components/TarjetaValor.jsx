import styles from './TarjetaValor.module.css';

// Tarjeta pequeña de valor: código, título, texto y etiqueta técnica.
function TarjetaValor({ codigo, titulo, texto, etiqueta, icono }) {
  return (
    <article className={`tarjeta ${styles.raiz}`}>
      <span className={styles.codigo}>{codigo}</span>

      <h3 className={styles.titulo}>
        <span className={styles.icono} aria-hidden="true">{icono}</span>
        {titulo}
      </h3>

      <p className={styles.texto}>{texto}</p>

      <span className={styles.etiqueta}>{etiqueta}</span>
    </article>
  );
}

export default TarjetaValor;
