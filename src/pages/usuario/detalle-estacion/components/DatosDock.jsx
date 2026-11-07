import styles from './DatosDock.module.css';

// Datos técnicos de la estación: cada dato va en una tarjeta pequeña dentro del panel
function DatosDock({ datos }) {
  return (
    <dl className={styles.raiz}>
      {datos.map((dato) => (
        <div key={dato.etiqueta} className={styles.tarjeta}>
          <dt className={styles.etiqueta}>{dato.etiqueta}</dt>
          <dd className={dato.destacado ? `${styles.valor} ${styles.destacado}` : styles.valor}>{dato.valor}</dd>
        </div>
      ))}
    </dl>
  );
}

export default DatosDock;
