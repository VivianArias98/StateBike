import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import BarraPasos from '../components/BarraPasos.jsx';
import CabeceraAdquirir from '../components/CabeceraAdquirir.jsx';
import PasoNfc from './components/PasoNfc.jsx';
import { NFC } from '../datos-adquirir.js';
import styles from './AdquirirPlanPaso1Page.module.css';

// Pasos del diseño: cada pantalla tiene su barra y su encabezado
const BARRAS = [
    { etiqueta: 'Paso 01 (activo)', titulo: 'Verificación NFC', detalle: 'Detectada', estado: 'activo' },
    { etiqueta: 'Paso 02 (pendiente)', titulo: 'Elegir Plan', detalle: 'Siguiente paso', estado: 'pendiente' },
    { etiqueta: 'Paso 03 (pendiente)', titulo: 'Resumen y Pago', detalle: 'Checkout', estado: 'pendiente' },
    { etiqueta: 'Paso 04 (pendiente)', titulo: 'Activación Exitosa', detalle: 'Confirmación final', estado: 'pendiente' },
  ];

const CABECERA = { titulo: 'Adquirir Plan', subtitulo: 'Paso 1: Verificación de Tarjeta NFC', chip: `NFC: ACTIVO · #${NFC}` };


// Pantalla del paso 1 de Adquirir plan
function AdquirirPlanPaso1Page() {
  const cabecera = CABECERA;

  return (
    <UsuarioLayout itemActivo="Mi plan">
      <div className={styles.raiz}>
        <CabeceraAdquirir {...cabecera} />
        <BarraPasos pasos={BARRAS} />
        {/* Pendiente: volver a Mi plan y avanzar al paso 2 (React Router) */}
        <PasoNfc nfc={NFC} onVolver={() => {}} onContinuar={() => {}} />
      </div>
    </UsuarioLayout>
  );
}

export default AdquirirPlanPaso1Page;
