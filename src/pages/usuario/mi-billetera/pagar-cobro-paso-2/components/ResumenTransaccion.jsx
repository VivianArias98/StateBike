import styles from './ResumenTransaccion.module.css';

// Total debitado y saldos antes y después del pago
function ResumenTransaccion({ total, saldoAnterior, nuevoSaldo, descuento }) {
  return (
    <div className={styles.raiz}>
      <section className={styles.total}>
        <div className={styles.totalCabecera}>
          <div>
            <p className={styles.rotulo}>TOTAL DÉBITO REALIZADO</p>
            <p className={styles.totalTitulo}>Monto Pagado</p>
          </div>
          <span className={styles.completado}>Completado</span>
        </div>
        <div className={styles.totalPie}>
          <span className={styles.totalValor}>{total}</span>
        </div>
      </section>

      <div className={styles.saldos}>
        <div className={styles.saldo}>
          <p className={styles.rotulo}>SALDO ANTERIOR</p>
          <p className={styles.saldoValor}>{saldoAnterior}</p>
          <p className={styles.descuento}>{descuento}</p>
        </div>
        <div className={styles.saldo}>
          <div className={styles.saldoCabecera}>
            <p className={styles.rotulo}>NUEVO SALDO</p>
            <span className={styles.activo}>Activo</span>
          </div>
          <p className={styles.saldoValor}>{nuevoSaldo}</p>
        </div>
      </div>
    </div>
  );
}

export default ResumenTransaccion;
