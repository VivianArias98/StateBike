import { useState } from 'react';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import {
  IconoBilletera,
  IconoCalendario,
  IconoDescarga,
  IconoDocumento,
  IconoReloj,
} from '../../../components/Iconos/Iconos.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import SelectorHistorial from '../components/SelectorHistorial.jsx';
import MetricaUsuario from '../components/MetricaUsuario.jsx';
import FiltroFechas from './components/FiltroFechas.jsx';
import TablaViajes from './components/TablaViajes.jsx';
import MetricasViajes from './components/MetricasViajes.jsx';
import FiltroActivo from './components/FiltroActivo.jsx';
import TablaPagos from './components/TablaPagos.jsx';
import { useUsuario } from '../context/UsuarioContext.jsx';
import { formatearPesos } from '../formato.js';
import { formatearFechaBogota, extraerFechaBogota } from '../../../utils/formatoMoneda.js';
import { descargarCSV, generarComprobantePDF } from '../../../utils/descargas.js';
import styles from './HistorialPage.module.css';

function formatearTiempoTotal(minutos) {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return horas > 0 ? `${horas}h ${mins}m` : `${mins}m`;
}

function formatearFechaCorta(fechaIso) {
  if (!fechaIso) return '';
  const [anio, mes, dia] = fechaIso.split('-');
  const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${dia} ${MESES[parseInt(mes, 10) - 1] || ''} ${anio}`;
}

function HistorialPage() {
  const { historialViajes, billetera, perfil } = useUsuario();
  const [tabActivo, setTabActivo] = useState('viajes'); // 'viajes' | 'pagos'
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [periodoMostrado, setPeriodoMostrado] = useState({ desde: '', hasta: '' });
  const [avisoDescarga, setAvisoDescarga] = useState('');
  const [errorFiltro, setErrorFiltro] = useState('');

  // 1. Datos formateados de Viajes
  const listaViajes = historialViajes.map((v) => ({
    id: v.id,
    fechaHora: formatearFechaBogota(v.fechaInicio),
    fecha: extraerFechaBogota(v.fechaInicio),
    origen: v.origen,
    destino: v.destino,
    duracion: v.duracion ?? v.duracionMin ?? 0,
    minutosExceso: v.minutosExceso ?? 0,
    costoExceso: v.costoExceso ?? 0,
  }));

  // 2. Datos formateados de Pagos
  const movimientosPagos = billetera.movimientos?.length ? billetera.movimientos : [];
  const listaPagos = movimientosPagos.map((m) => {
    let tipoFormateado = 'Recarga de saldo';
    const tipoUpper = String(m.tipo || '').toUpperCase();
    const conceptoLower = String(m.concepto || '').toLowerCase();

    if (
      tipoUpper === 'COMPRA_PLAN' ||
      tipoUpper === 'PLAN' ||
      conceptoLower.includes('plan') ||
      conceptoLower.includes('adquisición') ||
      conceptoLower.includes('adquisicion')
    ) {
      tipoFormateado = 'Compra de plan';
    } else if (
      tipoUpper === 'COBRO_EXCESO' ||
      tipoUpper === 'EXCESO' ||
      conceptoLower.includes('exceso')
    ) {
      tipoFormateado = 'Cobro por exceso';
    } else if (
      tipoUpper === 'RECARGA' ||
      tipoUpper === 'TOPUP' ||
      conceptoLower.includes('recarga')
    ) {
      tipoFormateado = 'Recarga de saldo';
    } else if (tipoUpper === 'COBRO' || tipoUpper === 'CHARGE') {
      tipoFormateado = 'Cobro de servicio';
    }

    return {
      id: m.id,
      fechaHora: formatearFechaBogota(m.fecha),
      fecha: extraerFechaBogota(m.fecha),
      concepto: m.concepto,
      tipo: tipoFormateado,
      monto: m.monto,
      estado: m.estado === 'PAGADO' ? 'Pagado' : 'Pendiente',
    };
  });

  // Filtrado de Viajes
  const viajesFiltrados = listaViajes.filter((v) => {
    if (periodoMostrado.desde && v.fecha < periodoMostrado.desde) return false;
    if (periodoMostrado.hasta && v.fecha > periodoMostrado.hasta) return false;
    return true;
  });

  // Filtrado de Pagos
  const pagosFiltrados = listaPagos.filter((p) => {
    if (periodoMostrado.desde && p.fecha < periodoMostrado.desde) return false;
    if (periodoMostrado.hasta && p.fecha > periodoMostrado.hasta) return false;
    return true;
  });

  const handleConsultar = () => {
    setErrorFiltro('');
    if (desde && hasta && desde > hasta) {
      setErrorFiltro('La fecha final (Hasta) no puede ser anterior a la fecha inicial (Desde).');
      return;
    }
    setPeriodoMostrado({ desde, hasta });
  };

  const handleLimpiar = () => {
    setDesde('');
    setHasta('');
    setPeriodoMostrado({ desde: '', hasta: '' });
    setErrorFiltro('');
  };

  // Métricas
  const totalRecorridos = viajesFiltrados.length;
  const tiempoTotal = viajesFiltrados.reduce((suma, v) => suma + v.duracion, 0);
  const totalPagado = pagosFiltrados
    .filter((p) => p.estado === 'Pagado')
    .reduce((suma, p) => suma + p.monto, 0);

  const periodoTexto =
    periodoMostrado.desde && periodoMostrado.hasta
      ? periodoMostrado.desde === periodoMostrado.hasta
        ? `${formatearFechaCorta(periodoMostrado.desde)}`
        : `${formatearFechaCorta(periodoMostrado.desde)} – ${formatearFechaCorta(periodoMostrado.hasta)}`
      : periodoMostrado.desde
      ? `Desde ${formatearFechaCorta(periodoMostrado.desde)}`
      : periodoMostrado.hasta
      ? `Hasta ${formatearFechaCorta(periodoMostrado.hasta)}`
      : 'Todos los registros históricos';

  const handleDescargarPagosCSV = () => {
    const encabezados = ['ID', 'Fecha y hora', 'Concepto / Detalle', 'Tipo de pago', 'Monto (COP)', 'Estado'];
    const filas = pagosFiltrados.map((p) => [
      `#${p.id}`,
      p.fechaHora,
      p.concepto,
      p.tipo,
      p.monto,
      p.estado,
    ]);
    const fechaHoy = new Date().toISOString().slice(0, 10);
    descargarCSV(`comprobante_pagos_stationbike_${fechaHoy}.csv`, encabezados, filas);
    setAvisoDescarga('Descarga de comprobante en formato CSV completada con éxito.');
    setTimeout(() => setAvisoDescarga(''), 3500);
  };

  const handleDescargarPagosPDF = () => {
    generarComprobantePDF({
      titulo: 'Comprobante Oficial de Historial de Pagos y Billetera',
      usuario: perfil,
      periodo: periodoTexto,
      metricas: [
        { etiqueta: 'Total transacciones', valor: pagosFiltrados.length },
        { etiqueta: 'Total debitado / pagado', valor: `${formatearPesos(totalPagado)} COP` },
        { etiqueta: 'Saldo actual billetera', valor: `${formatearPesos(billetera.saldo)} COP` },
      ],
      columnas: ['ID Transacción', 'Fecha y hora', 'Concepto / Detalle', 'Tipo de movimiento', 'Monto (COP)', 'Estado'],
      filas: pagosFiltrados.map((p) => [
        `#${p.id}`,
        p.fechaHora,
        p.concepto,
        p.tipo,
        `${formatearPesos(p.monto)} COP`,
        p.estado,
      ]),
    });
    setAvisoDescarga('Generando comprobante oficial para impresión o guardado como PDF...');
    setTimeout(() => setAvisoDescarga(''), 3500);
  };

  const handleDescargarViajesCSV = () => {
    const encabezados = ['ID Viaje', 'Fecha y hora', 'Origen', 'Destino', 'Duración (min)', 'Minutos exceso', 'Costo exceso (COP)'];
    const filas = viajesFiltrados.map((v) => [
      `#${v.id}`,
      v.fechaHora,
      v.origen,
      v.destino,
      v.duracion,
      v.minutosExceso || 0,
      v.costoExceso || 0,
    ]);
    const fechaHoy = new Date().toISOString().slice(0, 10);
    descargarCSV(`reporte_viajes_stationbike_${fechaHoy}.csv`, encabezados, filas);
    setAvisoDescarga('Descarga de reporte de viajes en formato CSV completada con éxito.');
    setTimeout(() => setAvisoDescarga(''), 3500);
  };

  const handleDescargarViajesPDF = () => {
    generarComprobantePDF({
      titulo: 'Reporte Oficial de Historial de Viajes',
      usuario: perfil,
      periodo: periodoTexto,
      metricas: [
        { etiqueta: 'Total recorridos', valor: totalRecorridos },
        { etiqueta: 'Tiempo acumulado', valor: formatearTiempoTotal(tiempoTotal) },
      ],
      columnas: ['ID Viaje', 'Fecha y hora', 'Estación Origen', 'Estación Destino', 'Duración', 'Minutos Exceso', 'Costo Exceso'],
      filas: viajesFiltrados.map((v) => [
        `#${v.id}`,
        v.fechaHora,
        v.origen,
        v.destino,
        `${v.duracion} min`,
        `${v.minutosExceso || 0} min`,
        `${formatearPesos(v.costoExceso || 0)} COP`,
      ]),
    });
    setAvisoDescarga('Generando reporte oficial de viajes para impresión o guardado como PDF...');
    setTimeout(() => setAvisoDescarga(''), 3500);
  };

  return (
    <UsuarioLayout itemActivo="Historial">
      <div className={styles.raiz}>
        <EncabezadoPagina
          etiqueta="Módulo de usuario / Movilidad y finanzas"
          titulo={tabActivo === 'viajes' ? 'Historial de Viajes' : 'Historial de Pagos y Billetera'}
          subtitulo={
            tabActivo === 'viajes'
              ? 'Consulta de recorridos realizados, tiempos acumulados y detalle de estaciones en Tunja Bici.'
              : 'Registro detallado de recargas de saldo, planes adquiridos y cobros por exceso.'
          }
          acciones={
            <SelectorHistorial
              activo={tabActivo}
              onCambiar={(nuevoTab) => setTabActivo(nuevoTab)}
            />
          }
        />

        {errorFiltro && (
          <div className="alerta alerta--error" role="alert" style={{ marginBottom: 'var(--espacio-3)' }}>
            ⚠️ {errorFiltro}
          </div>
        )}

        {avisoDescarga && (
          <div className="alerta alerta--exito" role="status" style={{ marginBottom: 'var(--espacio-3)' }}>
            ✓ {avisoDescarga}
          </div>
        )}

        <FiltroFechas
          idPrefijo={tabActivo}
          desde={desde}
          hasta={hasta}
          onDesde={setDesde}
          onHasta={setHasta}
          onConsultar={handleConsultar}
          onLimpiar={handleLimpiar}
        />

        {tabActivo === 'viajes' ? (
          <>
            <MetricasViajes
              total={totalRecorridos}
              minutos={tiempoTotal}
              horas={formatearTiempoTotal(tiempoTotal)}
              periodo={periodoTexto}
            />

            <section className={`tarjeta ${styles.tablaTarjeta}`}>
              <TablaViajes
                viajes={viajesFiltrados}
                hayFiltro={Boolean(periodoMostrado.desde || periodoMostrado.hasta)}
              />

              <div className={styles.pie}>
                <p className={styles.resumen}>
                  Mostrando <strong>{viajesFiltrados.length}</strong> recorridos en el rango seleccionado
                </p>
                <div className={styles.descargas}>
                  <button type="button" className="boton" onClick={handleDescargarViajesPDF}>
                    <IconoDocumento /> Descargar reporte PDF
                  </button>
                  <button type="button" className="boton" onClick={handleDescargarViajesCSV}>
                    <IconoDescarga /> Descargar CSV
                  </button>
                </div>
              </div>
            </section>

            <FiltroActivo
              texto={periodoTexto}
              estado={`ESTADO: ${viajesFiltrados.length} ${viajesFiltrados.length === 1 ? 'VIAJE ENCONTRADO' : 'VIAJES ENCONTRADOS'}`}
            />
          </>
        ) : (
          <>
            <div className={styles.metricas} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--espacio-3)', marginBottom: 'var(--espacio-4)' }}>
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
                valor={formatearPesos(billetera.saldo)}
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

            <section className={`tarjeta ${styles.tablaTarjeta}`}>
              <TablaPagos
                pagos={pagosFiltrados}
                hayFiltro={Boolean(periodoMostrado.desde || periodoMostrado.hasta)}
              />

              <div className={styles.pie}>
                <p className={styles.resumen}>
                  Mostrando <strong>{pagosFiltrados.length}</strong> movimientos en el rango seleccionado
                </p>
                <div className={styles.descargas}>
                  <button type="button" className="boton" onClick={handleDescargarPagosPDF}>
                    <IconoDocumento /> Descargar comprobante PDF
                  </button>
                  <button type="button" className="boton" onClick={handleDescargarPagosCSV}>
                    <IconoDescarga /> Descargar CSV
                  </button>
                </div>
              </div>
            </section>

            <FiltroActivo
              texto={periodoTexto}
              estado={`ESTADO: ${pagosFiltrados.length} ${pagosFiltrados.length === 1 ? 'PAGO ENCONTRADO' : 'PAGOS ENCONTRADOS'}`}
            />
          </>
        )}
      </div>
    </UsuarioLayout>
  );
}

export default HistorialPage;
