import { useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import CatalogoPlanes from './components/CatalogoPlanes.jsx';
import BannerSinPlan from './components/BannerSinPlan.jsx';
import FlujoActivacion from './components/FlujoActivacion.jsx';
import PlanActivo from './components/PlanActivo.jsx';
import { IconoBilletera } from '../../../components/Iconos/Iconos.jsx';
import { useUsuario } from '../context/UsuarioContext.jsx';
import styles from './MiPlanPage.module.css';

const PASOS_ACTIVACION = [
  { titulo: 'Verificación NFC', detalle: 'Tarjeta activa vinculada', estado: 'pendiente' },
  { titulo: 'Elegir plan', detalle: 'Del catálogo vigente', estado: 'pendiente' },
  { titulo: 'Resumen compra', detalle: 'Débito saldo billetera', estado: 'pendiente' },
  { titulo: 'Activación inmediata', detalle: 'Desde la fecha de pago', estado: 'pendiente' },
];

function MiPlanPage() {
  const navegar = useNavigate();
  const { plan, planesCatalogo = [] } = useUsuario();

  const adquirir = (planId) => navegar('/plan/adquirir', { state: planId ? { planId } : null });

  return (
    <UsuarioLayout itemActivo="Mi plan">
      <div className={styles.raiz}>
        <EncabezadoPagina
          etiqueta="Usuario / Suscripción / Mi Plan"
          titulo="Mi Plan"
          subtitulo="Gestión de tu suscripción actual y catálogo de planes disponibles para la red de Tunja."
          acciones={
            plan.tienePlan && plan.planActivo ? (
              <span className={styles.badgePlanActivo}>
                <span className="punto-vivo" aria-hidden="true" />
                Plan {plan.planActivo.nombre}
              </span>
            ) : (
              <span className={styles.badgeSinPlan}>
                Sin suscripción activa
              </span>
            )
          }
        />

        {plan.tienePlan && plan.planActivo ? (
          <PlanActivo
            plan={plan.planActivo}
            onCancelar={() => navegar('/plan/cancelar')}
            onVerHistorial={() => navegar('/historial')}
          />
        ) : (
          <>
            <BannerSinPlan
              mensaje="No tienes un plan activo en este momento."
              onAdquirir={() => adquirir()}
            />
            <FlujoActivacion pasos={PASOS_ACTIVACION} />
          </>
        )}

        <section className={styles.seccion} aria-labelledby="planes-titulo">
          <div className={styles.cabeceraSeccion}>
            <div className={styles.textoSeccion}>
              <h2 id="planes-titulo" className={styles.tituloSeccion}>
                Planes Disponibles
              </h2>
              <p className={styles.descripcionSeccion}>
                El valor del plan se descuenta del saldo de tu billetera y se activa de inmediato.
              </p>
            </div>
          </div>

          <CatalogoPlanes
            planes={planesCatalogo}
            puedeAdquirir={!plan.tienePlan}
            onAdquirir={adquirir}
          />
        </section>

        <div className={`tarjeta ${styles.nota}`}>
          <div className={styles.notaTexto}>
            <span className={styles.iconoBilletera} aria-hidden="true">
              <IconoBilletera />
            </span>
            <div>
              <strong className={styles.notaTitulo}>Saldo y recargas presenciales</strong>
              <p className={styles.notaDescripcion}>
                El pago de los planes se debita directamente de tu saldo de billetera, recargado en taquillas autorizadas por el administrador.
              </p>
            </div>
          </div>
          <button
            type="button"
            className={`boton boton--secundario ${styles.botonBilletera}`}
            onClick={() => navegar('/billetera')}
          >
            Ver saldo en Mi Billetera →
          </button>
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default MiPlanPage;
