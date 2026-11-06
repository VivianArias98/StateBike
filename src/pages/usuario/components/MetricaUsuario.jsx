import styles from './MetricaUsuario.module.css';

// Tarjeta de cifra clave: etiqueta, valor destacado, detalle y un icono opcional.
// Se usa en inicio, detalle de estación, historiales y mi plan.
function MetricaUsuario({ etiqueta, valor, detalle, icono }) {
  return (
    <article className={`tarjeta ${styles.raiz}`}>
      <div className={styles.cabecera}>
        <p className={styles.etiqueta}>{etiqueta}</p>
        {icono && (
          <span className={styles.icono} aria-hidden="true">
            {icono}
          </span>
        )}
      </div>
      <p className={styles.valor}>{valor}</p>
      {detalle && <p className={styles.detalle}>{detalle}</p>}
    </article>
  );
}

export default MetricaUsuario;
