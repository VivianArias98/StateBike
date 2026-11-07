import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import { IconoCheck, IconoFlecha, IconoTarjeta } from '../../../components/Iconos/Iconos.jsx';
import styles from './CancelarPlanPaso2Page.module.css';

const FASES = [
  { titulo: 'Paso 1: Verificación', etiqueta: 'FASE ANTERIOR', estado: 'COMPLETADO', completada: true },
  { titulo: 'Paso 2: Cancelación Exitosa', etiqueta: 'FASE ACTUAL ACTIVA', estado: 'ACTIVO', completada: false },
];

const RESUMEN = [
  { etiqueta: 'PLAN ANTERIOR', valor: 'Plan Mensual' },
  { etiqueta: 'FECHA Y HORA EXACTA', valor: '13 de Noviembre de 2026 - 15:42' },
  { etiqueta: 'ESTADO DEL PLAN', valor: 'CANCELADO', tipo: 'cancelado' },
  { etiqueta: 'REEMBOLSO', valor: '$0 COP', nota: '(Sin reembolso de acuerdo a los términos del servicio)' },
  { etiqueta: 'DÍAS RESTANTES NO UTILIZADOS', valor: '18 días descartados' },
  { etiqueta: 'ESTADO TARJETA NFC', valor: 'ACTIVA FÍSICAMENTE', subvalor: '#TUN-8831', nota: '(Ya no desbloquea bicicletas con el plan anterior. Lista para asociar un nuevo plan)' },
];

function CancelarPlanPaso2Page() {
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
          <span className={styles.iconoExito}><IconoCheck /></span>
          <div>
            <p className={styles.codigo}>STATUS_CODE: 200_OK_MODIFIED</p>
            <h2 className={styles.tituloExito}>PLAN CANCELADO CORRECTAMENTE</h2>
            <p className={styles.textoExito}>El plan ha sido cancelado y se registró la fecha y hora de la transacción.</p>
          </div>
        </section>

        <section className={styles.resumen} aria-label="Resumen técnico de la cancelación">
          <div className={styles.cabeceraResumen}>
            <p className={styles.tituloResumen}>RESUMEN TÉCNICO DE LA CANCELACIÓN</p>
            <p className={styles.documento}>DOCUMENTO: POL_SYS_TRX</p>
          </div>

          <dl className={styles.filas}>
            {RESUMEN.map((fila) => (
              <div key={fila.etiqueta} className={styles.fila}>
                <dt className={styles.etiqueta}>{fila.etiqueta}</dt>
                <dd className={styles.valorFila}>
                  {fila.tipo === 'cancelado' ? (
                    <span className={styles.chipCancelado}>CANCELADO</span>
                  ) : (
                    <span className={styles.valor}>{fila.valor}</span>
                  )}
                  {fila.subvalor && <span className={styles.subvalor}>{fila.subvalor}</span>}
                  {fila.nota && <span className={styles.nota}>{fila.nota}</span>}
                </dd>
              </div>
            ))}
          </dl>

          <div className={styles.saldo}>
            <div>
              <p className={styles.etiqueta}>SALDO EN MI BILLETERA</p>
              <p className={styles.notaSaldo}>Sin afectación de cobros ni penalizaciones</p>
            </div>
            <p className={styles.montoSaldo}>$33.000 COP</p>
          </div>
        </section>

        <section className={styles.acciones}>
          <button type="button" className={`boton ${styles.botonVolver}`}>
            <IconoFlecha /> Volver a mi perfil
          </button>
          <button type="button" className={`boton ${styles.botonCatalogo}`}>
            <IconoTarjeta /> Ver catálogo de planes
          </button>
          <button type="button" className={`boton boton--acento ${styles.botonAdquirir}`}>
            Adquirir nuevo plan <IconoFlecha />
          </button>
        </section>
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default CancelarPlanPaso2Page;
