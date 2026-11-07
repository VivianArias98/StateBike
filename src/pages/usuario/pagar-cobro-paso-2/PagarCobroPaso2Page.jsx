import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import { IconoCandado, IconoDescarga } from '../../../components/Iconos/Iconos.jsx';
import { formatearPesos } from '../formato.js';
import ComprobanteCobro from './components/ComprobanteCobro.jsx';
import ResumenTransaccion from './components/ResumenTransaccion.jsx';
import styles from './PagarCobroPaso2Page.module.css';

// Datos de ejemplo tomados del PDF (sin backend todavía)
const TOTAL = 2500;
const SALDO_ANTERIOR = 35000;
const NUEVO_SALDO = SALDO_ANTERIOR - TOTAL;

function PagarCobroPaso2Page() {
  return (
    <UsuarioLayout itemActivo="Mi billetera">
      <div className={styles.raiz}>
        <button type="button" className={`enlace ${styles.volver}`}>
          ← Volver a Mi Billetera
        </button>

        <header className={styles.encabezado}>
          <p className={styles.etiqueta}>MÓDULO DE CONCILIACIÓN · TUNJA</p>
          <div className={styles.tituloFila}>
            <h1 className={styles.titulo}>Pagar Cobro Pendiente</h1>
            <span className={styles.pasoBadge}>
              Paso 2 de 2: Comprobante de pago exitoso y cuenta al día
            </span>
          </div>
        </header>

        <section className={`tarjeta ${styles.exito}`}>
          <span className={styles.iconoExito} aria-hidden="true">✓</span>
          <div className={styles.exitoTexto}>
            <p className={styles.estado}>
              [ESTADO_OPERACIÓN: ÉXITO] <span>• Transacción aprobada</span>
            </p>
            <h2 className={styles.exitoTitulo}>Cobro pendiente pagado correctamente</h2>
            <p className={styles.exitoDetalle}>
              El cobro por exceso de tiempo ha sido debitado de su billetera. Su cuenta se encuentra al día y ya puede desbloquear bicicletas e iniciar nuevos viajes.
            </p>
          </div>
          <span className={styles.chipHabilitada}>
            <IconoCandado /> Cuenta habilitada
          </span>
        </section>

        <div className={styles.principal}>
          <ComprobanteCobro
            referencia="COMPROBANTE #CP-PAGADO-9912"
            datos={[
              { etiqueta: 'Concepto registrado', valor: 'Exceso de tiempo' },
              { etiqueta: 'Viaje asociado', valor: '#VIAJE-8831 (Plaza → Terminal)' },
              { etiqueta: 'Minutos liquidados', valor: '25 min de exceso' },
              { etiqueta: 'Método de pago', valor: 'Saldo de billetera' },
            ]}
            fechaPago="02 Nov 2026, 10:20 AM"
            nfc="#TUN-8831"
          />

          <div className={styles.columnaDerecha}>
            <ResumenTransaccion
              total={`${formatearPesos(TOTAL)} COP`}
              saldoAnterior={`${formatearPesos(SALDO_ANTERIOR)} COP`}
              nuevoSaldo={`${formatearPesos(NUEVO_SALDO)} COP`}
              descuento={`-${formatearPesos(TOTAL)}`}
            />

            <section className={`tarjeta ${styles.acciones}`}>
              <div className={styles.botonesFila}>
                <button type="button" className={`boton ${styles.irBilletera}`}>
                  Ir a Mi Billetera
                </button>
                <button type="button" className={`boton ${styles.verEstaciones}`}>
                  Ver Estaciones
                </button>
              </div>
              <button type="button" className={`enlace ${styles.descarga}`}>
                <IconoDescarga /> Descargar comprobante en PDF
              </button>
            </section>
          </div>
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default PagarCobroPaso2Page;
