import { useState } from 'react';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import { IconoBilletera, IconoCalendario, IconoDescarga, IconoDocumento, IconoReloj } from '../../../components/Iconos/Iconos.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import SelectorHistorial from '../components/SelectorHistorial.jsx';
import FiltroFechas from './components/FiltroFechas.jsx';
import MetricaUsuario from '../components/MetricaUsuario.jsx';
import { formatearFechaCorta, formatearPesos } from '../formato.js';
import TablaPagos from './components/TablaPagos.jsx';
import FiltroActivo from './components/FiltroActivo.jsx';
import styles from './HistorialPagosPage.module.css';

// Datos de ejemplo (solo maquetación). Después llegarán del backend.
const PAGOS = [
  {
    id: 1,
    fechaHora: '15 oct 2026, 08:20',
    fecha: '2026-10-15',
    concepto: 'Cobro por exceso de tiempo (18 min viaje BIC-014)',
    tipo: 'Cobro por exceso',
    monto: 1800,
    estado: 'Pendiente',
  },
  {
    id: 2,
    fechaHora: '14 oct 2026, 18:43',
    fecha: '2026-10-14',
    concepto: 'Cobro por exceso de tiempo (12 min viaje BIC-002)',
    tipo: 'Cobro por exceso',
    monto: 1200,
    estado: 'Pagado',
  },
  {
    id: 3,
    fechaHora: '01 oct 2026, 10:15',
    fecha: '2026-10-01',
    concepto: 'Adquisición Plan Mensual Estudiantil / Ciudadano',
    tipo: 'Compra de plan',
    monto: 32000,
    estado: 'Pagado',
  },
  {
    id: 4,
    fechaHora: '01 oct 2026, 09:40',
    fecha: '2026-10-01',
    concepto: 'Recarga de saldo en billetera digital (PSE)',
    tipo: 'Recarga de saldo',
    monto: 50000,
    estado: 'Pagado',
  },
];

// Saldo de la billetera (dato de ejemplo; después vendrá del backend)
const SALDO_ACTUAL = 16000;

// Historial de movimientos de la billetera: recargas, planes y cobros adicionales
function HistorialPagosPage() {
  const [desde, setDesde] = useState('2026-10-01');
  const [hasta, setHasta] = useState('2026-10-15');
  const [pagosFiltrados, setPagosFiltrados] = useState(PAGOS);
  const [periodoMostrado, setPeriodoMostrado] = useState({ desde: '2026-10-01', hasta: '2026-10-15' });

  const handleConsultar = () => {
    const filtrados = PAGOS.filter((pago) => (!desde || pago.fecha >= desde) && (!hasta || pago.fecha <= hasta));
    setPagosFiltrados(filtrados);
    setPeriodoMostrado({ desde, hasta });
  };

  const handleLimpiar = () => {
    setDesde('');
    setHasta('');
    setPagosFiltrados(PAGOS);
    setPeriodoMostrado({ desde: '', hasta: '' });
  };

  const totalPagado = pagosFiltrados
    .filter((pago) => pago.estado === 'Pagado')
    .reduce((suma, pago) => suma + pago.monto, 0);

  const periodoTexto =
    periodoMostrado.desde && periodoMostrado.hasta
      ? `${formatearFechaCorta(periodoMostrado.desde)} – ${formatearFechaCorta(periodoMostrado.hasta)}`
      : 'Sin rango de fechas';

  return (
    <UsuarioLayout itemActivo="Historial">
      <div className={styles.raiz}>
        <EncabezadoPagina
          etiqueta="Operación Tunja Bici / Registro financiero"
          titulo="Historial de Pagos"
          subtitulo="Registro detallado de recargas de saldo, planes y cobros adicionales de la cuenta"
          acciones={
            /* Cuando exista React Router, este cambio navega a /usuario/historial */
            <SelectorHistorial activo="pagos" onCambiar={() => {}} />
          }
        />

        <FiltroFechas
          idPrefijo="pagos"
          desde={desde}
          hasta={hasta}
          onDesde={setDesde}
          onHasta={setHasta}
          onConsultar={handleConsultar}
          onLimpiar={handleLimpiar}
        />

        <div className={styles.metricas}>
          <MetricaUsuario
            etiqueta="Total transacciones"
            valor={pagosFiltrados.length}
            detalle="Movimientos registrados"
            icono={<IconoReloj />}
          />
          <MetricaUsuario
            etiqueta="Total debitado / pagado"
            valor={formatearPesos(totalPagado)}
            detalle="Planes y excedentes"
            icono={<IconoBilletera />}
          />
          <MetricaUsuario
            etiqueta="Saldo actual en billetera"
            valor={formatearPesos(SALDO_ACTUAL)}
            detalle="Disponible para uso"
            icono={<IconoBilletera />}
          />
          <MetricaUsuario
            etiqueta="Periodo consultado"
            valor={periodoTexto}
            detalle="Rango de fechas activo"
            icono={<IconoCalendario />}
          />
        </div>

        <div className={styles.grupoTabla}>
        <section className={`tarjeta ${styles.tablaTarjeta}`}>
          <TablaPagos pagos={pagosFiltrados} />

          <div className={styles.pie}>
            <p className={styles.resumen}>
              Mostrando <strong>{pagosFiltrados.length}</strong> registros en el rango seleccionado
            </p>
            {/* Pendiente: descarga de comprobantes desde el backend */}
            <div className={styles.descargas}>
              <button type="button" className="boton">
                <IconoDocumento /> Descargar comprobante PDF
              </button>
              <button type="button" className="boton">
                <IconoDescarga /> Descargar CSV
              </button>
            </div>
          </div>
        </section>

        <FiltroActivo
          texto="Si ningún pago coincide, el sistema informará: «No hay registros para el rango seleccionado»."
          estado={`ESTADO: ${pagosFiltrados.length} ENCONTRADOS`}
        />
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default HistorialPagosPage;
