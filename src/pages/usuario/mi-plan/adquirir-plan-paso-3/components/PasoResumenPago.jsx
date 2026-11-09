import { IconoBilletera, IconoFlecha, IconoInfo, IconoRecibo } from '../../../../../components/Iconos/Iconos.jsx';
import { formatearPesos } from '../../../formato.js';
import { textoVigencia } from '../../planVista.js';
import styles from './PasoResumenPago.module.css';

// Paso 3: revisar las condiciones del plan y autorizar el débito de la billetera.
// Solo dibuja; la compra la hace la página con onConfirmar.
function PasoResumenPago({ plan, ultimosDigitos, saldo, autorizado, pagando, error, onAutorizar, onModificar, onConfirmar }) {
  const saldoProyectado = saldo - plan.costoBase;
  const filas = [
    { etiqueta: 'Plan seleccionado:', valor: plan.nombre },
    { etiqueta: 'Costo del plan:', valor: `${formatearPesos(plan.costoBase)} COP`, destacado: true },
    { etiqueta: 'Tarjeta NFC asociada:', valor: `•••• ${ultimosDigitos}`, chip: true },
    { etiqueta: 'Vigencia del plan:', valor: `${textoVigencia(plan.vigenciaDias)} desde el pago` },
    { etiqueta: 'Viajes por día:', valor: `${plan.viajesPorDia}` },
    { etiqueta: 'Tiempo límite por viaje:', valor: `${plan.tiempoViajeMin} minutos` },
    { etiqueta: 'Minuto de exceso:', valor: `${formatearPesos(plan.valorMinutoExceso)} COP / min`, mono: true },
  ];

  return (
    <div className={styles.columnas}>
      <section className={`tarjeta ${styles.resumen}`} aria-labelledby="resumen-titulo">
        <header className={styles.cabecera}>
          <span className={styles.icono} aria-hidden="true">
            <IconoRecibo />
          </span>
          <div>
            <h2 id="resumen-titulo" className={styles.titulo}>
              Resumen de Compra
            </h2>
            <p className={styles.subtitulo}>Condiciones del plan</p>
          </div>
        </header>

        <dl className={styles.lista}>
          {filas.map((fila) => (
            <div key={fila.etiqueta} className={styles.fila}>
              <dt>{fila.etiqueta}</dt>
              <dd className={fila.destacado ? styles.precioVerde : fila.mono ? styles.mono : ''}>
                {fila.chip ? <span className={styles.chip}>{fila.valor}</span> : fila.valor}
              </dd>
            </div>
          ))}
        </dl>

        <div className={styles.liquidacion}>
          <p className={styles.tituloLiquidacion}>Total a pagar</p>
          <p className={styles.totalCifra}>
            {formatearPesos(plan.costoBase)} <span className={styles.moneda}>COP</span>
          </p>
        </div>
      </section>

      <section className={`tarjeta ${styles.pago}`} aria-labelledby="pago-titulo">
        <header className={styles.cabecera}>
          <span className={styles.icono} aria-hidden="true">
            <IconoBilletera />
          </span>
          <div>
            <h2 id="pago-titulo" className={styles.titulo}>
              Confirmación de Pago
            </h2>
          </div>
        </header>

        <div className={styles.metodo}>
          <span className={styles.etiqueta}>Método de pago</span>
          <p className={styles.metodoNombre}>Saldo en Mi Billetera</p>
          <p className={styles.metodoDetalle}>(débito directo)</p>
        </div>

        <div className={styles.saldos}>
          <div className={styles.saldoFila}>
            <span>Saldo actual disponible:</span>
            <span className={styles.mono}>{formatearPesos(saldo)} COP</span>
          </div>
          <div className={styles.saldoFila}>
            <span className={styles.costo}>Descuento por compra:</span>
            <span className={`${styles.mono} ${styles.costo}`}>- {formatearPesos(plan.costoBase)} COP</span>
          </div>
          <div className={`${styles.saldoFila} ${styles.proyectado}`}>
            <span>Saldo remanente proyectado:</span>
            <span className={styles.precioVerde}>{formatearPesos(saldoProyectado)} COP</span>
          </div>
        </div>

        <label className={styles.autorizacion}>
          <input type="checkbox" checked={autorizado} onChange={(evento) => onAutorizar(evento.target.checked)} />
          <span>
            Autorizo el débito de <strong>{formatearPesos(plan.costoBase)} COP</strong> de mi saldo en Mi Billetera
            para la activación del plan.
          </span>
        </label>

        <p className={styles.registro}>
          <IconoInfo />
          <span>El pago queda registrado en los movimientos de Mi Billetera. La cancelación posterior no tiene reembolso.</span>
        </p>

        {error && (
          <p className="mensaje-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          className={`boton boton--acento boton--bloque ${styles.pagar}`}
          onClick={onConfirmar}
          disabled={!autorizado || pagando}
        >
          {pagando ? 'Procesando...' : `Pagar y confirmar ${formatearPesos(plan.costoBase)} COP`} <IconoFlecha />
        </button>
        <button type="button" className={`boton boton--bloque ${styles.volver}`} onClick={onModificar} disabled={pagando}>
          Volver a modificar
        </button>
      </section>
    </div>
  );
}

export default PasoResumenPago;
