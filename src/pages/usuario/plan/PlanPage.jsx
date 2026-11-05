import { useEffect, useState } from 'react';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import Aviso from '../../../components/Avisos/Aviso.jsx';
import MiPlan from './MiPlan.jsx';
import CatalogoPlanes from './CatalogoPlanes.jsx';
import ResumenCompra from './ResumenCompra.jsx';
import CancelarPlan from './CancelarPlan.jsx';
import {
  obtenerEstadoPlan,
  obtenerCatalogo,
  verificarPuedeAdquirir,
  verificarPuedeCancelar,
  adquirirPlan,
  cancelarPlan,
} from '../../../services/planesService.js';
import styles from './PlanPage.module.css';

// Página del módulo Mi Plan: adquirir y cancelar un plan.
// Guarda el estado y la lógica; las vistas solo dibujan.
// vista: 'inicio' | 'catalogo' | 'resumen' | 'cancelar'. Con React Router serán rutas.
function PlanPage() {
  const [vista, setVista] = useState('inicio');
  const [cuenta, setCuenta] = useState(null); // { saldo, plan, tarjetaActiva, viajeEnCurso }
  const [catalogo, setCatalogo] = useState([]);
  const [planElegido, setPlanElegido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    Promise.all([obtenerEstadoPlan(), obtenerCatalogo()])
      .then(([estado, planes]) => {
        setCuenta(estado);
        setCatalogo(planes);
      })
      .catch(() => setError('No se pudo cargar la información del plan. Intenta de nuevo.'))
      .finally(() => setCargando(false));
  }, []);

  function irA(nuevaVista) {
    setVista(nuevaVista);
    setError('');
  }

  // Al pulsar ADQUIRIR PLAN: el sistema verifica tarjeta NFC y plan vigente
  async function iniciarAdquisicion() {
    setError('');
    try {
      await verificarPuedeAdquirir();
      irA('catalogo');
    } catch (fallo) {
      setError(fallo.message);
    }
  }

  // Al pulsar CANCELAR PLAN: el sistema verifica que no haya viaje en curso
  async function iniciarCancelacion() {
    setError('');
    try {
      await verificarPuedeCancelar();
      irA('cancelar');
    } catch (fallo) {
      setError(fallo.message);
    }
  }

  async function confirmarCompra() {
    setEnviando(true);
    setError('');
    try {
      const resultado = await adquirirPlan(planElegido.id, true);
      setCuenta(resultado.estado);
      setAviso(resultado.mensaje);
      irA('inicio');
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setEnviando(false);
    }
  }

  async function confirmarCancelacion() {
    setEnviando(true);
    setError('');
    try {
      const resultado = await cancelarPlan(true);
      setCuenta(resultado.estado);
      setAviso(resultado.mensaje);
      irA('inicio');
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setEnviando(false);
    }
  }

  let contenido;
  if (cargando) {
    contenido = <p className={styles.estado}>Cargando tu plan…</p>;
  } else if (!cuenta) {
    contenido = (
      <p className="mensaje-error" role="alert">
        {error}
      </p>
    );
  } else if (vista === 'catalogo') {
    contenido = (
      <CatalogoPlanes
        catalogo={catalogo}
        onElegir={(plan) => {
          setPlanElegido(plan);
          irA('resumen');
        }}
        onVolver={() => irA('inicio')}
      />
    );
  } else if (vista === 'resumen' && planElegido) {
    contenido = (
      <ResumenCompra
        plan={planElegido}
        saldo={cuenta.saldo}
        enviando={enviando}
        error={error}
        onConfirmar={confirmarCompra}
        onVolver={() => irA('catalogo')}
      />
    );
  } else if (vista === 'cancelar') {
    contenido = (
      <CancelarPlan
        plan={cuenta.plan}
        enviando={enviando}
        error={error}
        onConfirmar={confirmarCancelacion}
        onVolver={() => irA('inicio')}
      />
    );
  } else {
    contenido = (
      <MiPlan
        plan={cuenta.plan}
        saldo={cuenta.saldo}
        error={error}
        onAdquirir={iniciarAdquisicion}
        onCancelar={iniciarCancelacion}
      />
    );
  }

  return (
    <UsuarioLayout itemActivo="Mi Plan">
      <div className={styles.raiz}>{contenido}</div>
      <Aviso mensaje={aviso} onCerrar={() => setAviso('')} />
    </UsuarioLayout>
  );
}

export default PlanPage;
