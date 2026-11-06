import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import PasosProgreso from '../components/PasosProgreso.jsx';
import { formatearPesos } from '../formato.js';
import { PLANES, USUARIO } from '../datos.js';
import BannerSinPlan from './components/BannerSinPlan.jsx';
import PlanActivo from './components/PlanActivo.jsx';
import CatalogoPlanes from './components/CatalogoPlanes.jsx';
import styles from './MiPlanPage.module.css';

// Maqueta: cambia a false para ver el estado sin plan activo
const TIENE_PLAN_ACTIVO = true;
const PLAN_ACTIVO_ID = 'mensual';

// Datos de ejemplo (solo maquetación). Después llegarán del backend.
const SALDO_BILLETERA = 65000;
const SUSCRIPCION = {
  diasUsados: 12,
  inicio: { fecha: '01/11/2026', hora: '08:30 COT' },
  fin: { fecha: '01/12/2026', hora: '23:59 COT' },
  pagado: 32000,
};

const PASOS_ACTIVACION = [
  { titulo: 'Verificación NFC', detalle: `#${USUARIO.nfc}` },
  { titulo: 'Selección de plan', detalle: 'En proceso' },
  { titulo: 'Resumen compra', detalle: 'Débito saldo billetera' },
  { titulo: 'Activación inmediata', detalle: 'Habilitación en docks' },
];

// Mi plan: muestra el plan vigente con su consumo, o el flujo para adquirir uno
function MiPlanPage() {
  // Pendiente: navegar al flujo Adquirir plan, cancelar el plan y abrir el historial (React Router)
  const adquirirPlan = () => {};
  const cancelarPlan = () => {};
  const verHistorial = () => {};

  const planActivo = PLANES.find((plan) => plan.id === PLAN_ACTIVO_ID);

  return (
    <UsuarioLayout itemActivo="Mi plan">
      <div className={styles.raiz}>
        <EncabezadoPagina
          titulo="Mi Plan"
          subtitulo={
            TIENE_PLAN_ACTIVO
              ? 'Gestión de tu suscripción actual y catálogo de planes disponibles'
              : 'Gestión de suscripciones, condiciones de uso y acceso a bicicletas del sistema integrado.'
          }
          acciones={
            /* Con plan activo, el estado va dentro de la tarjeta del plan */
            TIENE_PLAN_ACTIVO ? null : (
              <span className={styles.registro}>
                Registro de ciclo: <strong>sin suscripción vigente</strong>
              </span>
            )
          }
        />

        {TIENE_PLAN_ACTIVO ? (
          <>
            <PlanActivo
              plan={planActivo}
              nfc={USUARIO.nfc}
              diasUsados={SUSCRIPCION.diasUsados}
              inicio={SUSCRIPCION.inicio}
              fin={SUSCRIPCION.fin}
              pagado={SUSCRIPCION.pagado}
              onCancelar={cancelarPlan}
              onVerHistorial={verHistorial}
            />

            <section className={styles.seccion} aria-labelledby="catalogo-titulo">
              <div className={styles.cabeceraSeccion}>
                <div className={styles.textoSeccion}>
                  <h2 id="catalogo-titulo" className={styles.tituloSeccion}>
                    Catálogo de Planes Tunja Bici
                  </h2>
                  <p className={styles.descripcionSeccion}>
                    Elige la modalidad que mejor responda a tu ritmo de movilidad por la ciudad
                  </p>
                </div>
                <span className="insignia insignia--neutra">{PLANES.length} opciones disponibles</span>
              </div>
              <CatalogoPlanes planes={PLANES} planActualId={PLAN_ACTIVO_ID} onAdquirir={adquirirPlan} />
            </section>
          </>
        ) : (
          <>
            <BannerSinPlan nfc={USUARIO.nfc} onAdquirir={adquirirPlan} />

            <section className={`tarjeta ${styles.pasos}`} aria-label="Flujo de activación">
              <PasosProgreso pasos={PASOS_ACTIVACION} pasoActual={1} etiqueta="Flujo de activación" />
            </section>

            <section className={styles.seccion} aria-labelledby="planes-titulo">
              <div className={styles.textoSeccion}>
                <h2 id="planes-titulo" className={styles.tituloSeccion}>
                  Planes Disponibles
                </h2>
                <p className={styles.descripcionSeccion}>
                  Selecciona la modalidad de suscripción que mejor se adapte a tus necesidades. La activación se
                  reflejará de inmediato en tu tarjeta NFC vinculada.
                </p>
              </div>
              <CatalogoPlanes planes={PLANES} onAdquirir={adquirirPlan} />

              <div className={`tarjeta ${styles.nota}`}>
                <p>
                  * El valor de la suscripción se debita automáticamente del saldo de tu billetera al confirmar la
                  compra.
                </p>
                <button type="button" className="enlace">
                  Ver saldo en Mi Billetera ({formatearPesos(SALDO_BILLETERA)} COP) →
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </UsuarioLayout>
  );
}

export default MiPlanPage;
