import { IconoCandado, IconoFlecha } from '../../../../components/Iconos/Iconos.jsx';
import ListaDatos from '../../components/ListaDatos.jsx';
import { formatearPesos } from '../../formato.js';
import styles from './PasoResumenPago.module.css';

// Paso 3: resumen de las condiciones del plan y confirmación del pago
function PasoResumenPago({ plan, nfc, saldo, autorizado, onAutorizar, onModificar, onConfirmar }) {
  const costo = plan.precio;
  const saldoRemanente = saldo - costo;
  // Texto del concepto que aparece en el historial de la billetera: "COMPRA PLAN MENSUAL"
  const concepto = `COMPRA ${plan.nombre.replace('Plan ', 'PLAN ').toUpperCase()}`;

  const condiciones = [
    { etiqueta: 'Plan seleccionado', valor: plan.nombre },
    { etiqueta: 'Costo del plan', valor: `${formatearPesos(costo)} COP` },
    { etiqueta: 'Tarjeta NFC asociada', valor: `#${nfc}` },
    { etiqueta: 'Vigencia del plan', valor: `${plan.dias} días` },
    { etiqueta: 'Viajes por día', valor: `${plan.viajesDia} viajes al día` },
    { etiqueta: 'Tiempo límite por trayecto', valor: `${plan.minutosViaje} minutos` },
    { etiqueta: 'Minuto de exceso', valor: '$100 COP / min' },
    { etiqueta: 'Fecha estimada de fin', valor: `${plan.dias} días a partir del pago` },
  ];

  return (
    <div className={styles.contenido}>
      <section className={`tarjeta ${styles.bloque}`} aria-labelledby="resumen-titulo">
        <h2 id="resumen-titulo" className={styles.titulo}>
          Resumen de compra
        </h2>
        <p className={styles.texto}>Detalles y condiciones de liquidación</p>

        <ListaDatos datos={condiciones} />

        <div className={`contexto-oscuro ${styles.liquidacion}`}>
          <div>
            <p className={styles.etiquetaLiquidacion}>Liquidación directa</p>
            <p className={styles.tituloLiquidacion}>Total a liquidar</p>
          </div>
          <p className={styles.cifraLiquidacion}>
            {formatearPesos(costo)} <span>COP</span>
          </p>
        </div>
      </section>

      <section className={`tarjeta ${styles.bloque}`} aria-labelledby="pago-titulo">
        <h2 id="pago-titulo" className={styles.titulo}>
          Confirmación de pago
        </h2>

        <div className={styles.metodo}>
          <div className={styles.filaMetodo}>
            <p className={styles.etiqueta}>Método de pago</p>
            <button type="button" className={`enlace ${styles.cambiar}`}>
              Cambiar
            </button>
          </div>
          <p className={styles.tituloMetodo}>Saldo en Mi Billetera</p>
          <p className={styles.texto}>(débito directo)</p>
        </div>

        <ListaDatos
          datos={[
            { etiqueta: 'Saldo actual disponible', valor: `${formatearPesos(saldo)} COP` },
            { etiqueta: 'Descuento por compra', valor: `- ${formatearPesos(costo)} COP` },
            { etiqueta: 'Saldo remanente proyectado', valor: `${formatearPesos(saldoRemanente)} COP` },
          ]}
        />

        <label className={styles.autorizacion}>
          <input
            type="checkbox"
            className={styles.casilla}
            checked={autorizado}
            onChange={(evento) => onAutorizar(evento.target.checked)}
          />
          <span>
            Autorizo el débito de <strong>{formatearPesos(costo)} COP</strong> de mi saldo en Mi Billetera para la
            activación del plan en <strong>StationBike</strong>.
          </span>
        </label>

        <p className={styles.registro}>
          <strong>Registro de movimiento:</strong> el pago se registrará como un movimiento en el historial de Mi
          Billetera bajo el concepto «{concepto}».
        </p>

        <button
          type="button"
          className="boton boton--acento boton--bloque"
          disabled={!autorizado}
          onClick={onConfirmar}
        >
          <IconoFlecha /> Pagar y confirmar {formatearPesos(costo)} COP
        </button>
        <button type="button" className="boton boton--bloque" onClick={onModificar}>
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
