import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import { IconoBilletera, IconoBicicleta, IconoAlerta, IconoRecibo, IconoNfc, IconoUbicacion, IconoFlecha } from '../../../components/Iconos/Iconos.jsx';
import styles from './MiBilleteraPage.module.css';

const SALDO = 15000;
const COBRO_PENDIENTE = 2500;

const MOVIMIENTOS = [
  { tipo: 'RECARGA', concepto: 'Recarga de saldo vía PSE', detalle: 'REF: #TRX-994021 · Aprobado', fecha: '02 Nov 2026, 10:15 AM', monto: '+$20.000 COP', saldo: '$17.500 COP', signo: '+' },
  { tipo: 'COBRO', concepto: 'Cobro por exceso de tiempo (25 min - Viaje #VIA-0892)', detalle: 'Deducción de minutos adicionales de estación', fecha: '01 Nov 2026, 06:45 PM', monto: '-$2.500 COP', saldo: '$15.000 COP', signo: '-' },
  { tipo: 'COBRO', concepto: 'Adquisición de Plan Mensual', detalle: 'Suscripción Regular 30 Días #PLN-441', fecha: '27 Oct 2026, 09:30 AM', monto: '-$32.000 COP', saldo: '$17.500 COP', signo: '-' },
  { tipo: 'RECARGA', concepto: 'Recarga de saldo vía Tarjeta Débito', detalle: 'REF: #TRX-910283 · Terminación 1884', fecha: '27 Oct 2026, 09:10 AM', monto: '+$50.000 COP', saldo: '$49.500 COP', signo: '+' },
];

const RESUMEN_TARJETAS = [
  { etiqueta: 'PLAN VIGENTE', valor: 'Regular 30 Días Activo', detalle: '24 días restantes', icono: <IconoBicicleta /> },
  { etiqueta: 'ÚLTIMA ESTACIÓN', valor: 'Terminal de Pasajeros', detalle: 'Dock #04 · Anclada', icono: <IconoUbicacion /> },
  { etiqueta: 'HARDWARE PASS', valor: 'Tarjeta NFC #4821', detalle: '✓ Desbloqueo Inmediato', icono: <IconoNfc /> },
];

function MiBilleteraPage() {
  return (
    <UsuarioLayout itemActivo="Mi billetera">
      <div className={styles.raiz}>
        <header className={styles.cabecera}>
          <div className={styles.textoCabecera}>
            <p className={styles.modulo}>
              MÓDULO FINANCIERO <span className={styles.cuenta}>/ Cuenta #USR-8821</span>
            </p>
            <h1 className={styles.titulo}>Mi Billetera</h1>
            <p className={styles.subtitulo}>Consulta tu saldo disponible, cobros pendientes y registro de movimientos de tu cuenta.</p>
          </div>
          <div className={styles.estadoHabilitado}>
            <span className={styles.iconoEstado}><IconoBilletera /></span>
            <div>
              <p className={styles.estadoTitulo}>Estado: Habilitado</p>
              <p className={styles.estadoTexto}>Telemetría NFC en sincronía</p>
            </div>
          </div>
        </header>

        <div className={styles.principales}>
          <section className={styles.tarjetaSaldo} aria-label="Saldo disponible">
            <div className={styles.filaSuperior}>
              <p className={styles.etiqueta}>SALDO DISPONIBLE</p>
              <span className={styles.chip}>REGISTRO #COP-01</span>
            </div>
            <p className={styles.monto}>$15.000 <span className={styles.moneda}>COP</span></p>
            <p className={styles.descripcion}>Saldo utilizado para la adquisición de planes y deducción de minutos de exceso.</p>
            <button type="button" className={`boton boton--bloque ${styles.botonOscuro}`}>
              + Recargar saldo
            </button>
          </section>

          <section className={styles.tarjetaCobro} aria-label="Cobro pendiente">
            <div className={styles.filaSuperior}>
              <p className={styles.etiquetaAlerta}>ALERTA · COBRO PENDIENTE</p>
              <span className={styles.chipOscuro}>ACCIÓN REQUERIDA</span>
            </div>
            <p className={styles.montoAlerta}>${COBRO_PENDIENTE.toLocaleString('es-CO')} <span className={styles.moneda}>COP</span></p>
            <div className={styles.concepto}>
              <p className={styles.etiqueta}>CONCEPTO ASOCIADO:</p>
              <p className={styles.textoConcepto}>Viaje #VIA-0892 · 25 minutos de exceso en Estación Terminal</p>
            </div>
            <button type="button" className={`boton boton--bloque ${styles.botonAlerta}`}>
              <IconoAlerta /> Pagar cobro pendiente
            </button>
          </section>
        </div>

        <div className={styles.pequenas}>
          {RESUMEN_TARJETAS.map((tarjeta) => (
            <article key={tarjeta.etiqueta} className={styles.pequena}>
              <span className={styles.iconoPequeno}>{tarjeta.icono}</span>
              <div>
                <p className={styles.etiqueta}>{tarjeta.etiqueta}</p>
                <p className={styles.valorPequeno}>{tarjeta.valor}</p>
                <p className={styles.detalle}>{tarjeta.detalle}</p>
              </div>
            </article>
          ))}
        </div>

        <section className={styles.movimientos} aria-label="Historial de movimientos">
          <div className={styles.cabeceraMovimientos}>
            <div>
              <h2 className={styles.tituloMovimientos}>Historial de Movimientos</h2>
              <p className={styles.subtituloMovimientos}>Mostrando movimientos del más reciente al más antiguo</p>
            </div>
            <span className={styles.chip}>CRITERIO_02 // ORDEN_DESCENDENTE</span>
          </div>

          <div className={`tabla ${styles.tablaWrap}`}>
            <table>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Concepto</th>
                  <th>Fecha y hora</th>
                  <th className={styles.derecha}>Monto</th>
                  <th className={styles.derecha}>Saldo resultante</th>
                </tr>
              </thead>
              <tbody>
                {MOVIMIENTOS.map((mov) => (
                  <tr key={mov.concepto + mov.fecha}>
                    <td>
                      <span className={mov.signo === '+' ? styles.tipoRecarga : styles.tipoCobro}>
                        {mov.signo === '+' ? '+ RECARGA' : '- COBRO'}
                      </span>
                    </td>
                    <td>
                      <p className={styles.conceptoTabla}>{mov.concepto}</p>
                      <p className={styles.detalle}>{mov.detalle}</p>
                    </td>
                    <td>{mov.fecha}</td>
                    <td className={`${styles.derecha} ${mov.signo === '+' ? styles.montoPositivo : styles.montoNegativo}`}>{mov.monto}</td>
                    <td className={styles.derecha}>{mov.saldo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.verMas}>
            <button type="button" className={`boton ${styles.botonVerde}`}>Ver más movimientos</button>
          </div>
        </section>
      </div>
    </UsuarioLayout>
  );
}

export default MiBilleteraPage;
