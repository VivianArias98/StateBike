import { IconoAlerta } from '../../../../components/Iconos/Iconos.jsx';
import { formatearPesos } from '../../formato.js';
import styles from './TarjetaCobroPendiente.module.css';

// Alerta de cobro pendiente por exceso de tiempo con el botón de pago (HU_23, HU_25).
// Si no hay cobro, informa que no tiene cobros pendientes.
function TarjetaCobroPendiente({ cobro, onPagar }) {
  if (!cobro) {
    return (
      <section className={styles.raiz} aria-label="Cobro pendiente">
        <p className={styles.etiqueta}>COBROS PENDIENTES</p>
        <p className={styles.sinCobro}>No tiene cobros pendientes</p>
      </section>
    );
  }

  return (
    <section className={`${styles.raiz} ${styles.alerta}`} aria-label="Cobro pendiente">
      <p className={styles.etiquetaAlerta}>ALERTA · COBRO PENDIENTE</p>
      <p className={styles.monto}>
        {formatearPesos(cobro.monto)} <span className={styles.moneda}>COP</span>
      </p>
      <div className={styles.concepto}>
        <p className={styles.etiqueta}>CONCEPTO ASOCIADO:</p>
        <p className={styles.textoConcepto}>
          Viaje #{cobro.id} · {cobro.minutosExceso} min de exceso
          {cobro.origen && cobro.destino && ` · ${cobro.origen} → ${cobro.destino}`}
        </p>
      </div>
      {cobro.mensaje && <p className={styles.mensaje}>{cobro.mensaje}</p>}
      <button type="button" className={`boton boton--bloque ${styles.boton}`} onClick={onPagar}>
        <IconoAlerta /> Pagar cobro pendiente
      </button>
    </section>
  );
}

export default TarjetaCobroPendiente;
