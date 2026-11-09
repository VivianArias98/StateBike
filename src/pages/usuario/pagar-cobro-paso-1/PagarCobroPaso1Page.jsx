import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import { IconoBilletera } from '../../../components/Iconos/Iconos.jsx';
import EstadoCarga from '../components/EstadoCarga.jsx';
import { formatearPesos } from '../formato.js';
import { formatearFechaBogota } from '../../../utils/formatoMoneda.js';
import { mensajeError } from '../../../utils/mensajeError.js';
import { obtenerBilletera, pagarCobroPendiente } from '../mi-billetera/billeteraApi.js';
import DetalleCobro from './components/DetalleCobro.jsx';
import DesgloseSaldo from './components/DesgloseSaldo.jsx';
import styles from './PagarCobroPaso1Page.module.css';

// Pagar cobro pendiente, paso 1 de 2 (HU_25): ver el cobro y el saldo, y confirmar el pago total
function PagarCobroPaso1Page() {
  const navegar = useNavigate();
  const [billetera, setBilletera] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');
  const [intento, setIntento] = useState(0);
  const [error, setError] = useState('');
  const [pagando, setPagando] = useState(false);

  useEffect(() => {
    let activo = true;
    obtenerBilletera()
      .then((datos) => {
        if (!activo) return;
        setBilletera(datos);
        setErrorCarga('');
      })
      .catch((errorApi) => {
        if (activo) setErrorCarga(mensajeError(errorApi));
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [intento]);

  const reintentar = () => {
    setCargando(true);
    setErrorCarga('');
    setIntento(intento + 1);
  };

  const cobro = billetera?.cobroPendiente;
  const saldo = billetera?.saldo ?? 0;

  const pagar = async () => {
    setPagando(true);
    setError('');
    try {
      const pago = await pagarCobroPendiente();
      navegar('/billetera/pagar/comprobante', { state: { pago, cobro, fecha: new Date().toISOString() } });
    } catch (errorApi) {
      // "Saldo insuficiente. Le faltan $X...": el faltante se calcula con los datos que ya tenemos
      setError(mensajeError(errorApi, { faltante: cobro ? cobro.monto - saldo : undefined }));
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

        <EstadoCarga
          cargando={cargando}
          error={errorCarga}
          onReintentar={reintentar}
          vacio={billetera && !cobro ? 'No tiene cobros pendientes' : ''}
        />

        {!cargando && cobro && (
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
                  { etiqueta: 'Viaje asociado', valor: `#${cobro.id}` },
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
                  disabled={pagando}
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
