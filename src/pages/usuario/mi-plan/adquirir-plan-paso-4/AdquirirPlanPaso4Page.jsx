import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import BarraPasos from '../components/BarraPasos.jsx';
import CabeceraAdquirir from '../components/CabeceraAdquirir.jsx';
import PasoActivacion from './components/PasoActivacion.jsx';
import styles from './AdquirirPlanPaso4Page.module.css';

const BARRAS = [
  { etiqueta: 'Hito 01', titulo: 'Verificación NFC', estado: 'completado' },
  { etiqueta: 'Hito 02', titulo: 'Selección de Plan', estado: 'completado' },
  { etiqueta: 'Hito 03', titulo: 'Resumen y Pago', estado: 'completado' },
  { etiqueta: 'Activo', titulo: 'Activación Exitosa', estado: 'activo' },
];

// Adquirir plan, paso 4 de 4 (HU_2): confirmación con la respuesta del backend.
// Los datos llegan del paso 3 (estado de la navegación). Sin ellos se vuelve a Mi plan.
function AdquirirPlanPaso4Page() {
  const navegar = useNavigate();
  const { state } = useLocation();

  if (!state?.respuesta) return <Navigate to="/plan" replace />;

  const { respuesta, plan, saldoRestante } = state;

  return (
    <UsuarioLayout itemActivo="Mi plan">
      <div className={styles.raiz}>
        <CabeceraAdquirir
          titulo="Adquirir Plan"
          insignia="Paso 4: Plan activado"
          subtitulo="Activación inmediata de tu suscripción"
          chip={respuesta.suscripcion.estado}
        />
        <BarraPasos pasos={BARRAS} />
        <PasoActivacion
          mensaje={respuesta.mensaje}
          suscripcion={respuesta.suscripcion}
          plan={plan}
          saldoRestante={saldoRestante}
          onVerMapa={() => navegar('/inicio')}
        />
      </div>
    </UsuarioLayout>
  );
}

export default AdquirirPlanPaso4Page;
