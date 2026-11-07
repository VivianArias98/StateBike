import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import BarraPasos from '../components/BarraPasos.jsx';
import CabeceraAdquirir from '../components/CabeceraAdquirir.jsx';
import PasoActivacion from './components/PasoActivacion.jsx';
import { NFC, PLANES_FLUJO } from '../datos-adquirir.js';
import styles from './AdquirirPlanPaso4Page.module.css';

// Pasos del diseño: cada pantalla tiene su barra y su encabezado
const BARRAS = [
    { etiqueta: 'Hito 01', titulo: 'Verificación NFC', estado: 'completado' },
    { etiqueta: 'Hito 02', titulo: 'Selección de Plan', estado: 'completado' },
    { etiqueta: 'Hito 03', titulo: 'Resumen y Pago', estado: 'completado' },
    { etiqueta: 'Activo', titulo: 'Activación Exitosa', estado: 'activo' },
  ];

const CABECERA = {
    titulo: 'Adquirir Plan',
    insignia: 'Paso 4: Plan activado',
    subtitulo: 'Activación inmediata y comprobante oficial de suscripción en Tunja Eco-Red',
    chip: 'Operación: #ACT-9942',
  };

const PLAN_INICIAL = 'mensual';

// Pantalla del paso 4 de Adquirir plan
function AdquirirPlanPaso4Page() {
  const cabecera = CABECERA;
  const planElegido = PLANES_FLUJO.find((plan) => plan.id === PLAN_INICIAL);

  return (
    <UsuarioLayout itemActivo="Mi plan">
      <div className={styles.raiz}>
        <CabeceraAdquirir {...cabecera} />
        <BarraPasos pasos={BARRAS} />
        {/* Pendiente: navegar al mapa de estaciones (React Router) */}
        <PasoActivacion plan={planElegido} nfc={NFC} onVerMapa={() => {}} />
      </div>
    </UsuarioLayout>
  );
}

export default AdquirirPlanPaso4Page;
