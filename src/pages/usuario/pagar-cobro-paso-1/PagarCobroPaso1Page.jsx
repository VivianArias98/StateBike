import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import { IconoBilletera } from '../../../components/Iconos/Iconos.jsx';
import { formatearPesos } from '../formato.js';
import DetalleCobro from './components/DetalleCobro.jsx';
import DesgloseSaldo from './components/DesgloseSaldo.jsx';
import RecorridoCobro from './components/RecorridoCobro.jsx';
import styles from './PagarCobroPaso1Page.module.css';

// Datos de ejemplo tomados del PDF (sin backend todavía)
const SALDO = 35000;
const COBRO = {
  total: 2500,
  id: '#CP-2026-084',
  viaje: '#VIAJE-8831',
  recorrido: 'Recorrido Estación Plaza → Estación Terminal',
  fecha: '01 Nov 2026, 17:45',
  tiempo: '55 min',
  limite: '30 min',
  exceso: '+ 25 minutos',
  tarifa: '$100 COP / min',
};

function PagarCobroPaso1Page() {
  const restante = SALDO - COBRO.total;
  const filas = [
    { etiqueta: 'Identificador del cobro', valor: COBRO.id },
    { etiqueta: 'Viaje asociado', valor: COBRO.viaje, detalle: `(${COBRO.recorrido})` },
    { etiqueta: 'Fecha del viaje', valor: COBRO.fecha },
    { etiqueta: 'Tiempo utilizado', valor: COBRO.tiempo, detalle: `(Límite del plan: ${COBRO.limite})` },
    { etiqueta: 'Minutos de exceso', valor: COBRO.exceso, alerta: true },
    { etiqueta: 'Tarifa por minuto de exceso', valor: COBRO.tarifa },
  ];

  return (
    <UsuarioLayout itemActivo="Mi billetera">
      <div className={styles.raiz}>
        <button type="button" className={`enlace ${styles.volver}`}>
          ← Volver a Mi Billetera
        </button>

        <header className={styles.encabezado}>
          <div>
            <h1 className={styles.titulo}>Pagar Cobro Pendiente</h1>
            <p className={styles.subtitulo}>
              Paso 1 de 2: Verificación de saldo y resumen de cobro por exceso de tiempo
            </p>
          </div>
          <span className={styles.pasoBadge}>Paso 1 de 2</span>
        </header>

        <section className={`tarjeta ${styles.saldo}`}>
          <span className={styles.iconoSaldo} aria-hidden="true"><IconoBilletera /></span>
          <div className={styles.saldoTexto}>
            <p className={styles.saldoEtiqueta}>SALDO DISPONIBLE EN BILLETERA</p>
            <p className={styles.saldoValor}>
              {formatearPesos(SALDO)} <span className={styles.moneda}>COP</span>
            </p>
          </div>
          <span className={styles.chipSuficiente}>Saldo suficiente</span>
        </section>

        <div className={styles.principal}>
          <div className={styles.columna}>
            <DetalleCobro filas={filas} total={`${formatearPesos(COBRO.total)} COP`} />
            <DesgloseSaldo
              saldo={formatearPesos(SALDO)}
              debito={formatearPesos(COBRO.total)}
              restante={formatearPesos(restante)}
              porcentaje={(restante / SALDO) * 100}
            />
            <p className={styles.nota}>
              Al confirmar el pago, el cobro pasará al estado <strong>PAGADO</strong> y quedará registrado en sus movimientos con el concepto «Exceso de tiempo». Quedará habilitado inmediatamente para desbloquear bicicletas e iniciar nuevos viajes en cualquiera de las estaciones del sistema.
            </p>
            <div className={styles.acciones}>
              <button type="button" className={`boton boton--bloque ${styles.cancelar}`}>
                CANCELAR
              </button>
              <button type="button" className={`boton boton--bloque ${styles.confirmar}`}>
                CONFIRMAR Y PAGAR {formatearPesos(COBRO.total)} COP
              </button>
            </div>
          </div>

          <RecorridoCobro
            titular="Camila Rojas"
            nfc="#TUN-8831"
            monto={`${formatearPesos(COBRO.total)} COP`}
          />
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default PagarCobroPaso1Page;
