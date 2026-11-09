import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import BarraPasos from '../components/BarraPasos.jsx';
import CabeceraAdquirir from '../components/CabeceraAdquirir.jsx';
import EstadoCarga from '../components/EstadoCarga.jsx';
import { useCarga } from '../../../utils/useCarga.js';
import { obtenerDatosCompra } from '../mi-plan/planApi.js';
import { SIN_PLANES } from '../mi-plan/planVista.js';
import PasoElegirPlan from './components/PasoElegirPlan.jsx';
import styles from './AdquirirPlanPaso2Page.module.css';

const BARRAS = [
  { etiqueta: '1. NFC', titulo: 'Verificada', estado: 'completado' },
  { etiqueta: '2. Plan y pago', titulo: 'En curso', estado: 'activo' },
  { etiqueta: '3. Resumen', titulo: 'Pendiente', estado: 'pendiente' },
  { etiqueta: '4. Confirmación', titulo: 'Pendiente', estado: 'pendiente' },
];

// Adquirir plan, paso 2 de 4 (HU_2): elegir un plan del catálogo vigente
function AdquirirPlanPaso2Page() {
  const navegar = useNavigate();
  const { state } = useLocation();
  const { datos, cargando, error, reintentar } = useCarga(obtenerDatosCompra);
  // Si viene de una tarjeta del catálogo de Mi plan, ese plan queda preseleccionado
  const [planElegido, setPlanElegido] = useState(state?.planId ?? null);

  // Si ya no cumple las precondiciones (por ejemplo, entró directo por la URL), vuelve al paso 1
  const noPuede = datos && (datos.miPlan.tienePlan || datos.miPlan.tarjeta?.estado !== 'ACTIVA');
  if (noPuede) return <Navigate to="/plan/adquirir" replace />;

  const planes = datos?.miPlan.catalogo ?? [];
  const elegido = planElegido ?? planes[0]?.id ?? null;

  return (
    <UsuarioLayout itemActivo="Mi plan">
      <div className={styles.raiz}>
        <CabeceraAdquirir
          etiqueta="Paso 2 de 4"
          titulo="Adquirir Plan"
          subtitulo="Selecciona tu plan del catálogo y revisa el débito de tu billetera"
          chip={datos ? `Tarjeta NFC •••• ${datos.miPlan.tarjeta.ultimosDigitos}` : 'Tarjeta NFC'}
          conCheck
        />
        <BarraPasos pasos={BARRAS} />

        <EstadoCarga
          cargando={cargando}
          error={error}
          onReintentar={reintentar}
          vacio={datos && planes.length === 0 ? SIN_PLANES : ''}
        />

        {!cargando && datos && planes.length > 0 && (
          <PasoElegirPlan
            planes={planes}
            planElegido={elegido}
            saldo={datos.saldo}
            onElegir={setPlanElegido}
            onVolver={() => navegar('/plan/adquirir', { state: { planId: elegido } })}
            onContinuar={() => navegar('/plan/adquirir/resumen', { state: { planId: elegido } })}
          />
        )}
      </div>
    </UsuarioLayout>
  );
}

export default AdquirirPlanPaso2Page;
