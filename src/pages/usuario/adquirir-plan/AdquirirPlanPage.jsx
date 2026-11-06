import { useState } from 'react';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import PasosProgreso from '../components/PasosProgreso.jsx';
import { PLANES, USUARIO } from '../datos.js';
import PasoNfc from './components/PasoNfc.jsx';
import PasoElegirPlan from './components/PasoElegirPlan.jsx';
import PasoResumenPago from './components/PasoResumenPago.jsx';
import PasoActivacion from './components/PasoActivacion.jsx';
import styles from './AdquirirPlanPage.module.css';

const PASOS = [
  { titulo: 'Verificación NFC' },
  { titulo: 'Elegir plan' },
  { titulo: 'Resumen y pago' },
  { titulo: 'Activación exitosa' },
];

const SUBTITULOS = [
  'Paso 1: Verificación de Tarjeta NFC',
  'Selecciona tu plan del catálogo y confirma el débito de tu billetera',
  'Paso 3: Resumen y Pago',
  'Activación inmediata y comprobante oficial de suscripción en Tunja Eco-Red',
];

// Saldo de la billetera (dato de ejemplo; después vendrá del backend)
const SALDO = 65000;

// Flujo de cuatro pasos para adquirir un plan: verificar la tarjeta, elegir, pagar y activar
function AdquirirPlanPage() {
  const [paso, setPaso] = useState(0);
  const [planId, setPlanId] = useState('mensual');
  const [autorizado, setAutorizado] = useState(false);

  // El catálogo de este flujo no muestra el plan anual (así está en el diseño)
  const planesDelFlujo = PLANES.filter((plan) => plan.id !== 'anual');
  const planElegido = PLANES.find((plan) => plan.id === planId);

  // Pendiente: volver a Mi plan (React Router)
  const volverAMiPlan = () => {};
  // Pendiente: ver el mapa de estaciones (React Router)
  const verMapa = () => {};

  return (
    <UsuarioLayout itemActivo="Mi plan">
      <div className={styles.raiz}>
        <EncabezadoPagina
          etiqueta={`Paso ${paso + 1} de ${PASOS.length}`}
          titulo="Adquirir Plan"
          subtitulo={SUBTITULOS[paso]}
          acciones={<span className={styles.nfc}>NFC: ACTIVO · #{USUARIO.nfc}</span>}
        />

        <PasosProgreso pasos={PASOS} pasoActual={paso} etiqueta="Pasos para adquirir el plan" />

        {paso === 0 && (
          <PasoNfc nfc={USUARIO.nfc} saldo={SALDO} onVolver={volverAMiPlan} onContinuar={() => setPaso(1)} />
        )}

        {paso === 1 && (
          <PasoElegirPlan
            planes={planesDelFlujo}
            planElegido={planId}
            saldo={SALDO}
            onElegir={setPlanId}
            onVolver={() => setPaso(0)}
            onContinuar={() => setPaso(2)}
          />
        )}

        {paso === 2 && (
          <PasoResumenPago
            plan={planElegido}
            nfc={USUARIO.nfc}
            saldo={SALDO}
            autorizado={autorizado}
            onAutorizar={setAutorizado}
            onModificar={() => setPaso(1)}
            onConfirmar={() => setPaso(3)}
          />
        )}

        {paso === 3 && <PasoActivacion plan={planElegido} nfc={USUARIO.nfc} saldo={SALDO} onVerMapa={verMapa} />}
      </div>
    </UsuarioLayout>
  );
}

export default AdquirirPlanPage;
