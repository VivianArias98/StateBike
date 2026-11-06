import styles from './ListaDatos.module.css';

// Pares etiqueta / valor. enTarjetas: cada dato se muestra como una pequeña tarjeta en cuadrícula.
function ListaDatos({ datos, enTarjetas = false }) {
  return (
    <dl className={enTarjetas ? `${styles.raiz} ${styles.enTarjetas}` : styles.raiz}>
      {datos.map((dato) => (
        <div key={dato.etiqueta} className={styles.dato}>
          <dt className={styles.etiqueta}>{dato.etiqueta}</dt>
          <dd className={styles.valor}>{dato.valor}</dd>
        </div>
      ))}
    </dl>
  );
}

export default ListaDatos;
