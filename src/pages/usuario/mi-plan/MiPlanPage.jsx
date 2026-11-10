import React from 'react';
import { useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import CatalogoPlanes from './components/CatalogoPlanes.jsx';
import BannerSinPlan from './components/BannerSinPlan.jsx';
import FlujoActivacion from './components/FlujoActivacion.jsx';
import PlanActivo from './components/PlanActivo.jsx';
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
  const { plan, perfil, planesCatalogo } = useUsuario();

  const adquirir = (planId) => navegar('/plan/adquirir', { state: planId ? { planId } : null });

  return (
    <UsuarioLayout itemActivo="Mi plan">
      <div className={styles.raiz}>
        <EncabezadoPagina
          titulo="Mi Plan"
          subtitulo="Gestión de tu suscripción actual y catálogo de planes disponibles."
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
              ultimosDigitos={perfil?.tarjeta?.ultimosDigitos || '----'}
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
          <button type="button" className="enlace" onClick={() => navegar('/billetera')}>
            Ver saldo en Mi Billetera →
          </button>
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default MiPlanPage;
