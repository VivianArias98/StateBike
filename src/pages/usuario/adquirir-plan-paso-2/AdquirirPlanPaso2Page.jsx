import { useState } from 'react';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import BarraPasos from '../components/BarraPasos.jsx';
import CabeceraAdquirir from '../components/CabeceraAdquirir.jsx';
import PasoElegirPlan from './components/PasoElegirPlan.jsx';
import { NFC, PLANES_FLUJO, SALDO } from '../datos-adquirir.js';
import styles from './AdquirirPlanPaso2Page.module.css';

// Pasos del diseño: cada pantalla tiene su barra y su encabezado
const BARRAS = [
    { etiqueta: '1. NFC', titulo: 'Verificada', estado: 'completado' },
    { etiqueta: '2. Plan y pago', titulo: 'En curso', estado: 'activo' },
    { etiqueta: '3. Resumen', titulo: 'Pendiente', estado: 'pendiente' },
    { etiqueta: '4. Confirmación', titulo: 'Pendiente', estado: 'pendiente' },
  ];

const CABECERA = {
    etiqueta: 'Paso 2 de 4',
    titulo: 'Adquirir Plan',
    subtitulo: 'Selecciona tu plan del catálogo y confirma el débito de tu billetera',
    chip: `Tarjeta NFC #${NFC} vinculada`,
    conCheck: true,
  };

const PLAN_INICIAL = 'mensual';

// Pantalla del paso 2 de Adquirir plan
function AdquirirPlanPaso2Page() {
  const cabecera = CABECERA;
  const [planId, setPlanId] = useState(PLAN_INICIAL);

  return (
    <UsuarioLayout itemActivo="Mi plan">
      <div className={styles.raiz}>
        <CabeceraAdquirir {...cabecera} />
        <BarraPasos pasos={BARRAS} />
        {/* Pendiente: volver al paso 1 y avanzar al paso 3 (React Router) */}
        <PasoElegirPlan
          planes={PLANES_FLUJO}
          planElegido={planId}
          saldo={SALDO}
          nfc={NFC}
          onElegir={setPlanId}
          onVolver={() => {}}
          onContinuar={() => {}}
        />
      </div>
    </UsuarioLayout>
  );
}

export default AdquirirPlanPaso2Page;
