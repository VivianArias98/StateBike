import EncabezadoPaso from './components/EncabezadoPaso.jsx';
import FilaDato from '../../../components/FilaDato/FilaDato.jsx';
import Etiqueta from '../../../components/Etiqueta/Etiqueta.jsx';
import BarraProgreso from '../../../components/BarraProgreso/BarraProgreso.jsx';
import { formatearCOP, formatearFechaHora } from '../../../utils/formatoMoneda.js';
import styles from './PagarCobro.module.css';

// Paso 1: verificar saldo y detalle del cobro. Paso 2 (con comprobante): pago confirmado.
function PagarCobro({ saldo, cobro, comprobante, enviando, error, onConfirmar, onRecargar, onVolver }) {
  // ---- Paso 2: comprobante ----
  if (comprobante) {
    const pagado = comprobante.cobro;
    return (
      <div className={styles.raiz}>
        <EncabezadoPaso
          titulo="Pagar Cobro Pendiente"
          subtitulo="Paso 2 de 2: Comprobante de pago exitoso y cuenta al día."
          paso="PASO 2 / 2"
          onVolver={onVolver}
        />
        <section className={`tarjeta ${styles.bloque}`}>
          <Etiqueta texto="PAGADO" color="verde" />
          <h2 className={styles.exito}>COBRO PENDIENTE PAGADO CORRECTAMENTE</h2>
          <p>
            El cobro por exceso de tiempo ha sido debitado de su billetera. Su cuenta se
            encuentra al día y ya puede desbloquear bicicletas e iniciar nuevos viajes.
          </p>
          <p className={styles.referencia}>Comprobante #{comprobante.referencia}</p>
          <dl>
            <FilaDato etiqueta="Concepto registrado" valor="Exceso de tiempo" />
            <FilaDato etiqueta="Viaje asociado" valor={`#${pagado.viaje} (${pagado.ruta})`} />
            <FilaDato etiqueta="Minutos liquidados" valor={`${pagado.minutosExceso} de exceso`} />
            <FilaDato etiqueta="Método de pago" valor={comprobante.metodo} />
            <FilaDato etiqueta="Fecha y hora" valor={formatearFechaHora(comprobante.fecha)} />
            <FilaDato etiqueta="Total débito realizado" valor={`${formatearCOP(pagado.total)} COP`} tono="positivo" />
            <FilaDato etiqueta="Saldo anterior" valor={`${formatearCOP(comprobante.saldoAnterior)} COP`} />
            <FilaDato etiqueta="Nuevo saldo" valor={`${formatearCOP(comprobante.saldoNuevo)} COP`} tono="positivo" />
          </dl>
          <button type="button" className="boton boton--secundario" onClick={onVolver}>
            Ir a Mi Billetera
          </button>
        </section>
      </div>
    );
  }

  // ---- Paso 1: detalle y confirmación ----
  const saldoRestante = saldo - cobro.total;
  const saldoSuficiente = saldoRestante >= 0;

  return (
    <div className={styles.raiz}>
      <EncabezadoPaso
        titulo="Pagar Cobro Pendiente"
        subtitulo="Paso 1 de 2: Verificación de saldo y resumen de cobro por exceso de tiempo."
        paso="PASO 1 / 2"
        onVolver={onVolver}
      />

      <section className={`tarjeta ${styles.saldo}`}>
        <div>
          <span className={styles.etiqueta}>Saldo disponible en billetera</span>
          <p className={styles.monto}>{formatearCOP(saldo)} COP</p>
        </div>
        <Etiqueta
          texto={saldoSuficiente ? 'SALDO SUFICIENTE' : 'SALDO INSUFICIENTE'}
          color={saldoSuficiente ? 'verde' : 'amarilla'}
        />
      </section>

      <section className={`tarjeta ${styles.bloque}`}>
        <header className={styles.encabezadoBloque}>
          <h2 className={styles.etiqueta}>Detalle del cobro pendiente</h2>
          <Etiqueta texto="PENDIENTE" color="amarilla" />
        </header>
        <dl>
          <FilaDato etiqueta="Identificador del cobro" valor={`#${cobro.id}`} />
          <FilaDato etiqueta="Viaje asociado" valor={`#${cobro.viaje} (${cobro.ruta})`} />
          <FilaDato etiqueta="Fecha del viaje" valor={formatearFechaHora(cobro.fechaViaje)} />
          <FilaDato etiqueta="Tiempo utilizado" valor={`${cobro.minutosUsados} min (límite del plan: ${cobro.minutosLimite} min)`} />
          <FilaDato etiqueta="Minutos de exceso" valor={`+ ${cobro.minutosExceso} minutos`} tono="negativo" />
          <FilaDato etiqueta="Tarifa por minuto de exceso" valor={`${formatearCOP(cobro.tarifaMinuto)} COP / min`} />
          <FilaDato etiqueta="Total a pagar" valor={`${formatearCOP(cobro.total)} COP`} tono="positivo" />
        </dl>
      </section>

      <section className={`tarjeta ${styles.bloque}`}>
        <h2 className={styles.etiqueta}>Desglose financiero y balance resultante</h2>
        <dl>
          <FilaDato etiqueta="Saldo actual en billetera" valor={`${formatearCOP(saldo)} COP`} />
          <FilaDato etiqueta="Menos monto a debitar" valor={`- ${formatearCOP(cobro.total)} COP`} tono="negativo" />
        </dl>
        <BarraProgreso valor={Math.min(cobro.total, saldo)} maximo={Math.max(saldo, 1)} etiqueta="Porcentaje del saldo que se debitará" />
        <p className={styles.restante}>
          Saldo restante estimado:{' '}
          <strong>{saldoSuficiente ? `${formatearCOP(saldoRestante)} COP` : 'saldo insuficiente'}</strong>
        </p>
      </section>

      <p className={`tarjeta ${styles.aviso}`}>
        Al confirmar el pago, el cobro pasará al estado PAGADO y quedará registrado en sus
        movimientos con el concepto «Exceso de tiempo». Quedará habilitado inmediatamente para
        desbloquear bicicletas e iniciar nuevos viajes en cualquiera de las estaciones del sistema.
      </p>

      {!saldoSuficiente && (
        <p className="mensaje-error" role="alert">
          Saldo insuficiente. Le faltan {formatearCOP(-saldoRestante)}. Recargue su saldo
        </p>
      )}
      {error && (
        <p className="mensaje-error" role="alert">
          {error}
        </p>
      )}

      <div className={styles.acciones}>
        <button type="button" className="boton" onClick={onVolver}>
          Cancelar
        </button>
        {!saldoSuficiente && (
          <button type="button" className="boton boton--primario" onClick={onRecargar}>
            Recargar saldo
          </button>
        )}
        <button
          type="button"
          className="boton boton--secundario"
          onClick={onConfirmar}
          disabled={!saldoSuficiente || enviando}
        >
          {enviando ? 'Procesando…' : `Confirmar y pagar ${formatearCOP(cobro.total)} COP`}
        </button>
      </div>
    </div>
  );
}

export default PagarCobro;
