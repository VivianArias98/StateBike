import Etiqueta from '../../../../components/Etiqueta/Etiqueta.jsx';
import { formatearCOP } from '../../../../utils/formatoMoneda.js';
import styles from './TarjetaSaldo.module.css';

// Saldo disponible y botón para recargar
function TarjetaSaldo({ saldo, onRecargar }) {
  return (
    <section className={`tarjeta ${styles.raiz}`}>
      <header className={styles.encabezado}>
        <h2 className={styles.etiqueta}>Saldo disponible</h2>
        <Etiqueta texto="DISPONIBLE" color="menta" conPunto />
      </header>
      <p className={styles.monto}>
        {formatearCOP(saldo)} <span className={styles.moneda}>COP</span>
      </p>
      <p className={styles.nota}>
        Saldo utilizado para la adquisición de planes y deducción de minutos de exceso.
      </p>
      <button type="button" className="boton boton--secundario boton--bloque" onClick={onRecargar}>
        + Recargar saldo
      </button>
    </section>
  );
}

export default TarjetaSaldo;
