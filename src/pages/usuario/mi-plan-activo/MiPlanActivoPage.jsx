import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import CatalogoPlanes from '../components/CatalogoPlanes.jsx';
import { PLANES, USUARIO } from '../datos.js';
import PlanActivo from './components/PlanActivo.jsx';
import styles from './MiPlanActivoPage.module.css';

const PLAN_ACTIVO_ID = 'mensual';
const SUSCRIPCION = {
  diasUsados: 12,
  inicio: { fecha: '01/11/2026', hora: '08:30 COT' },
  fin: { fecha: '01/12/2026', hora: '23:59 COT' },
  pagado: 32000,
};

// Pantalla 07: Mi Plan con suscripción vigente
function MiPlanActivoPage() {
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
          subtitulo="Gestión de tu suscripción actual y catálogo de planes disponibles"
        />

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
            <span className={styles.pastilla}>{PLANES.length} opciones disponibles</span>
          </div>
          <CatalogoPlanes planes={PLANES} modo="conPlan" planActualId={PLAN_ACTIVO_ID} onAdquirir={adquirirPlan} />
        </section>
      </div>
    </UsuarioLayout>
  );
}

export default MiPlanActivoPage;
