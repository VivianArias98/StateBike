import styles from './ComprobanteCobro.module.css';

// Tarjeta de comprobante: referencia oficial, datos del cobro y tarjeta NFC habilitada
function ComprobanteCobro({ referencia, datos, fechaPago, nfc }) {
  return (
    <section className={`tarjeta ${styles.raiz}`}>
      <header className={styles.cabecera}>
        <div>
          <p className={styles.rotulo}>REFERENCIA OFICIAL</p>
          <h2 className={styles.referencia}>{referencia}</h2>
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

      <div className={styles.nfc}>
        <div>
          <p className={styles.nfcTitulo}>TARJETA NFC HABILITADA</p>
          <p className={styles.nfcDetalle}>Lista para desbloquear bicicletas en cualquier estación.</p>
        </div>
        <span className={styles.nfcId}>{nfc}</span>
      </div>
    </section>
  );
}

export default ComprobanteCobro;
