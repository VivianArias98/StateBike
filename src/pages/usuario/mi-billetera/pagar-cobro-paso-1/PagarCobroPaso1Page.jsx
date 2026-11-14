import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import { IconoBilletera } from '../../../../components/Iconos/Iconos.jsx';
import { formatearPesos } from '../../formato.js';
import { formatearFechaBogota } from '../../../../utils/formatoMoneda.js';
import { useUsuario } from '../../context/UsuarioContext.jsx';
import DetalleCobro from './components/DetalleCobro.jsx';
import DesgloseSaldo from './components/DesgloseSaldo.jsx';
import styles from './PagarCobroPaso1Page.module.css';

function PagarCobroPaso1Page() {
  const navegar = useNavigate();
  const { billetera, pagarCobroPendiente } = useUsuario();
  const [error, setError] = useState('');
  const [pagando, setPagando] = useState(false);

  const cobro = billetera?.cobroPendiente;
  const saldo = billetera?.saldo ?? 0;
  const monto = cobro?.monto ?? 0;
  const saldoSuficiente = saldo >= monto;
  const falta = monto - saldo;

  const pagar = async () => {
    setPagando(true);
    setError('');
    try {
      const res = await pagarCobroPendiente();
      navegar('/billetera/pagar/comprobante', {
        state: {
          pago: res,
          cobro: cobro,
          fecha: new Date().toISOString(),
        },
      });
    } catch (err) {
      setError(err.message);
      setPagando(false);
    }
  };

  const volver = () => navegar('/billetera');

  return (
    <UsuarioLayout itemActivo="Mi billetera">
      <div className={styles.raiz}>
        <button type="button" className={`enlace ${styles.volver}`} onClick={volver}>
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

        {!cobro ? (
          <div className={`tarjeta ${styles.sinCobro}`}>
            <p className={styles.sinCobroTitulo}>No tienes cobros pendientes</p>
            <p className={styles.sinCobroTexto}>
              Tu cuenta se encuentra al día y libre de penalizaciones.
            </p>
            <button type="button" className="boton boton--primario" onClick={volver}>
              Volver a Mi Billetera
            </button>
          </div>
        ) : (
          <>
            <section className={`tarjeta ${styles.saldo}`}>
              <span className={styles.iconoSaldo} aria-hidden="true">
                <IconoBilletera />
              </span>
              <div className={styles.saldoTexto}>
                <p className={styles.saldoEtiqueta}>SALDO DISPONIBLE EN BILLETERA</p>
                <p className={styles.saldoValor}>
                  {formatearPesos(saldo)} <span className={styles.moneda}>COP</span>
                </p>
              </div>
            </section>

            <div className={styles.columna}>
              <DetalleCobro
                filas={[
                  { etiqueta: 'Viaje asociado', valor: `#${cobro.viajeId || cobro.id}` },
                  ...(cobro.origen && cobro.destino
                    ? [{ etiqueta: 'Recorrido', valor: `${cobro.origen} → ${cobro.destino}` }]
                    : []),
                  { etiqueta: 'Fecha del viaje', valor: formatearFechaBogota(cobro.fecha) },
                  { etiqueta: 'Minutos de exceso', valor: `${cobro.minutosExceso} min`, alerta: true },
                ]}
                total={`${formatearPesos(cobro.monto)} COP`}
              />
              <DesgloseSaldo saldo={saldo} debito={cobro.monto} />

              <p className={styles.nota}>
                El pago descuenta el valor total del cobro de su saldo (no se permiten pagos parciales). Al confirmar,
                el cobro pasará a <strong>PAGADO</strong> y podrá volver a retirar bicicletas.
              </p>

              {!saldoSuficiente && (
                <div className="mensaje-error" role="alert">
                  <p>
                    <strong>Saldo insuficiente para saldar el cobro.</strong> Le faltan {formatearPesos(falta)}.
                  </p>
                  <p className={styles.avisoRecargaAdmin}>
                    Acércate a un punto de atención o estación autorizada para realizar la recarga.
                  </p>
                </div>
              )}

              {error && (
                <p className="mensaje-error" role="alert">
                  {error}
                </p>
              )}

              <div className={styles.acciones}>
                <button type="button" className={`boton boton--bloque ${styles.cancelar}`} onClick={volver}>
                  CANCELAR
                </button>
                <button
                  type="button"
                  className={`boton boton--bloque ${styles.confirmar}`}
                  onClick={pagar}
                  disabled={pagando || !saldoSuficiente}
                >
                  {pagando ? 'PAGANDO...' : `CONFIRMAR Y PAGAR ${formatearPesos(cobro.monto)} COP`}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </UsuarioLayout>
  );
}

export default PagarCobroPaso1Page;
