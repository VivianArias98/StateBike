import Etiqueta from '../../../../components/Etiqueta/Etiqueta.jsx';
import { formatearCOP } from '../../../../utils/formatoMoneda.js';
import styles from './TarjetaCobroPendiente.module.css';

// Cobro por exceso de tiempo. Si no hay cobro, muestra que la cuenta está al día.
function TarjetaCobroPendiente({ cobro, onPagar }) {
  if (!cobro) {
    return (
      <section className={`tarjeta ${styles.raiz}`}>
        <h2 className={styles.alerta}>Cobros pendientes</h2>
        <p className={styles.alDia}>No tienes cobros pendientes. Tu cuenta está al día.</p>
      </section>
    );
  }

  return (
    <section className={`tarjeta ${styles.raiz}`}>
      <header className={styles.encabezado}>
        <h2 className={styles.alerta}>Alerta · Cobro pendiente</h2>
        <Etiqueta texto="ACCIÓN REQUERIDA" color="amarilla" />
      </header>
      <p className={styles.monto}>
        {formatearCOP(cobro.total)} <span className={styles.moneda}>COP</span>
      </p>
      <p className={styles.concepto}>
        <span className={styles.conceptoTitulo}>Concepto asociado:</span>
        Viaje #{cobro.viaje} · {cobro.minutosExceso} minutos de exceso
      </p>
      <button type="button" className="boton boton--primario boton--bloque" onClick={onPagar}>
        Pagar cobro pendiente
      </button>
    </section>
  );
}

export default TarjetaCobroPendiente;
