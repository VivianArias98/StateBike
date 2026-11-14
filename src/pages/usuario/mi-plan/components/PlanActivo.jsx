import BarraProgreso from '../../../../components/BarraProgreso/BarraProgreso.jsx';
import { IconoCheck } from '../../../../components/Iconos/Iconos.jsx';
import { formatearPesos } from '../../formato.js';
import { formatearFechaBogota } from '../../../../utils/formatoMoneda.js';
import styles from './PlanActivo.module.css';

// Plan vigente del usuario (HU_17): pago, vigencia con barra de días, tarjeta asociada,
// condiciones congeladas al comprar y acciones. Solo dibuja; plan es la respuesta de GET /api/planes/mi-plan.
function PlanActivo({ plan, onCancelar, onVerHistorial }) {
  const { tarjeta } = plan;

  return (
    <section className={`tarjeta ${styles.raiz}`} aria-labelledby="plan-activo-titulo">
      <header className={styles.cabecera}>
        <p id="plan-activo-titulo" className={styles.estado}>
          <span className="punto-vivo" aria-hidden="true" /> Plan actualmente activo
        </p>
        <span className={styles.pastilla}>Estado: {plan.estado}</span>
      </header>

      <div className={styles.resumen}>
        <div className={styles.columna}>
          <p className={styles.etiqueta}>Tipo de suscripción</p>
          <h2 className={styles.nombrePlan}>{plan.nombre}</h2>
        </div>

        <div className={styles.columna}>
          <p className={styles.etiqueta}>Estado de pagos</p>
          <p className={styles.cifra}>
            {formatearPesos(plan.costoBase)} <span className={styles.unidad}>COP</span>
          </p>
          <p className={styles.texto}>Debitado de Mi Billetera</p>
          {plan.tieneCobroPendiente ? (
            <p className={styles.texto}>Tiene un pago pendiente por exceso de tiempo. Recargue su saldo para continuar</p>
          ) : (
            <p className={styles.alDia}>
              <span className={styles.check} aria-hidden="true">
                <IconoCheck />
              </span>
              Sin cobros pendientes
            </p>
          )}
        </div>
      </div>

      <div className={styles.dosColumnas}>
        <section className={styles.panel} aria-labelledby="vigencia-titulo">
          <p id="vigencia-titulo" className={styles.etiqueta}>
            Vigencia y consumo
          </p>
          <div className={styles.celdas}>
            <Celda etiqueta="Fecha de inicio" valor={formatearFechaBogota(plan.fechaInicio)} />
            <Celda etiqueta="Fecha de fin" valor={formatearFechaBogota(plan.fechaFin)} />
            <Celda etiqueta="Días de uso" valor={`${plan.diasUsados} días`} />
            <Celda etiqueta="Días restantes" valor={`${plan.diasRestantes} días`} destacada />
          </div>

          <BarraProgreso valor={plan.diasUsados} maximo={plan.vigenciaDias} etiqueta="Consumo del plan" />
          <div className={styles.leyendaBarra}>
            <span>{plan.diasUsados} días usados</span>
            <span className={styles.pastillaConsumo}>Consumo actual [{plan.porcentajeConsumo}%]</span>
            <span>{plan.diasRestantes} días restantes</span>
          </div>
        </section>

        <section className={styles.panel} aria-labelledby="hardware-titulo">
          <p id="hardware-titulo" className={styles.etiqueta}>
            Tarjeta asociada
          </p>
          {tarjeta ? (
            <div className={styles.uid}>
              <p className={styles.uidTitulo}>
                Tarjeta NFC <strong>(Vinculada)</strong>
              </p>
              <p className={styles.texto}>Estado: {tarjeta.estado}</p>
            </div>
          ) : (
            <p className={styles.texto}>No tiene una tarjeta NFC vinculada</p>
          )}
          <p className={styles.texto}>
            Viajes de hoy: {plan.viajesHoy} de {plan.viajesPorDia} ({plan.viajesRestantesHoy} disponibles)
          </p>
        </section>
      </div>

      <div className={styles.dosColumnas}>
        <section className={styles.panel} aria-labelledby="condiciones-titulo">
          <p id="condiciones-titulo" className={styles.etiqueta}>
            Condiciones contratadas
          </p>
          <div className={styles.celdas}>
            <Celda etiqueta="Viajes por día" valor={`${plan.viajesPorDia} viajes`} />
            <Celda etiqueta="Tiempo por viaje" valor={`${plan.tiempoViajeMin} minutos máx.`} />
            <Celda etiqueta="Minuto de exceso" valor={`${formatearPesos(plan.valorMinutoExceso)} COP / min`} />
          </div>
        </section>

        <section className={styles.panel} aria-labelledby="acciones-titulo">
          <p id="acciones-titulo" className={styles.etiqueta}>
            Acciones disponibles
          </p>
          <button type="button" className={`boton boton--bloque ${styles.accion}`} onClick={onVerHistorial}>
            Ver historial de viajes y pagos
          </button>
          <button type="button" className={`boton boton--bloque ${styles.cancelar}`} onClick={onCancelar}>
            Cancelar plan
          </button>
          <p className={styles.ayuda}>La cancelación es inmediata y sin reembolso de la vigencia restante.</p>
        </section>
      </div>
    </section>
  );
}

// Celda de dato dentro de un panel
function Celda({ etiqueta, valor, destacada = false }) {
  return (
    <div className={destacada ? `${styles.celda} ${styles.celdaDestacada}` : styles.celda}>
      <p className={styles.etiquetaCelda}>{etiqueta}</p>
      <p className={styles.valorCelda}>{valor}</p>
    </div>
  );
}

export default PlanActivo;
