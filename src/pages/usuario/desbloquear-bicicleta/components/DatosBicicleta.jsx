import styles from './DatosBicicleta.module.css';

// Paso 2: datos de la bicicleta a verificar. Encabezado negro y filas en tarjeta verde.
function DatosBicicleta({ titulo, datos }) {
  return (
    <section className={`tarjeta ${styles.raiz}`} aria-labelledby="verifica-titulo">
      <h2 id="verifica-titulo" className={styles.cabecera}>
        {titulo}
      </h2>
      <dl className={styles.filas}>
        {datos.map((dato) => (
          <div key={dato.etiqueta} className={styles.fila}>
            <dt className={styles.etiqueta}>{dato.etiqueta}</dt>
            <dd className={styles.valor}>{dato.valor}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default DatosBicicleta;
