import { useState } from 'react';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import BarraPasos from '../components/BarraPasos.jsx';
import CabeceraAdquirir from '../components/CabeceraAdquirir.jsx';
import PasoResumenPago from './components/PasoResumenPago.jsx';
import { NFC, PLANES_FLUJO, SALDO } from '../datos-adquirir.js';
import styles from './AdquirirPlanPaso3Page.module.css';

// Pasos del diseño: cada pantalla tiene su barra y su encabezado
const BARRAS = [
    { etiqueta: 'Paso 1', titulo: 'Verificación NFC', estado: 'completado' },
    { etiqueta: 'Paso 2', titulo: 'Elegir Plan', estado: 'completado' },
    { etiqueta: 'Activo', titulo: 'Pagar / Resumen', estado: 'activo' },
    { etiqueta: 'Paso 4', titulo: 'Confirmación', estado: 'pendiente' },
  ];

const CABECERA = {
    titulo: 'Adquirir Plan',
    insignia: 'Flujo oficial',
    subtitulo: 'Paso 3: Resumen y Pago',
    chip: `NFC: ACTIVO | #${NFC}`,
  };

const PLAN_INICIAL = 'mensual';

// Pantalla del paso 3 de Adquirir plan
function AdquirirPlanPaso3Page() {
  const cabecera = CABECERA;
  const [autorizado, setAutorizado] = useState(false);
  const planElegido = PLANES_FLUJO.find((plan) => plan.id === PLAN_INICIAL);

  return (
    <UsuarioLayout itemActivo="Mi plan">
      <div className={styles.raiz}>
        <CabeceraAdquirir {...cabecera} />
        <BarraPasos pasos={BARRAS} />
        {/* Pendiente: volver a modificar el plan y confirmar la activación (React Router) */}
        <PasoResumenPago
          plan={planElegido}
          nfc={NFC}
          saldo={SALDO}
          autorizado={autorizado}
          onAutorizar={setAutorizado}
          onModificar={() => {}}
          onConfirmar={() => {}}
        />
      </div>
    </UsuarioLayout>
  );
}

export default AdquirirPlanPaso3Page;
