import { useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import EstadoCarga from '../components/EstadoCarga.jsx';
import CatalogoPlanes from '../components/CatalogoPlanes.jsx';
import { useCarga } from '../../../utils/useCarga.js';
import { obtenerMiPlan } from './planApi.js';
import { SIN_PLANES } from './planVista.js';
import BannerSinPlan from './components/BannerSinPlan.jsx';
import FlujoActivacion from './components/FlujoActivacion.jsx';
import PlanActivo from './components/PlanActivo.jsx';
import styles from './MiPlanPage.module.css';

// Pasos del flujo Adquirir plan (solo informativo en Mi plan)
const PASOS_ACTIVACION = [
  { titulo: 'Verificación NFC', detalle: 'Tarjeta activa vinculada', estado: 'pendiente' },
  { titulo: 'Elegir plan', detalle: 'Del catálogo vigente', estado: 'pendiente' },
  { titulo: 'Resumen compra', detalle: 'Débito saldo billetera', estado: 'pendiente' },
  { titulo: 'Activación inmediata', detalle: 'Desde la fecha de pago', estado: 'pendiente' },
];

// Mi plan (HU_17): si tiene plan muestra su estado y las condiciones; si no, el aviso y el flujo para adquirir.
// Debajo siempre va el catálogo, marcando "TU PLAN ACTUAL".
function MiPlanPage() {
  const navegar = useNavigate();
  const { datos, cargando, error, reintentar } = useCarga(obtenerMiPlan);

  // El plan elegido en el catálogo se pasa al flujo para dejarlo preseleccionado en el paso 2
  const adquirir = (planId) => navegar('/plan/adquirir', { state: planId ? { planId } : null });

  return (
    <UsuarioLayout itemActivo="Mi plan">
      <div className={styles.raiz}>
        <EncabezadoPagina
          titulo="Mi Plan"
          subtitulo="Gestión de tu suscripción actual y catálogo de planes disponibles."
        />

        <EstadoCarga cargando={cargando} error={error} onReintentar={reintentar} />

        {!cargando && datos && (
          <>
            {datos.tienePlan ? (
              <PlanActivo
                plan={datos.plan}
                onCancelar={() => navegar('/plan/cancelar')}
                onVerHistorial={() => navegar('/historial')}
              />
            ) : (
              <>
                <BannerSinPlan
                  mensaje={datos.mensaje}
                  ultimosDigitos={datos.tarjeta?.ultimosDigitos}
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

              {datos.catalogo.length === 0 ? (
                <EstadoCarga vacio={SIN_PLANES} />
              ) : (
                <CatalogoPlanes planes={datos.catalogo} puedeAdquirir={!datos.tienePlan} onAdquirir={adquirir} />
              )}
            </section>

            <div className={`tarjeta ${styles.nota}`}>
              <button type="button" className="enlace" onClick={() => navegar('/billetera')}>
                Ver saldo en Mi Billetera →
              </button>
            </div>
          </>
        )}
      </div>
    </UsuarioLayout>
  );
}

export default MiPlanPage;
