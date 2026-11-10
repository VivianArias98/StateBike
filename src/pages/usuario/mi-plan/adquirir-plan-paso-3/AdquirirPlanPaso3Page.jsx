import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import BarraPasos from '../components/BarraPasos.jsx';
import CabeceraAdquirir from '../components/CabeceraAdquirir.jsx';
import { useUsuario } from '../../context/UsuarioContext.jsx';
import PasoResumenPago from './components/PasoResumenPago.jsx';
import styles from './AdquirirPlanPaso3Page.module.css';

const BARRAS = [
  { etiqueta: 'Paso 1', titulo: 'Verificación NFC', estado: 'completado' },
  { etiqueta: 'Paso 2', titulo: 'Elegir Plan', estado: 'completado' },
  { etiqueta: 'Activo', titulo: 'Pagar / Resumen', estado: 'activo' },
  { etiqueta: 'Paso 4', titulo: 'Confirmación', estado: 'pendiente' },
];

function AdquirirPlanPaso3Page() {
  const navegar = useNavigate();
  const { state } = useLocation();
  const { perfil, billetera, planesCatalogo, adquirirPlan } = useUsuario();
  const [autorizado, setAutorizado] = useState(false);
  const [pagando, setPagando] = useState(false);
  const [errorPago, setErrorPago] = useState('');

  if (!state?.planId) return <Navigate to="/plan/adquirir/elegir" replace />;

  const plan = planesCatalogo.find((item) => item.id === state.planId);
  if (!plan) return <Navigate to="/plan/adquirir/elegir" replace />;

  const confirmar = async () => {
    setPagando(true);
    setErrorPago('');
    try {
      const respuesta = await adquirirPlan(plan);
      navegar('/plan/adquirir/activado', {
        state: {
          respuesta: {
            ...respuesta,
            suscripcion: respuesta.suscripcion || {
              id: `SUSC-${Date.now().toString().slice(-4)}`,
              nombre: plan.nombre,
              vigenciaDias: plan.vigenciaDias,
              fechaInicio: new Date().toISOString(),
              fechaFin: new Date(Date.now() + 3600000 * 24 * plan.vigenciaDias).toISOString(),
              estado: 'ACTIVA',
            },
          },
          plan,
          saldoRestante: billetera.saldo - plan.costoBase,
          tarjeta: perfil.tarjeta,
        },
      });
    } catch (err) {
      setErrorPago(err.message);
      setPagando(false);
    }
  };

  return (
    <UsuarioLayout itemActivo="Mi plan">
      <div className={styles.raiz}>
        <CabeceraAdquirir
          titulo="Adquirir Plan"
          subtitulo="Paso 3: Resumen y Pago"
          chip={`NFC: ${perfil?.tarjeta?.estado ?? 'ACTIVA'}`}
        />
        <BarraPasos pasos={BARRAS} />

        <PasoResumenPago
          plan={plan}
          ultimosDigitos={perfil?.tarjeta?.ultimosDigitos || '----'}
          saldo={billetera.saldo}
          autorizado={autorizado}
          pagando={pagando}
          error={errorPago}
          onAutorizar={setAutorizado}
          onModificar={() => navegar('/plan/adquirir/elegir', { state: { planId: plan.id } })}
          onConfirmar={confirmar}
        />
      </div>
    </UsuarioLayout>
  );
}

export default AdquirirPlanPaso3Page;
