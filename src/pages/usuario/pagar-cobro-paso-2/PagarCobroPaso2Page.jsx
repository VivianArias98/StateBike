import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import { formatearPesos } from '../formato.js';
import { formatearFechaBogota } from '../../../utils/formatoMoneda.js';
import ComprobanteCobro from './components/ComprobanteCobro.jsx';
import ResumenTransaccion from './components/ResumenTransaccion.jsx';
import styles from './PagarCobroPaso2Page.module.css';

// Pagar cobro pendiente, paso 2 de 2 (HU_25): comprobante con la respuesta del backend.
// Los datos llegan desde el paso 1 (estado de la navegación). Sin ellos se vuelve a la billetera.
function PagarCobroPaso2Page() {
  const navegar = useNavigate();
  const { state } = useLocation();

  if (!state?.pago) return <Navigate to="/billetera" replace />;

  const { pago, cobro, fecha } = state;
  const { montoPagado, saldoRestante, minutosExceso, viajeId } = pago.cobro;

  const datos = [
    { etiqueta: 'Concepto registrado', valor: 'Exceso de tiempo' },
    {
      etiqueta: 'Viaje asociado',
      valor: cobro?.origen && cobro?.destino ? `#${viajeId} (${cobro.origen} → ${cobro.destino})` : `#${viajeId}`,
    },
    { etiqueta: 'Minutos liquidados', valor: `${minutosExceso} min de exceso` },
    { etiqueta: 'Método de pago', valor: 'Saldo de billetera' },
  ];

  return (
    <UsuarioLayout itemActivo="Mi billetera">
      <div className={styles.raiz}>
        <button type="button" className={`enlace ${styles.volver}`} onClick={() => navegar('/billetera')}>
          ← Volver a Mi Billetera
        </button>

        <header className={styles.encabezado}>
          <div className={styles.tituloFila}>
            <h1 className={styles.titulo}>Pagar Cobro Pendiente</h1>
            <span className={styles.pasoBadge}>Paso 2 de 2: Comprobante de pago</span>
          </div>
        </header>

        <section className={`tarjeta ${styles.exito}`}>
          <span className={styles.iconoExito} aria-hidden="true">
            ✓
          </span>
          <div className={styles.exitoTexto}>
            <h2 className={styles.exitoTitulo}>{pago.mensaje}</h2>
            <p className={styles.exitoDetalle}>
              El cobro por exceso de tiempo fue descontado de su billetera y quedó en estado{' '}
              <strong>{pago.cobro.estadoCobro}</strong>.
            </p>
          </div>
        </section>

        <div className={styles.principal}>
          <ComprobanteCobro viajeId={viajeId} datos={datos} fechaPago={formatearFechaBogota(fecha)} />

          <div className={styles.columnaDerecha}>
            <ResumenTransaccion
              total={`${formatearPesos(montoPagado)} COP`}
              saldoAnterior={`${formatearPesos(saldoRestante + montoPagado)} COP`}
              nuevoSaldo={`${formatearPesos(saldoRestante)} COP`}
              descuento={`-${formatearPesos(montoPagado)}`}
            />

            <section className={`tarjeta ${styles.acciones}`}>
              <div className={styles.botonesFila}>
                <button type="button" className={`boton ${styles.irBilletera}`} onClick={() => navegar('/billetera')}>
                  Ir a Mi Billetera
                </button>
                <button type="button" className={`boton ${styles.verEstaciones}`} onClick={() => navegar('/inicio')}>
                  Ver Estaciones
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default PagarCobroPaso2Page;
