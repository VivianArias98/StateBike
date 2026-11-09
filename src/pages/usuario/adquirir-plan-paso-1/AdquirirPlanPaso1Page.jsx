import { useLocation, useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import BarraPasos from '../components/BarraPasos.jsx';
import CabeceraAdquirir from '../components/CabeceraAdquirir.jsx';
import EstadoCarga from '../components/EstadoCarga.jsx';
import { useCarga } from '../../../utils/useCarga.js';
import { obtenerDatosCompra } from '../mi-plan/planApi.js';
import PasoNfc from './components/PasoNfc.jsx';
import styles from './AdquirirPlanPaso1Page.module.css';

const BARRAS = [
  { etiqueta: 'Paso 01 (activo)', titulo: 'Verificación NFC', estado: 'activo' },
  { etiqueta: 'Paso 02 (pendiente)', titulo: 'Elegir Plan', estado: 'pendiente' },
  { etiqueta: 'Paso 03 (pendiente)', titulo: 'Resumen y Pago', estado: 'pendiente' },
  { etiqueta: 'Paso 04 (pendiente)', titulo: 'Activación Exitosa', estado: 'pendiente' },
];

// Mensajes de las precondiciones de la HU_2
const SIN_TARJETA_ACTIVA = 'Debe tener una tarjeta NFC activa para adquirir un plan';
const YA_TIENE_PLAN = 'Ya tiene un plan activo';

// Adquirir plan, paso 1 de 4 (HU_2): verificar tarjeta NFC activa y que no haya un plan vigente
function AdquirirPlanPaso1Page() {
  const navegar = useNavigate();
  const { state } = useLocation();
  const { datos, cargando, error, reintentar } = useCarga(obtenerDatosCompra);

  const tarjeta = datos?.miPlan.tarjeta;
  let bloqueo = '';
  if (datos && tarjeta?.estado !== 'ACTIVA') bloqueo = SIN_TARJETA_ACTIVA;
  else if (datos?.miPlan.tienePlan) bloqueo = YA_TIENE_PLAN;

  return (
    <UsuarioLayout itemActivo="Mi plan">
      <div className={styles.raiz}>
        <CabeceraAdquirir
          titulo="Adquirir Plan"
          subtitulo="Paso 1: Verificación de Tarjeta NFC"
          chip={tarjeta ? `NFC: ${tarjeta.estado} · •••• ${tarjeta.ultimosDigitos}` : 'NFC: SIN VINCULAR'}
        />
        <BarraPasos pasos={BARRAS} />

        <EstadoCarga cargando={cargando} error={error} onReintentar={reintentar} />

        {!cargando && datos && (
          <PasoNfc
            tarjeta={tarjeta}
            saldo={datos.saldo}
            tienePlan={datos.miPlan.tienePlan}
            bloqueo={bloqueo}
            onVolver={() => navegar('/plan')}
            onContinuar={() => navegar('/plan/adquirir/elegir', { state })}
          />
        )}
      </div>
    </UsuarioLayout>
  );
}

export default AdquirirPlanPaso1Page;
