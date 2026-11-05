import Etiqueta from '../../../components/Etiqueta/Etiqueta.jsx';
import { formatearCOP, formatearFechaHora } from '../../../utils/formatoMoneda.js';
import styles from './MiPlan.module.css';

const COLOR_ESTADO = { ACTIVO: 'verde', CANCELADO: 'amarilla', VENCIDO: 'amarilla' };

// Vista inicial del módulo: plan actual (si lo hay) y acciones Adquirir / Cancelar
function MiPlan({ plan, saldo, error, onAdquirir, onCancelar }) {
  const vigente = Boolean(plan) && plan.estado === 'ACTIVO';

  return (
    <div className={styles.raiz}>
      <header className={styles.encabezado}>
        <h1 className={styles.titulo}>Mi Plan</h1>
        <p className={styles.subtitulo}>
          Adquiere un plan con el saldo de tu billetera o cancela el que tienes vigente.
        </p>
      </header>

      {error && (
        <p className="mensaje-error" role="alert">
          {error}
        </p>
      )}

      <section className={`tarjeta ${styles.bloque}`}>
        {plan ? (
          <>
            <header className={styles.fila}>
              <h2 className={styles.nombre}>{plan.nombre}</h2>
              <Etiqueta texto={plan.estado} color={COLOR_ESTADO[plan.estado]} conPunto={vigente} />
            </header>
            <dl className={styles.datos}>
              <div><dt>Costo</dt><dd>{formatearCOP(plan.costo)} COP</dd></div>
              <div><dt>Inicio</dt><dd>{formatearFechaHora(plan.fechaInicio)}</dd></div>
              <div><dt>Fin</dt><dd>{formatearFechaHora(plan.fechaFin)}</dd></div>
              <div><dt>Viajes por día</dt><dd>{plan.viajesPorDia}</dd></div>
              <div><dt>Tiempo por viaje</dt><dd>{plan.minutosPorViaje} min</dd></div>
              <div><dt>Minuto de exceso</dt><dd>{formatearCOP(plan.tarifaMinutoExceso)} COP</dd></div>
              {plan.fechaCancelacion && (
                <div><dt>Cancelado el</dt><dd>{formatearFechaHora(plan.fechaCancelacion)}</dd></div>
              )}
            </dl>
          </>
        ) : (
          <p className={styles.sinPlan}>Aún no has adquirido ningún plan.</p>
        )}
        <p className={styles.saldo}>
          Saldo disponible en billetera: <strong>{formatearCOP(saldo)} COP</strong>
        </p>
      </section>

      <div className={styles.acciones}>
        <button type="button" className="boton boton--secundario" onClick={onAdquirir}>
          Adquirir plan
        </button>
        {vigente && (
          <button type="button" className="boton" onClick={onCancelar}>
            Cancelar plan
          </button>
        )}
      </div>
    </div>
  );
}

export default MiPlan;
