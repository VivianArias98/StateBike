import BarraProgreso from '../../../../components/BarraProgreso/BarraProgreso.jsx';
import { IconoCheck } from '../../../../components/Iconos/Iconos.jsx';
import { formatearPesos } from '../../formato.js';
import styles from './PlanActivo.module.css';

// Estado del plan vigente: tres bloques de tarjeta (pagos, vigencia y hardware, condiciones y acciones).
function PlanActivo({ plan, nfc, diasUsados, inicio, fin, pagado, onCancelar, onVerHistorial }) {
  const diasRestantes = plan.dias - diasUsados;
  const porcentaje = Math.round((diasUsados / plan.dias) * 100);

  return (
    <section className={`tarjeta ${styles.raiz}`} aria-labelledby="plan-activo-titulo">
      <header className={styles.cabecera}>
        <p id="plan-activo-titulo" className={styles.estado}>
          <span className="punto-vivo" aria-hidden="true" /> Plan actualmente activo
        </p>
        <span className={styles.pastilla}>Estado: suscripción activa</span>
      </header>

      {/* Tipo de suscripción y estado de pagos: UNA tarjeta con línea divisoria */}
      <div className={styles.resumen}>
        <div className={styles.columna}>
          <div className={styles.filaEtiqueta}>
            <p className={styles.etiqueta}>Tipo de suscripción</p>
            <p className={styles.etiqueta}>Código: {plan.codigo}</p>
          </div>
          <h2 className={styles.nombrePlan}>{plan.nombre}</h2>
          <p className={styles.texto}>Tarifa plana recurrente con balance prepago en ciclo regular</p>
        </div>

        <div className={styles.columna}>
          <p className={styles.etiqueta}>Estado de pagos</p>
          <p className={styles.cifra}>
            {formatearPesos(pagado)} <span className={styles.unidad}>COP</span>
          </p>
          <p className={styles.texto}>Debitado de Mi Billetera</p>
          <p className={styles.alDia}>
            <span className={styles.check} aria-hidden="true">
              <IconoCheck />
            </span>
            Al día (Prepago debitado de Billetera)
          </p>
          <p className={styles.texto}>Sin saldos pendientes ni cobros por mora</p>
        </div>
      </div>

      <div className={styles.dosColumnas}>
        <section className={styles.panel} aria-labelledby="vigencia-titulo">
          <p id="vigencia-titulo" className={styles.etiqueta}>
            Vigencia, consumo y cronograma
          </p>
          <div className={styles.celdas}>
            <Celda etiqueta="Fecha de inicio" valor={inicio.fecha} detalle={inicio.hora} />
            <Celda etiqueta="Fecha de fin" valor={fin.fecha} detalle={fin.hora} />
            <Celda etiqueta="Días de uso" valor={`${diasUsados} días`} detalle="usados acumulado" />
            <Celda etiqueta="Días restantes" valor={`${diasRestantes} días`} detalle="restantes vigentes" destacada />
          </div>

          <BarraProgreso valor={diasUsados} maximo={plan.dias} etiqueta="Consumo del plan" />
          <div className={styles.leyendaBarra}>
            <span>Día 1 ({diasUsados} días usados)</span>
            <span className={styles.pastillaConsumo}>Consumo actual [{porcentaje}%]</span>
            <span>
              Día {plan.dias} ({diasRestantes} días restantes)
            </span>
          </div>
        </section>

        <section className={styles.panel} aria-labelledby="hardware-titulo">
          <p id="hardware-titulo" className={styles.etiqueta}>
            Vinculación de hardware
          </p>
          <p className={styles.texto}>Tarjeta NFC asociada:</p>
          <div className={styles.uid}>
            <p className={styles.uidTitulo}>
              UID <strong>#{nfc}</strong>
            </p>
            <p className={styles.texto}>(Activa y habilitada para desanclaje de bicicletas)</p>
          </div>
          <p className={styles.sensor}>
            <span className="punto-vivo" aria-hidden="true" /> Sensor terminal listo para validación en tótem
          </p>
        </section>
      </div>

      <div className={styles.dosColumnas}>
        <section className={styles.panel} aria-labelledby="condiciones-titulo">
          <div className={styles.filaEtiqueta}>
            <p id="condiciones-titulo" className={styles.etiqueta}>
              Condiciones contratadas congeladas
            </p>
            <span className={styles.pastillaProtocolo}>Protocolo: inmutable</span>
          </div>
          <div className={styles.celdas}>
            <Celda etiqueta="Límite por jornada" valor={`${plan.viajesDia} viajes por día`} />
            <Celda etiqueta="Ventana de trayecto" valor={`${plan.minutosViaje} minutos máx.`} />
            <Celda etiqueta="Minuto de exceso" valor="$100 COP / min" />
          </div>
        </section>

        <section className={styles.panel} aria-labelledby="acciones-titulo">
          <p id="acciones-titulo" className={styles.etiqueta}>
            Acciones de gestión disponibles
          </p>
          <button type="button" className={`boton boton--bloque ${styles.accion}`} onClick={onVerHistorial}>
            Ver historial de viajes y pagos
          </button>
          <button type="button" className={`boton boton--bloque ${styles.cancelar}`} onClick={onCancelar}>
            Cancelar plan
          </button>
          <p className={styles.ayuda}>Inicia el proceso de cancelación sin reembolso de vigencia restante.</p>
        </section>
      </div>
    </section>
  );
}

// Celda de dato dentro de un panel
function Celda({ etiqueta, valor, detalle, destacada = false }) {
  return (
    <div className={destacada ? `${styles.celda} ${styles.celdaDestacada}` : styles.celda}>
      <p className={styles.etiquetaCelda}>{etiqueta}</p>
      <p className={styles.valorCelda}>{valor}</p>
      {detalle && <p className={styles.detalleCelda}>{detalle}</p>}
    </div>
  );
}

export default PlanActivo;
