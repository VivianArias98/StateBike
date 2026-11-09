import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import { IconoCheck, IconoFlecha, IconoTarjeta } from '../../../components/Iconos/Iconos.jsx';
import { formatearFechaBogota } from '../../../utils/formatoMoneda.js';
import styles from './CancelarPlanPaso2Page.module.css';

const FASES = [
  { titulo: 'Paso 1: Verificación', etiqueta: 'FASE ANTERIOR', estado: 'COMPLETADO', completada: true },
  { titulo: 'Paso 2: Plan cancelado', etiqueta: 'FASE ACTUAL', estado: 'ACTIVO', completada: false },
];

// Cancelar plan, paso 2 de 2 (HU_2): confirmación con la respuesta del backend.
// Los datos llegan del paso 1 (estado de la navegación). Sin ellos se vuelve a Mi plan.
function CancelarPlanPaso2Page() {
  const navegar = useNavigate();
  const { state } = useLocation();

  if (!state?.respuesta) return <Navigate to="/plan" replace />;

  const { respuesta, plan } = state;
  const { suscripcion } = respuesta;
  const resumen = [
    { etiqueta: 'PLAN ANTERIOR', valor: suscripcion.nombre },
    { etiqueta: 'FECHA Y HORA', valor: formatearFechaBogota(suscripcion.fechaCancelacion) },
    { etiqueta: 'ESTADO DEL PLAN', valor: suscripcion.estado, tipo: 'estado' },
    { etiqueta: 'REEMBOLSO', valor: '$0 COP', nota: '(Sin reembolso)' },
  ];
  if (plan) resumen.push({ etiqueta: 'DÍAS RESTANTES NO UTILIZADOS', valor: `${plan.diasRestantes} días` });

  return (
    <UsuarioLayout itemActivo="Mi plan">
      <div className={styles.raiz}>
        <header>
          <h1 className={styles.titulo}>Cancelar Plan</h1>
        </header>

        <div className={styles.tarjetaGrande}>
          <ol className={styles.fases}>
            {FASES.map((fase) => (
              <li key={fase.titulo} className={`${styles.fase} ${fase.completada ? '' : styles.faseActiva}`}>
                <span className={`${styles.marca} ${fase.completada ? styles.marcaCompletada : styles.marcaActiva}`}>
                  {fase.completada ? <IconoCheck /> : '02'}
                </span>
                <div className={styles.textoFase}>
                  <p className={styles.etiquetaFase}>{fase.etiqueta}</p>
                  <p className={styles.tituloFase}>{fase.titulo}</p>
                </div>
                <span className={`${styles.estado} ${fase.completada ? '' : styles.estadoActivo}`}>{fase.estado}</span>
              </li>
            ))}
          </ol>

          <section className={styles.exito}>
            <span className={styles.iconoExito}>
              <IconoCheck />
            </span>
            <div>
              <h2 className={styles.tituloExito}>{respuesta.mensaje}</h2>
              <p className={styles.textoExito}>El plan fue cancelado y se registró la fecha y hora de la cancelación.</p>
            </div>
          </section>

          <section className={styles.resumen} aria-label="Resumen de la cancelación">
            <div className={styles.cabeceraResumen}>
              <p className={styles.tituloResumen}>RESUMEN DE LA CANCELACIÓN</p>
            </div>

            <dl className={styles.filas}>
              {resumen.map((fila) => (
                <div key={fila.etiqueta} className={styles.fila}>
                  <dt className={styles.etiqueta}>{fila.etiqueta}</dt>
                  <dd className={styles.valorFila}>
                    {fila.tipo === 'estado' ? (
                      <span className={styles.chipCancelado}>{fila.valor}</span>
                    ) : (
                      <span className={styles.valor}>{fila.valor}</span>
                    )}
                    {fila.nota && <span className={styles.nota}>{fila.nota}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className={styles.acciones}>
            <button type="button" className={`boton ${styles.botonVolver}`} onClick={() => navegar('/billetera')}>
              <IconoFlecha /> Ir a Mi billetera
            </button>
            <button type="button" className={`boton ${styles.botonCatalogo}`} onClick={() => navegar('/plan')}>
              <IconoTarjeta /> Ver catálogo de planes
            </button>
            <button
              type="button"
              className={`boton boton--acento ${styles.botonAdquirir}`}
              onClick={() => navegar('/plan/adquirir')}
            >
              Adquirir nuevo plan <IconoFlecha />
            </button>
          </section>
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default CancelarPlanPaso2Page;
