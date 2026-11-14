import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import BarraPasos from '../components/BarraPasos.jsx';
import CabeceraAdquirir from '../components/CabeceraAdquirir.jsx';
import { useUsuario } from '../../context/UsuarioContext.jsx';
import PasoElegirPlan from './components/PasoElegirPlan.jsx';
import styles from './AdquirirPlanPaso2Page.module.css';

const BARRAS = [
  { etiqueta: '1. NFC', titulo: 'Verificada', estado: 'completado' },
  { etiqueta: '2. Plan y pago', titulo: 'En curso', estado: 'activo' },
  { etiqueta: '3. Resumen', titulo: 'Pendiente', estado: 'pendiente' },
  { etiqueta: '4. Confirmación', titulo: 'Pendiente', estado: 'pendiente' },
];

function AdquirirPlanPaso2Page() {
  const navegar = useNavigate();
  const { state } = useLocation();
  const { perfil, billetera, plan, planesCatalogo } = useUsuario();
  const [planElegido, setPlanElegido] = useState(state?.planId ?? null);

  const noPuede = plan.tienePlan || perfil?.tarjeta?.estado !== 'ACTIVA';
  if (noPuede) return <Navigate to="/plan/adquirir" replace />;

  const elegido = planElegido ?? planesCatalogo[0]?.id ?? null;

  return (
    <UsuarioLayout itemActivo="Mi plan">
      <div className={styles.raiz}>
        <CabeceraAdquirir
          etiqueta="Paso 2 de 4"
          titulo="Adquirir Plan"
          subtitulo="Selecciona tu plan del catálogo y revisa el débito de tu billetera"
          chip={perfil?.tarjeta ? 'Tarjeta NFC vinculada' : 'NFC: SIN VINCULAR'}
          conCheck
        />
        <BarraPasos pasos={BARRAS} />

        <PasoElegirPlan
          planes={planesCatalogo}
          planElegido={elegido}
          saldo={billetera.saldo}
          onElegir={setPlanElegido}
          onVolver={() => navegar('/plan/adquirir', { state: { planId: elegido } })}
          onContinuar={() => navegar('/plan/adquirir/resumen', { state: { planId: elegido } })}
        />
      </div>
    </UsuarioLayout>
  );
}

export default AdquirirPlanPaso2Page;
