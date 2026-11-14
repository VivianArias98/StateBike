import { IconoAlerta, IconoCheck } from '../../../../components/Iconos/Iconos.jsx';
import { formatearPesos } from '../../formato.js';
import styles from './TarjetaCobroPendiente.module.css';

// Alerta de cobro pendiente por exceso de tiempo con el botón de pago (HU_23, HU_25).
function TarjetaCobroPendiente({ cobro, onPagar }) {
  if (!cobro) {
    return (
      <section className={styles.raiz} aria-label="Cobro pendiente">
        <div className={styles.cabeceraSinCobro}>
          <div className={styles.iconoSinCobro} aria-hidden="true">
            <IconoCheck />
          </div>
          <div>
            <span className={styles.etiqueta}>ESTADO DE COBROS</span>
            <p className={styles.sinCobroTitulo}>Al día · Sin cobros pendientes</p>
          </div>
        </div>

        <p className={styles.sinCobroDescripcion}>
          No registras penalizaciones ni cobros pendientes por minutos de exceso. Puedes retirar y disfrutar tus bicicletas sin restricciones.
        </p>

        <div className={styles.avisoTranquilidad}>
          <span className={styles.puntoVerde} aria-hidden="true" />
          <span>Servicio habilitado y listo para viajes</span>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.raiz} ${styles.alerta}`} aria-label="Cobro pendiente">
      <div className={styles.cabeceraAlerta}>
        <div className={styles.iconoAlertaBox} aria-hidden="true">
          <IconoAlerta />
        </div>
        <div>
          <span className={styles.etiquetaAlerta}>ALERTA · COBRO PENDIENTE</span>
          <div className={styles.montoContenedor}>
            <span className={styles.monto}>{formatearPesos(cobro.monto)}</span>
            <span className={styles.moneda}>COP</span>
          </div>
        </div>
      </div>

      <div className={styles.concepto}>
        <span className={styles.etiquetaConcepto}>CONCEPTO ASOCIADO</span>
        <p className={styles.textoConcepto}>
          Viaje #{cobro.id} · {cobro.minutosExceso} min de exceso
          {cobro.origen && cobro.destino && ` (${cobro.origen} → ${cobro.destino})`}
        </p>
      </div>

      {cobro.mensaje && <p className={styles.mensaje}>{cobro.mensaje}</p>}

      <button
        type="button"
        className={`boton boton--primario boton--bloque ${styles.botonPagar}`}
        onClick={onPagar}
      >
        <IconoAlerta /> Pagar cobro pendiente
      </button>
    </section>
  );
}

export default TarjetaCobroPendiente;
