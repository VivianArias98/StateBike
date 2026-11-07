import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import { IconoBilletera, IconoCheck, IconoDescarga, IconoInfo, IconoNfc, IconoTarjeta } from '../../../components/Iconos/Iconos.jsx';
import { formatearPesos } from '../formato.js';
import styles from './RecargarSaldoPaso2Page.module.css';

// Datos de ejemplo del mockup. Después llegarán del backend.
const RECARGA = {
  referencia: 'REF: TRX-994021',
  saldoAnterior: 15000,
  montoRecargado: 20000,
  nuevoSaldo: 35000,
  concepto: 'Recarga de saldo',
  canal: 'PSE • Aprobado #77291',
  fecha: '02 Nov 2026, 10:15 AM',
  estado: 'Acreditado de inmediato',
};
const COBRO_PENDIENTE = 2500;

function RecargarSaldoPaso2Page() {
  const filas = [
    { etiqueta: 'Saldo anterior', valor: `${formatearPesos(RECARGA.saldoAnterior)} COP` },
    { etiqueta: 'Monto recargado', valor: `+${formatearPesos(RECARGA.montoRecargado)} COP`, destacada: true },
  ];
  const detalles = [
    { etiqueta: 'Concepto registrado', valor: RECARGA.concepto },
    { etiqueta: 'Canal de pago', valor: RECARGA.canal },
    { etiqueta: 'Fecha y hora', valor: RECARGA.fecha },
  ];

  return (
    <UsuarioLayout itemActivo="Mi billetera">
      <div className={styles.raiz}>
        <button type="button" className={`enlace ${styles.volver}`}>
          ← Volver a Mi Billetera
        </button>

        <header className={styles.cabecera}>
          <div className={styles.textoCabecera}>
            <p className={styles.transaccion}>
              <span className={styles.chipExito}>TRANSACCIÓN EXITOSA</span>
              <span className={styles.referencia}>#RC-2026-90412</span>
            </p>
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
                  RECARGA EXITOSA <span className={styles.punto} aria-hidden="true" />
                </h2>
                <p className={styles.detalleExito}>
                  Se ha acreditado el monto correctamente a tu billetera y el movimiento ha sido registrado en el sistema.
                </p>
              </div>
              <span className={styles.referenciaChip}>{RECARGA.referencia}</span>
            </section>

            <section className={`tarjeta ${styles.tarjetaAviso}`} aria-label="Cobro pendiente">
              <span className={styles.iconoAviso}>
                <IconoInfo />
              </span>
              <p className={styles.textoAviso}>
                Tiene un cobro pendiente de{' '}
                <strong className={styles.montoPendiente}>{formatearPesos(COBRO_PENDIENTE)} COP</strong>. La recarga
                no debita cobros pendientes de forma automática; puede pagarlo desde <strong>MI BILLETERA</strong>{' '}
                con el botón <strong className={styles.botonReferido}>Pagar Cobro Pendiente</strong>.
              </p>
              <p className={styles.nota}>
                <span className={styles.chipNota}>NOTA</span>
                <span>La recarga no pasa el cobro de forma automática.</span>
              </p>
            </section>

            <section className={`tarjeta ${styles.tarjetaAcciones}`} aria-labelledby="acciones-titulo">
              <h2 id="acciones-titulo" className={styles.tituloSeccion}>Acciones rápidas</h2>
              <div className={styles.botones}>
                <button type="button" className={`boton ${styles.principal}`}>
                  <IconoBilletera /> Ir a mi billetera
                </button>
                <button type="button" className={`boton ${styles.secundario}`}>
                  <IconoTarjeta /> Adquirir un plan
                </button>
              </div>
              <button type="button" className={`enlace ${styles.descarga}`}>
                <IconoDescarga /> Descargar comprobante en PDF
              </button>
            </section>
          </div>

          <section className={`tarjeta ${styles.detalle}`} aria-labelledby="detalle-titulo">
            <header className={styles.cabeceraDetalle}>
              <h2 id="detalle-titulo" className={styles.tituloDetalle}>Detalle del movimiento</h2>
              <span className={styles.chipComprobante}>COMPROBANTE REGISTRADO</span>
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
              <span className={styles.nuevoSaldoValor}>{formatearPesos(RECARGA.nuevoSaldo)} COP</span>
            </div>

            <div className={styles.filas}>
              {detalles.map((fila) => (
                <div key={fila.etiqueta} className={styles.fila}>
                  <span>{fila.etiqueta}</span>
                  <span className={styles.valor}>{fila.valor}</span>
                </div>
              ))}
              <div className={styles.fila}>
                <span>Estado</span>
                <span className={styles.estado}>
                  <span className="punto-vivo" aria-hidden="true" /> {RECARGA.estado}
                </span>
              </div>
            </div>

            <footer className={styles.pie}>
              <span className={styles.pieNfc}>
                <IconoNfc /> NFC sincronizado: Tarjeta activa para desanclaje
              </span>
              <span className={styles.pieRed}>RED MUNICIPAL TUNJA</span>
            </footer>
          </section>
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default RecargarSaldoPaso2Page;
