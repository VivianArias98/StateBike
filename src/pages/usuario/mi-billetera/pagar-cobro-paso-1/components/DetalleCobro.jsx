import styles from './DetalleCobro.module.css';

// Detalle del cobro pendiente y total a pagar
function DetalleCobro({ filas, total }) {
  return (
    <section className={`tarjeta ${styles.raiz}`}>
      <header className={styles.cabecera}>
        <h2 className={styles.titulo}>DETALLE DEL COBRO PENDIENTE</h2>
        <span className={styles.pendiente}>PENDIENTE</span>
      </header>

      <dl className={styles.lista}>
        {filas.map((fila) => (
          <div key={fila.etiqueta} className={styles.fila}>
            <dt className={styles.etiqueta}>{fila.etiqueta}</dt>
            <dd className={`${styles.valor} ${fila.alerta ? styles.alerta : ''}`}>
              {fila.valor}
              {fila.detalle && <span className={styles.detalle}>{fila.detalle}</span>}
            </dd>
          </div>
        ))}
      </dl>

      <div className={styles.total}>
        <p className={styles.totalTitulo}>TOTAL A PAGAR</p>
        <p className={styles.totalValor}>{total}</p>
      </div>
    </section>
  );
}

export default DetalleCobro;
