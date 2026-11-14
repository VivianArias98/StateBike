import styles from './ComprobanteCobro.module.css';

// Comprobante del pago: viaje asociado, datos del cobro y fecha del pago
function ComprobanteCobro({ viajeId, datos, fechaPago }) {
  return (
    <section className={`tarjeta ${styles.raiz}`}>
      <header className={styles.cabecera}>
        <div>
          <p className={styles.rotulo}>COBRO POR EXCESO</p>
          <h2 className={styles.referencia}>Viaje #{viajeId}</h2>
        </div>
        <span className={styles.pagado}>Pagado</span>
      </header>

      <div className={styles.grilla}>
        {datos.map((dato) => (
          <div key={dato.etiqueta} className={styles.celda}>
            <p className={styles.etiqueta}>{dato.etiqueta}</p>
            <p className={styles.valor}>{dato.valor}</p>
          </div>
        ))}
        <div className={`${styles.celda} ${styles.celdaAncha}`}>
          <p className={styles.etiqueta}>Fecha y hora del pago</p>
          <p className={styles.valor}>{fechaPago}</p>
        </div>
      </div>
    </section>
  );
}

export default ComprobanteCobro;
