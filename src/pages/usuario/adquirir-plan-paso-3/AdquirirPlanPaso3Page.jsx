import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import BarraPasos from '../components/BarraPasos.jsx';
import CabeceraAdquirir from '../components/CabeceraAdquirir.jsx';
import EstadoCarga from '../components/EstadoCarga.jsx';
import { useCarga } from '../../../utils/useCarga.js';
import { mensajeError } from '../../../utils/mensajeError.js';
import { adquirirPlan, obtenerDatosCompra } from '../mi-plan/planApi.js';
import PasoResumenPago from './components/PasoResumenPago.jsx';
import styles from './AdquirirPlanPaso3Page.module.css';

const BARRAS = [
  { etiqueta: 'Paso 1', titulo: 'Verificación NFC', estado: 'completado' },
  { etiqueta: 'Paso 2', titulo: 'Elegir Plan', estado: 'completado' },
  { etiqueta: 'Activo', titulo: 'Pagar / Resumen', estado: 'activo' },
  { etiqueta: 'Paso 4', titulo: 'Confirmación', estado: 'pendiente' },
];

// Adquirir plan, paso 3 de 4 (HU_2): resumen y pago con el saldo de la billetera
function AdquirirPlanPaso3Page() {
  const navegar = useNavigate();
  const { state } = useLocation();
  const { datos, cargando, error, reintentar } = useCarga(obtenerDatosCompra);
  const [autorizado, setAutorizado] = useState(false);
  const [pagando, setPagando] = useState(false);
  const [errorPago, setErrorPago] = useState('');

  // Sin plan elegido (entró directo por la URL) vuelve a elegir
  if (!state?.planId) return <Navigate to="/plan/adquirir/elegir" replace />;

  const plan = datos?.miPlan.catalogo.find((item) => item.id === state.planId);
  if (datos && !plan) return <Navigate to="/plan/adquirir/elegir" replace />;

  const confirmar = async () => {
    setPagando(true);
    setErrorPago('');
    try {
      const respuesta = await adquirirPlan(plan.id);
      navegar('/plan/adquirir/activado', {
        state: { respuesta, plan, saldoRestante: datos.saldo - plan.costoBase, tarjeta: datos.miPlan.tarjeta },
      });
    } catch (errorApi) {
      // "Saldo insuficiente para adquirir el plan. Le faltan $X...": el faltante se calcula aquí
      setErrorPago(mensajeError(errorApi, { faltante: plan.costoBase - datos.saldo }));
      setPagando(false);
    }
  };

  return (
    <UsuarioLayout itemActivo="Mi plan">
      <div className={styles.raiz}>
        <CabeceraAdquirir
          titulo="Adquirir Plan"
          subtitulo="Paso 3: Resumen y Pago"
          chip={datos?.miPlan.tarjeta ? `NFC: ${datos.miPlan.tarjeta.estado}` : 'NFC'}
        />
        <BarraPasos pasos={BARRAS} />

        <EstadoCarga cargando={cargando} error={error} onReintentar={reintentar} />

        {!cargando && plan && (
          <PasoResumenPago
            plan={plan}
            ultimosDigitos={datos.miPlan.tarjeta?.ultimosDigitos}
            saldo={datos.saldo}
            autorizado={autorizado}
            pagando={pagando}
            error={errorPago}
            onAutorizar={setAutorizado}
            onModificar={() => navegar('/plan/adquirir/elegir', { state: { planId: plan.id } })}
            onConfirmar={confirmar}
          />
        )}
      </div>
    </UsuarioLayout>
  );
}

export default AdquirirPlanPaso3Page;
