import FilaDato from '../../../components/FilaDato/FilaDato.jsx';
import { formatearFechaHora } from '../../../utils/formatoMoneda.js';
import styles from './CancelarPlan.module.css';

const DIA_MS = 24 * 60 * 60 * 1000;

// Muestra fecha de fin, días restantes y la advertencia de no reembolso; pide confirmación.
function CancelarPlan({ plan, enviando, error, onConfirmar, onVolver }) {
  const diasRestantes = Math.max(Math.ceil((new Date(plan.fechaFin) - Date.now()) / DIA_MS), 0);

  return (
    <div className={styles.raiz}>
      <header className={styles.encabezado}>
        <h1 className={styles.titulo}>Cancelar plan</h1>
        <p className={styles.subtitulo}>{plan.nombre}</p>
      </header>

      <section className={`tarjeta ${styles.bloque}`}>
        <dl>
          <FilaDato etiqueta="Fecha de fin" valor={formatearFechaHora(plan.fechaFin)} />
          <FilaDato etiqueta="Días restantes" valor={diasRestantes} />
        </dl>
        <p className={styles.advertencia} role="alert">
          Perderá los días restantes y no habrá reembolso
        </p>
        <p className={styles.nota}>¿Desea cancelar el plan ahora?</p>
      </section>

      {error && (
        <p className="mensaje-error" role="alert">
          {error}
        </p>
      )}

      <div className={styles.acciones}>
        <button type="button" className="boton" onClick={onVolver}>
          No cancelar
        </button>
        <button type="button" className="boton boton--secundario" onClick={onConfirmar} disabled={enviando}>
          {enviando ? 'Procesando…' : 'Confirmar cancelación'}
        </button>
      </div>
    </div>
  );
}

export default CancelarPlan;
