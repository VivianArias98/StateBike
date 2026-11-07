import styles from './DesgloseSaldo.module.css';

// Sección 02: saldo actual, monto a debitar y saldo restante con su barra
function DesgloseSaldo({ saldo, debito, restante, porcentaje }) {
  return (
    <section className={`tarjeta ${styles.raiz}`}>
      <header className={styles.cabecera}>
        <h2 className={styles.titulo}>SEC_02 // DESGLOSE FINANCIERO Y BALANCE RESULTANTE</h2>
      </header>

      <div className={styles.cuerpo}>
        <div className={styles.fila}>
          <span>Saldo actual en billetera</span>
          <span>{saldo} COP</span>
        </div>
        <div className={`${styles.fila} ${styles.negativo}`}>
          <span>Menos monto a debitar</span>
          <span>- {debito} COP</span>
        </div>

        <div className={styles.barra} aria-hidden="true">
          <span className={styles.barraRestante} style={{ width: `${porcentaje}%` }} />
        </div>

        <div className={styles.resultado}>
          <div>
            <p className={styles.resultadoTitulo}>Saldo restante estimado</p>
            <p className={styles.resultadoDetalle}>Disponible post-transacción inmediata</p>
          </div>
          <p className={styles.resultadoValor}>{restante} <span>COP</span></p>
        </div>
      </div>
    </section>
  );
}

export default DesgloseSaldo;
