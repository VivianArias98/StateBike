import { IconoBilletera, IconoCandado, IconoFlecha, IconoInfo, IconoRecibo } from '../../../../components/Iconos/Iconos.jsx';
import { formatearPesos } from '../../formato.js';
import styles from './PasoResumenPago.module.css';

// Paso 3: revisar las condiciones del plan y autorizar el débito de la billetera
function PasoResumenPago({ plan, nfc, saldo, autorizado, onAutorizar, onModificar, onConfirmar }) {
  const saldoProyectado = saldo - plan.precio;
  const filas = [
    { etiqueta: 'Plan seleccionado:', valor: plan.nombre },
    { etiqueta: 'Costo del plan:', valor: `${formatearPesos(plan.precio)} COP`, destacado: true },
    { etiqueta: 'Tarjeta NFC asociada:', valor: `#${nfc}`, chip: true },
    { etiqueta: 'Vigencia del plan:', valor: plan.vigenciaTexto },
    { etiqueta: 'Viajes por día:', valor: plan.viajesDiaTexto },
    { etiqueta: 'Tiempo límite por trayecto:', valor: plan.tiempoTexto },
    { etiqueta: 'Minuto de exceso:', valor: '$100 COP / min', mono: true },
    { etiqueta: 'Fecha estimada de fin:', valor: plan.fechaFinTexto },
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
            <p className={styles.subtitulo}>Detalles y condiciones de liquidación</p>
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
          <div>
            <p className={styles.etiquetaLiquidacion}>Liquidación directa</p>
            <p className={styles.tituloLiquidacion}>Total a liquidar</p>
          </div>
          <p className={styles.totalCifra}>
            {formatearPesos(plan.precio)} <span className={styles.moneda}>COP</span>
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
          <div className={styles.metodoCabecera}>
            <span className={styles.etiqueta}>Método de pago</span>
            <button type="button" className="enlace">
              Cambiar
            </button>
          </div>
          <div className={styles.metodoCuerpo}>
            <span className={styles.radio} aria-hidden="true" />
            <div>
              <p className={styles.metodoNombre}>Saldo en Mi Billetera</p>
              <p className={styles.metodoDetalle}>(débito directo)</p>
            </div>
          </div>
        </div>

        <div className={styles.saldos}>
          <div className={styles.saldoFila}>
            <span>Saldo actual disponible:</span>
            <span className={styles.mono}>{formatearPesos(saldo)} COP</span>
          </div>
          <div className={styles.saldoFila}>
            <span className={styles.costo}>Descuento por compra:</span>
            <span className={`${styles.mono} ${styles.costo}`}>- {formatearPesos(plan.precio)} COP</span>
          </div>
          <div className={`${styles.saldoFila} ${styles.proyectado}`}>
            <span>Saldo remanente proyectado:</span>
            <span className={styles.precioVerde}>{formatearPesos(saldoProyectado)} COP</span>
          </div>
        </div>

        <label className={styles.autorizacion}>
          <input
            type="checkbox"
            checked={autorizado}
            onChange={(evento) => onAutorizar(evento.target.checked)}
          />
          <span>
            Autorizo el débito de <strong>{formatearPesos(plan.precio)} COP</strong> de mi saldo en Mi Billetera para la
            activación del plan en <strong>StationBike</strong>.
          </span>
        </label>

        <p className={styles.registro}>
          <IconoInfo />
          <span>
            <strong>Registro de movimiento:</strong> el pago se registrará como un movimiento en el historial de Mi
            Billetera bajo el concepto «Compra {plan.nombre.toLowerCase()}».
          </span>
        </p>

        <button
          type="button"
          className={`boton boton--acento boton--bloque ${styles.pagar}`}
          onClick={onConfirmar}
          disabled={!autorizado}
        >
          Pagar y confirmar {formatearPesos(plan.precio)} COP <IconoFlecha />
        </button>
        <button type="button" className={`boton boton--bloque ${styles.volver}`} onClick={onModificar}>
          Volver a modificar
        </button>

        <p className={styles.seguridad}>
          <IconoCandado /> Transacción segura 256-bit SSL municipal
        </p>
      </section>
    </div>
  );
}

export default PasoResumenPago;
