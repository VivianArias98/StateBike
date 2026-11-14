import styles from './MetricaUsuario.module.css';

// Tarjeta de cifra clave: etiqueta, valor destacado, detalle y un icono opcional.
// Se usa en inicio, detalle de estación, historiales y mi plan.
function MetricaUsuario({ etiqueta, valor, detalle, icono, extra }) {
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
      <div className={styles.cuerpo}>
        <div className={styles.valor}>{valor}</div>
        {extra && <div className={styles.extra}>{extra}</div>}
      </div>
      {detalle && <div className={styles.detalle}>{detalle}</div>}
    </article>
  );
}

export default MetricaUsuario;
