import React, { useState } from 'react';
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
import { formatearFechaBogota } from '../../../utils/formatoMoneda.js';
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
  const { historialViajes, billetera } = useUsuario();
  const [tabActivo, setTabActivo] = useState('viajes'); // 'viajes' | 'pagos'
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [periodoMostrado, setPeriodoMostrado] = useState({ desde: '', hasta: '' });
  const [avisoDescarga, setAvisoDescarga] = useState('');

  // 1. Datos formateados de Viajes
  const listaViajes = historialViajes.map((v) => ({
    id: v.id,
    fechaHora: formatearFechaBogota(v.fechaInicio),
    fecha: v.fechaInicio ? v.fechaInicio.slice(0, 10) : '',
    origen: v.origen,
    destino: v.destino,
    duracion: v.duracionMin,
    minutosExceso: v.minutosExceso,
    costoExceso: v.costoExceso,
  }));

  // 2. Datos formateados de Pagos
  const listaPagos = (billetera.movimientos || []).map((m) => ({
    id: m.id,
    fechaHora: formatearFechaBogota(m.fecha),
    fecha: m.fecha ? m.fecha.slice(0, 10) : '',
    concepto: m.concepto,
    tipo:
      m.tipo === 'COBRO_EXCESO'
        ? 'Cobro por exceso'
        : m.tipo === 'COMPRA_PLAN'
        ? 'Compra de plan'
        : 'Recarga de saldo',
    monto: m.monto,
    estado: m.estado === 'PAGADO' ? 'Pagado' : 'Pendiente',
  }));

  // Filtrado
  const viajesFiltrados = listaViajes.filter(
    (v) => (!periodoMostrado.desde || v.fecha >= periodoMostrado.desde) && (!periodoMostrado.hasta || v.fecha <= periodoMostrado.hasta)
  );

  const pagosFiltrados = listaPagos.filter(
    (p) => (!periodoMostrado.desde || p.fecha >= periodoMostrado.desde) && (!periodoMostrado.hasta || p.fecha <= periodoMostrado.hasta)
  );

  const handleConsultar = () => {
    setPeriodoMostrado({ desde, hasta });
  };

  const handleLimpiar = () => {
    setDesde('');
    setHasta('');
    setPeriodoMostrado({ desde: '', hasta: '' });
  };

  // Métricas
  const totalRecorridos = viajesFiltrados.length;
  const tiempoTotal = viajesFiltrados.reduce((suma, v) => suma + v.duracion, 0);
  const totalPagado = pagosFiltrados
    .filter((p) => p.estado === 'Pagado')
    .reduce((suma, p) => suma + p.monto, 0);

  const periodoTexto =
    periodoMostrado.desde && periodoMostrado.hasta
      ? `${formatearFechaCorta(periodoMostrado.desde)} – ${formatearFechaCorta(periodoMostrado.hasta)}`
      : 'Todos los registros históricos';

  const simularDescarga = (formato) => {
    setAvisoDescarga(`Generando reporte en formato ${formato.toUpperCase()}... Archivo listo para descarga.`);
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
              onCambiar={(nuevoTab) => {
                setTabActivo(nuevoTab);
                handleLimpiar();
              }}
            />
          }
        />

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
              <TablaViajes viajes={viajesFiltrados} />

              <div className={styles.pie}>
                <p className={styles.resumen}>
                  Mostrando <strong>{viajesFiltrados.length}</strong> recorridos en el rango seleccionado
                </p>
                <div className={styles.descargas}>
                  <button type="button" className="boton" onClick={() => simularDescarga('PDF')}>
                    <IconoDocumento /> Descargar reporte PDF
                  </button>
                  <button type="button" className="boton" onClick={() => simularDescarga('CSV')}>
                    <IconoDescarga /> Descargar CSV
                  </button>
                </div>
              </div>
            </section>

            <FiltroActivo
              texto="Si ningún viaje coincide, el sistema informará: «No hay registros para el rango seleccionado»."
              estado={`ESTADO: ${viajesFiltrados.length} VIAJES ENCONTRADOS`}
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
              <TablaPagos pagos={pagosFiltrados} />

              <div className={styles.pie}>
                <p className={styles.resumen}>
                  Mostrando <strong>{pagosFiltrados.length}</strong> movimientos en el rango seleccionado
                </p>
                <div className={styles.descargas}>
                  <button type="button" className="boton" onClick={() => simularDescarga('PDF')}>
                    <IconoDocumento /> Descargar comprobante PDF
                  </button>
                  <button type="button" className="boton" onClick={() => simularDescarga('CSV')}>
                    <IconoDescarga /> Descargar CSV
                  </button>
                </div>
              </div>
            </section>

            <FiltroActivo
              texto="Si ningún pago coincide, el sistema informará: «No hay registros para el rango seleccionado»."
              estado={`ESTADO: ${pagosFiltrados.length} PAGOS ENCONTRADOS`}
            />
          </>
        )}
      </div>
    </UsuarioLayout>
  );
}

export default HistorialPage;
