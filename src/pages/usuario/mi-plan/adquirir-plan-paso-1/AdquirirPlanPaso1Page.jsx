import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import BarraPasos from '../components/BarraPasos.jsx';
import CabeceraAdquirir from '../components/CabeceraAdquirir.jsx';
import { useUsuario } from '../../context/UsuarioContext.jsx';
import PasoNfc from './components/PasoNfc.jsx';
import styles from './AdquirirPlanPaso1Page.module.css';

const BARRAS = [
  { etiqueta: 'Paso 01 (activo)', titulo: 'Verificación NFC', estado: 'activo' },
  { etiqueta: 'Paso 02 (pendiente)', titulo: 'Elegir Plan', estado: 'pendiente' },
  { etiqueta: 'Paso 03 (pendiente)', titulo: 'Resumen y Pago', estado: 'pendiente' },
  { etiqueta: 'Paso 04 (pendiente)', titulo: 'Activación Exitosa', estado: 'pendiente' },
];

const SIN_TARJETA_ACTIVA = 'Debe tener una tarjeta NFC activa para adquirir un plan';
const YA_TIENE_PLAN = 'Ya tiene un plan activo';

function AdquirirPlanPaso1Page() {
  const navegar = useNavigate();
  const { state } = useLocation();
  const { perfil, billetera, plan } = useUsuario();

  const tarjeta = perfil?.tarjeta;
  let bloqueo = '';
  if (tarjeta?.estado !== 'ACTIVA') bloqueo = SIN_TARJETA_ACTIVA;
  else if (plan.tienePlan) bloqueo = YA_TIENE_PLAN;

  return (
    <UsuarioLayout itemActivo="Mi plan">
      <div className={styles.raiz}>
        <CabeceraAdquirir
          titulo="Adquirir Plan"
          subtitulo="Paso 1: Verificación de Tarjeta NFC"
          chip={tarjeta ? `NFC: ${tarjeta.estado} · •••• ${tarjeta.ultimosDigitos}` : 'NFC: SIN VINCULAR'}
        />
        <BarraPasos pasos={BARRAS} />

        <PasoNfc
          tarjeta={tarjeta}
          saldo={billetera.saldo}
          tienePlan={plan.tienePlan}
          bloqueo={bloqueo}
          onVolver={() => navegar('/plan')}
          onContinuar={() => navegar('/plan/adquirir/elegir', { state })}
        />
      </div>
    </UsuarioLayout>
  );
}

export default AdquirirPlanPaso1Page;
