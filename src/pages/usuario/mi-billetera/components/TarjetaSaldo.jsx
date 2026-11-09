import { formatearPesos } from '../../formato.js';
import styles from './TarjetaSaldo.module.css';

// Saldo disponible de la billetera con el botón de recarga (HU_23)
function TarjetaSaldo({ saldo, onRecargar }) {
  return (
    <section className={styles.raiz} aria-label="Saldo disponible">
      <p className={styles.etiqueta}>SALDO DISPONIBLE</p>
      <p className={styles.monto}>
        {formatearPesos(saldo)} <span className={styles.moneda}>COP</span>
      </p>
      <p className={styles.descripcion}>
        Saldo utilizado para la adquisición de planes y el pago de minutos de exceso.
      </p>
      <button type="button" className={`boton boton--bloque ${styles.boton}`} onClick={onRecargar}>
        + Recargar saldo
      </button>
    </section>
  );
}

export default TarjetaSaldo;
