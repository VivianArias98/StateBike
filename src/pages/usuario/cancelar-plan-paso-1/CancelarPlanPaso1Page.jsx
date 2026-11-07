import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import { IconoAlerta, IconoCheck, IconoFlecha, IconoCerrar } from '../../../components/Iconos/Iconos.jsx';
import styles from './CancelarPlanPaso1Page.module.css';

const PASOS = [
  { numero: '01', etiqueta: '01 | PASO 1: VERIFICACIÓN Y ADVERTENCIA', titulo: 'Condiciones e impacto del cese', detalle: 'Validación de estado activo e impacto del cese.', estado: 'ACTIVO', activo: true },
  { numero: '02', etiqueta: '02 | PASO 2: PLAN CANCELADO', titulo: 'Cierre registral y comprobante', detalle: 'Desactivación en registro central y recibo final.', estado: 'PENDIENTE', activo: false },
];

const EFECTOS = [
  { titulo: 'Acceso a estaciones y esclusas:', texto: 'Revocado inmediatamente tras confirmación.' },
  { titulo: 'Liquidación financiera:', texto: 'Balance de días = 0 (Sin derecho a crédito compensatorio).' },
  { titulo: 'Dispositivo físico NFC:', texto: 'Persiste vinculado al usuario en estado STANDBY para futuros esquemas.' },
];

function CancelarPlanPaso1Page() {
  return (
    <UsuarioLayout itemActivo="Mi plan">
      <div className={styles.raiz}>
        <header className={styles.cabecera}>
          <div className={styles.textoCabecera}>
            <h1 className={styles.titulo}>Cancelar Plan</h1>
            <p className={styles.subtitulo}>
              Revisión obligatoria de precondiciones de uso, compromisos de servicio y consecuencias de la rescisión anticipada de contrato.
            </p>
          </div>
          <p className={styles.contrato}>
            ID CONTRATO: <strong>#TJA-88421</strong>
          </p>
        </header>

        <ol className={styles.pasos}>
          {PASOS.map((paso) => (
            <li key={paso.numero} className={`${styles.paso} ${paso.activo ? styles.pasoActivo : ''}`}>
              <span className={styles.numero}>{paso.numero}</span>
              <div className={styles.textoPaso}>
                <p className={styles.etiquetaPaso}>{paso.etiqueta}</p>
                <p className={styles.tituloPaso}>{paso.titulo}</p>
                <p className={styles.detallePaso}>{paso.detalle}</p>
              </div>
              <span className={`${styles.estado} ${paso.activo ? styles.estadoActivo : ''}`}>{paso.estado}</span>
            </li>
          ))}
        </ol>

        <section className={styles.seccion} aria-label="Confirmación estructurada de cancelación">
          <div className={styles.cabeceraSeccion}>
            <p className={styles.etiquetaSeccion}>SEC_01 // CONFIRMACIÓN ESTRUCTURADA DE CANCELACIÓN</p>
            <p className={styles.registro}>REGISTRO DE CONDICIONES AUDITADAS</p>
          </div>

          <div className={styles.verificacion}>
            <span className={styles.iconoVerificacion}><IconoCheck /></span>
            <div>
              <p className={styles.tituloVerificacion}>
                VERIFICACIÓN DEL SISTEMA APROBADA <span className={styles.chip}>CUMPLE CONDICIONES</span>
              </p>
              <p className={styles.textoVerificacion}>
                Estado de trayecto verificado: Sin viaje en curso. Cumple con la precondición mandataria para la terminación del contrato de servicio.
              </p>
            </div>
          </div>

          <div className={styles.tarjetas}>
            <div className={styles.tarjeta}>
              <p className={styles.etiqueta}>TIPO DE SUSCRIPCIÓN</p>
              <p className={styles.valor}>Plan Mensual</p>
              <p className={styles.codigo}>ID_TARIFA: #SB-MN-04</p>
            </div>
            <div className={styles.tarjeta}>
              <p className={styles.etiqueta}>FECHA DE FIN ORIGINAL</p>
              <p className={styles.valor}>01 de Diciembre de 2026</p>
              <p className={styles.codigo}>23:59:59 COT</p>
            </div>
            <div className={styles.tarjeta}>
              <p className={styles.etiqueta}>VIGENCIA RESTANTE</p>
              <p className={styles.valor}>18 días restantes</p>
              <p className={styles.alerta}>SALDO NO COMPENSABLE</p>
            </div>
          </div>

          <div className={styles.critico}>
            <div className={styles.cabeceraCritica}>
              <p className={styles.tituloCritico}><IconoAlerta /> CRÍTICO // EFECTOS DE LA TERMINACIÓN</p>
              <p className={styles.clausula}>CLÁUSULA RESCISORIA</p>
            </div>
            <p className={styles.advertencia}>«ADVERTENCIA: PERDERÁ LOS DÍAS RESTANTES Y NO HABRÁ REEMBOLSO».</p>
            <p className={styles.textoCritico}>
              La tarjeta NFC <strong>#TUN-8831</strong> dejará de desbloquear bicicletas de forma inmediata con este plan. Si posee algún cobro por exceso pendiente, este se mantendrá en su billetera. Su tarjeta física seguirá activa para adquirir nuevos planes.
            </p>
            <ul className={styles.efectos}>
              {EFECTOS.map((efecto) => (
                <li key={efecto.titulo} className={styles.efecto}>
                  <span className={styles.menos}>[-]</span>
                  <span><strong>{efecto.titulo}</strong> {efecto.texto}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.acciones}>
            <button type="button" className={`boton ${styles.botonVolver}`}>
              <IconoFlecha /> No cancelar, mantener plan activo
            </button>
            <button type="button" className={`boton ${styles.botonCancelar}`}>
              <IconoCerrar /> Confirmar cancelación del plan
            </button>
          </div>
        </section>
      </div>
    </UsuarioLayout>
  );
}

export default CancelarPlanPaso1Page;
