import { formatearPesos } from '../../formato.js';
import styles from './DesgloseSaldo.module.css';

// Saldo actual, monto a debitar y saldo restante con su barra.
// Si el saldo no alcanza, el restante se muestra en $0 y la barra vacía.
function DesgloseSaldo({ saldo, debito }) {
  const restante = Math.max(0, saldo - debito);
  const porcentaje = saldo > 0 ? (restante / saldo) * 100 : 0;

  return (
    <section className={`tarjeta ${styles.raiz}`}>
      <header className={styles.cabecera}>
        <h2 className={styles.titulo}>DESGLOSE Y SALDO RESULTANTE</h2>
      </header>

      <div className={styles.cuerpo}>
        <div className={styles.fila}>
          <span>Saldo actual en billetera</span>
          <span>{formatearPesos(saldo)} COP</span>
        </div>
        <div className={`${styles.fila} ${styles.negativo}`}>
          <span>Menos monto a debitar</span>
          <span>- {formatearPesos(debito)} COP</span>
        </div>

        <div className={styles.barra} aria-hidden="true">
          {/* Ancho dinámico: única excepción permitida de estilo en línea */}
          <span className={styles.barraRestante} style={{ width: `${porcentaje}%` }} />
        </div>

        <div className={styles.resultado}>
          <p className={styles.resultadoTitulo}>Saldo restante estimado</p>
          <p className={styles.resultadoValor}>
            {formatearPesos(restante)} <span>COP</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default DesgloseSaldo;
