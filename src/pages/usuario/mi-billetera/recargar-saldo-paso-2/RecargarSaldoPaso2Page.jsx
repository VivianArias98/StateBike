import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import { IconoBilletera, IconoCheck, IconoInfo } from '../../../../components/Iconos/Iconos.jsx';
import { formatearPesos } from '../../formato.js';
import { formatearFechaBogota } from '../../../../utils/formatoMoneda.js';
import styles from './RecargarSaldoPaso2Page.module.css';

// Recargar saldo, paso 2 de 2 (HU_24): comprobante con la respuesta del backend.
// Los datos llegan desde el paso 1 (estado de la navegación). Sin ellos no hay nada que mostrar.
function RecargarSaldoPaso2Page() {
  const navegar = useNavigate();
  const { state } = useLocation();

  if (!state?.recarga) return <Navigate to="/billetera" replace />;

  const { recarga, cobroPendiente, fecha } = state;
  const filas = [
    { etiqueta: 'Saldo anterior', valor: `${formatearPesos(recarga.saldoAnterior)} COP` },
    { etiqueta: 'Monto recargado', valor: `+${formatearPesos(recarga.montoRecargado)} COP`, destacada: true },
  ];

  return (
    <UsuarioLayout itemActivo="Mi billetera">
      <div className={styles.raiz}>
        <button type="button" className={`enlace ${styles.volver}`} onClick={() => navegar('/billetera')}>
          ← Volver a Mi Billetera
        </button>

        <header className={styles.cabecera}>
          <div className={styles.textoCabecera}>
            <h1 className={styles.titulo}>Recargar Saldo</h1>
            <p className={styles.subtitulo}>Paso 2 de 2: Confirmación y comprobante de recarga.</p>
          </div>
          <span className={`insignia ${styles.paso}`}>PASO 2 / 2</span>
        </header>

        <div className={styles.contenido}>
          <div className={styles.izquierda}>
            <section className={`tarjeta ${styles.tarjetaExito}`} aria-labelledby="exito-titulo">
              <span className={styles.iconoExito}>
                <IconoCheck />
              </span>
              <div className={styles.textoExito}>
                <h2 id="exito-titulo" className={styles.tituloExito}>
                  {recarga.mensaje}
                </h2>
              </div>
            </section>

            {cobroPendiente && (
              <section className={`tarjeta ${styles.tarjetaAviso}`} aria-label="Cobro pendiente">
                <span className={styles.iconoAviso}>
                  <IconoInfo />
                </span>
                <p className={styles.textoAviso}>
                  Tiene un cobro pendiente de{' '}
                  <strong className={styles.montoPendiente}>{formatearPesos(cobroPendiente.monto)} COP</strong>. La
                  recarga no paga cobros pendientes de forma automática; puede pagarlo desde{' '}
                  <strong>MI BILLETERA</strong>.
                </p>
              </section>
            )}

            <section className={`tarjeta ${styles.tarjetaAcciones}`} aria-labelledby="acciones-titulo">
              <h2 id="acciones-titulo" className={styles.tituloSeccion}>
                Acciones rápidas
              </h2>
              <div className={styles.botones}>
                <button type="button" className={`boton ${styles.principal}`} onClick={() => navegar('/billetera')}>
                  <IconoBilletera /> Ir a mi billetera
                </button>
                {cobroPendiente && (
                  <button
                    type="button"
                    className={`boton ${styles.secundario}`}
                    onClick={() => navegar('/billetera/pagar')}
                  >
                    Pagar cobro pendiente
                  </button>
                )}
              </div>
            </section>
          </div>

          <section className={`tarjeta ${styles.detalle}`} aria-labelledby="detalle-titulo">
            <header className={styles.cabeceraDetalle}>
              <h2 id="detalle-titulo" className={styles.tituloDetalle}>
                Detalle del movimiento
              </h2>
            </header>

            <div className={styles.filas}>
              {filas.map((fila) => (
                <div key={fila.etiqueta} className={styles.fila}>
                  <span>{fila.etiqueta}</span>
                  <span className={fila.destacada ? styles.valorDestacado : styles.valor}>{fila.valor}</span>
                </div>
              ))}
            </div>

            <div className={styles.nuevoSaldo}>
              <span className={styles.nuevoSaldoEtiqueta}>
                <IconoBilletera /> Nuevo saldo disponible:
              </span>
              <span className={styles.nuevoSaldoValor}>{formatearPesos(recarga.nuevoSaldo)} COP</span>
            </div>

            <div className={styles.filas}>
              <div className={styles.fila}>
                <span>Concepto</span>
                <span className={styles.valor}>Recarga de saldo</span>
              </div>
              <div className={styles.fila}>
                <span>Fecha y hora</span>
                <span className={styles.valor}>{formatearFechaBogota(fecha)}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default RecargarSaldoPaso2Page;
