import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import { IconoAlerta, IconoFlecha, IconoCerrar } from '../../../../components/Iconos/Iconos.jsx';
import EstadoCarga from '../../components/EstadoCarga.jsx';
import { useCarga } from '../../../../utils/useCarga.js';
import { mensajeError } from '../../../../utils/mensajeError.js';
import { formatearFechaBogota } from '../../../../utils/formatoMoneda.js';
import { cancelarPlan, obtenerMiPlan } from '../planApi.js';
import styles from './CancelarPlanPaso1Page.module.css';

const PASOS = [
  { numero: '01', titulo: 'Condiciones e impacto de la cancelación', estado: 'ACTIVO', activo: true },
  { numero: '02', titulo: 'Plan cancelado', estado: 'PENDIENTE', activo: false },
];

// Cancelar plan, paso 1 de 2 (HU_2): revisar el plan vigente y confirmar.
// La cancelación es inmediata y sin reembolso; el backend la rechaza si hay un viaje en curso.
function CancelarPlanPaso1Page() {
  const navegar = useNavigate();
  const { datos, cargando, error, reintentar } = useCarga(obtenerMiPlan);
  const [cancelando, setCancelando] = useState(false);
  const [errorCancelar, setErrorCancelar] = useState('');

  const plan = datos?.plan;
  const volver = () => navegar('/plan');

  const confirmar = async () => {
    setCancelando(true);
    setErrorCancelar('');
    try {
      const respuesta = await cancelarPlan();
      navegar('/plan/cancelar/listo', { state: { respuesta, plan } });
    } catch (errorApi) {
      setErrorCancelar(mensajeError(errorApi));
      setCancelando(false);
    }
  };

  return (
    <UsuarioLayout itemActivo="Mi plan">
      <div className={styles.raiz}>
        <header className={styles.cabecera}>
          <div className={styles.textoCabecera}>
            <h1 className={styles.titulo}>Cancelar Plan</h1>
            <p className={styles.subtitulo}>Revisa las condiciones antes de confirmar la cancelación de tu plan.</p>
          </div>
        </header>

        <ol className={styles.pasos}>
          {PASOS.map((paso) => (
            <li key={paso.numero} className={`${styles.paso} ${paso.activo ? styles.pasoActivo : ''}`}>
              <span className={styles.numero}>{paso.numero}</span>
              <div className={styles.textoPaso}>
                <p className={styles.tituloPaso}>{paso.titulo}</p>
              </div>
              <span className={`${styles.estado} ${paso.activo ? styles.estadoActivo : ''}`}>{paso.estado}</span>
            </li>
          ))}
        </ol>

        <EstadoCarga
          cargando={cargando}
          error={error}
          onReintentar={reintentar}
          vacio={datos && !datos.tienePlan ? datos.mensaje : ''}
        />

        {!cargando && plan && (
          <section className={styles.seccion} aria-label="Confirmación de cancelación">
            <div className={styles.tarjetas}>
              <div className={styles.tarjeta}>
                <p className={styles.etiqueta}>TIPO DE SUSCRIPCIÓN</p>
                <p className={styles.valor}>{plan.nombre}</p>
              </div>
              <div className={styles.tarjeta}>
                <p className={styles.etiqueta}>FECHA DE FIN ORIGINAL</p>
                <p className={styles.valor}>{formatearFechaBogota(plan.fechaFin)}</p>
              </div>
              <div className={styles.tarjeta}>
                <p className={styles.etiqueta}>VIGENCIA RESTANTE</p>
                <p className={styles.valor}>{plan.diasRestantes} días restantes</p>
                <p className={styles.alerta}>SIN REEMBOLSO</p>
              </div>
            </div>

            <div className={styles.critico}>
              <div className={styles.cabeceraCritica}>
                <p className={styles.tituloCritico}>
                  <IconoAlerta /> EFECTOS DE LA CANCELACIÓN
                </p>
              </div>
              <p className={styles.advertencia}>Perderá los días restantes y no habrá reembolso.</p>
              <p className={styles.textoCritico}>
                La cancelación es inmediata: tu tarjeta NFC dejará de desbloquear bicicletas con este plan. Si tienes un
                cobro por exceso pendiente, se mantiene en tu billetera. No es posible cancelar con un viaje en curso.
              </p>
            </div>

            {errorCancelar && (
              <p className="mensaje-error" role="alert">
                {errorCancelar}
              </p>
            )}

            <div className={styles.acciones}>
              <button type="button" className={`boton ${styles.botonVolver}`} onClick={volver} disabled={cancelando}>
                <IconoFlecha /> No cancelar, mantener plan activo
              </button>
              <button type="button" className={`boton ${styles.botonCancelar}`} onClick={confirmar} disabled={cancelando}>
                <IconoCerrar /> {cancelando ? 'Cancelando...' : 'Confirmar cancelación del plan'}
              </button>
            </div>
          </section>
        )}

        {!cargando && datos && !datos.tienePlan && (
          <button type="button" className={`boton ${styles.botonVolver}`} onClick={volver}>
            <IconoFlecha /> Volver a Mi plan
          </button>
        )}
      </div>
    </UsuarioLayout>
  );
}

export default CancelarPlanPaso1Page;
