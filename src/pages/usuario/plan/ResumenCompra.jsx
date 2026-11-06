import FilaDato from '../../../components/FilaDato/FilaDato.jsx';
import { formatearCOP, formatearFechaHora } from '../../../utils/formatoMoneda.js';
import styles from './ResumenCompra.module.css';

const DIA_MS = 24 * 60 * 60 * 1000;

// Resumen de la compra en COP y confirmación. El saldo se valida al confirmar.
function ResumenCompra({ plan, saldo, enviando, error, onConfirmar, onVolver }) {
  const fechaFinEstimada = new Date(Date.now() + plan.vigenciaDias * DIA_MS).toISOString();

  return (
    <div className={styles.raiz}>
      <header className={styles.encabezado}>
        <h1 className={styles.titulo}>Resumen de la compra</h1>
        <p className={styles.subtitulo}>Revisa las condiciones del plan y confirma para pagar.</p>
      </header>

      <section className={`tarjeta ${styles.bloque}`}>
        <h2 className={styles.nombre}>{plan.nombre}</h2>
        <dl>
          <FilaDato etiqueta="Costo" valor={`${formatearCOP(plan.costo)} COP`} />
          <FilaDato etiqueta="Vigencia" valor={`${plan.vigenciaDias} ${plan.vigenciaDias === 1 ? 'día' : 'días'}`} />
          <FilaDato etiqueta="Viajes por día" valor={plan.viajesPorDia} />
          <FilaDato etiqueta="Tiempo por viaje" valor={`${plan.minutosPorViaje} min`} />
          <FilaDato etiqueta="Valor por minuto de exceso" valor={`${formatearCOP(plan.tarifaMinutoExceso)} COP`} />
          <FilaDato etiqueta="Fecha de fin estimada" valor={formatearFechaHora(fechaFinEstimada)} />
          <FilaDato etiqueta="Saldo disponible" valor={`${formatearCOP(saldo)} COP`} />
          <FilaDato etiqueta="Método de pago" valor="Saldo de billetera" />
        </dl>
      </section>

      {error && (
        <p className="mensaje-error" role="alert">
          {error}
        </p>
      )}

      <div className={styles.acciones}>
        <button type="button" className="boton" onClick={onVolver}>
          Cancelar
        </button>
        <button type="button" className="boton boton--secundario" onClick={onConfirmar} disabled={enviando}>
          {enviando ? 'Procesando…' : `Confirmar y pagar ${formatearCOP(plan.costo)} COP`}
        </button>
      </div>
    </div>
  );
}

export default ResumenCompra;
