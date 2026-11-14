import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import { IconoAlerta, IconoFlecha, IconoCerrar } from '../../../../components/Iconos/Iconos.jsx';
import { formatearFechaBogota } from '../../../../utils/formatoMoneda.js';
import { useUsuario } from '../../context/UsuarioContext.jsx';
import styles from './CancelarPlanPaso1Page.module.css';

const PASOS = [
  { numero: '01', titulo: 'Condiciones e impacto de la cancelación', estado: 'ACTIVO', activo: true },
  { numero: '02', titulo: 'Plan cancelado', estado: 'PENDIENTE', activo: false },
];

function CancelarPlanPaso1Page() {
  const navegar = useNavigate();
  const { plan, cancelarPlan } = useUsuario();
  const [cancelando, setCancelando] = useState(false);
  const [errorCancelar, setErrorCancelar] = useState('');

  const planActivo = plan?.planActivo;
  const volver = () => navegar('/plan');

  const confirmar = async () => {
    setCancelando(true);
    setErrorCancelar('');
    try {
      const respuesta = await cancelarPlan();
      navegar('/plan/cancelar/listo', {
        state: {
          respuesta: {
            ...respuesta,
            suscripcion: respuesta.suscripcion || {
              id: 'SUSC-CANCELADA',
              planId: planActivo?.id,
              nombre: planActivo?.nombre,
              estado: 'CANCELADA',
              fechaCancelacion: new Date().toISOString(),
            },
          },
          plan: planActivo,
        },
      });
    } catch (err) {
      setErrorCancelar(err.message);
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

        {!plan.tienePlan || !planActivo ? (
          <div className="tarjeta" style={{ textAlign: 'center', padding: 'var(--espacio-6)' }}>
            <p style={{ fontSize: 'var(--texto-l)', fontWeight: 'bold' }}>No tienes ningún plan activo para cancelar</p>
            <button type="button" className={`boton ${styles.botonVolver}`} onClick={volver} style={{ marginTop: 'var(--espacio-3)' }}>
              <IconoFlecha /> Volver a Mi plan
            </button>
          </div>
        ) : (
          <section className={styles.seccion} aria-label="Confirmación de cancelación">
            <div className={styles.tarjetas}>
              <div className={styles.tarjeta}>
                <p className={styles.etiqueta}>TIPO DE SUSCRIPCIÓN</p>
                <p className={styles.valor}>{planActivo.nombre}</p>
              </div>
              <div className={styles.tarjeta}>
                <p className={styles.etiqueta}>FECHA DE FIN ORIGINAL</p>
                <p className={styles.valor}>{formatearFechaBogota(planActivo.fechaFin)}</p>
              </div>
              <div className={styles.tarjeta}>
                <p className={styles.etiqueta}>VIGENCIA RESTANTE</p>
                <p className={styles.valor}>{planActivo.diasRestantes} días restantes</p>
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
      </div>
    </UsuarioLayout>
  );
}

export default CancelarPlanPaso1Page;
