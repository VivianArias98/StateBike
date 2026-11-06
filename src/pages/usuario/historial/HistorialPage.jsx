import { useState } from 'react';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import { IconoBicicleta, IconoCalendario, IconoDescarga, IconoReloj } from '../../../components/Iconos/Iconos.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import SelectorHistorial from '../components/SelectorHistorial.jsx';
import FiltroFechas from '../components/FiltroFechas.jsx';
import MetricaUsuario from '../components/MetricaUsuario.jsx';
import TablaViajes from './components/TablaViajes.jsx';
import styles from './HistorialPage.module.css';

// Datos de ejemplo (solo maquetación). Después llegarán del backend.
const VIAJES_MOCK = [
  {
    id: 1,
    fechaHora: '14 oct 2026, 18:42',
    origen: 'Estación Parque Central',
    destino: 'Estación Terminal',
    duracion: 52,
    fecha: '2026-10-14',
  },
  {
    id: 2,
    fechaHora: '12 oct 2026, 08:15',
    origen: 'Estación Universidad',
    destino: 'Estación Parque Central',
    duracion: 28,
    fecha: '2026-10-12',
  },
  {
    id: 3,
    fechaHora: '09 oct 2026, 17:30',
    origen: 'Estación Terminal',
    destino: 'Estación Universidad',
    duracion: 61,
    fecha: '2026-10-09',
  },
  {
    id: 4,
    fechaHora: '05 oct 2026, 12:10',
    origen: 'Estación Parque Central',
    destino: 'Estación Mercado',
    duracion: 33,
    fecha: '2026-10-05',
  },
];

// Convierte minutos totales al formato "Xh Ym" solo si hay horas; si no, "Ym"
function formatearTiempoTotal(minutos) {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return horas > 0 ? `${horas}h ${mins}m` : `${mins}m`;
}

// Formatea una fecha "YYYY-MM-DD" al formato legible "01 Oct 2026"
function formatearFechaCorta(fechaIso) {
  if (!fechaIso) return '';
  const [anio, mes, dia] = fechaIso.split('-');
  const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${dia} ${MESES[parseInt(mes, 10) - 1]} ${anio}`;
}

function HistorialPage() {
  const [desde, setDesde] = useState('2026-10-01');
  const [hasta, setHasta] = useState('2026-10-15');
  // viajesFiltrados: resultado de la última consulta
  const [viajesFiltrados, setViajesFiltrados] = useState(VIAJES_MOCK);
  const [periodoMostrado, setPeriodoMostrado] = useState({ desde: '2026-10-01', hasta: '2026-10-15' });

  const handleConsultar = () => {
    const filtrados = VIAJES_MOCK.filter((v) => {
      return (!desde || v.fecha >= desde) && (!hasta || v.fecha <= hasta);
    });
    setViajesFiltrados(filtrados);
    setPeriodoMostrado({ desde, hasta });
  };

  const handleLimpiar = () => {
    setDesde('');
    setHasta('');
    setViajesFiltrados(VIAJES_MOCK);
    setPeriodoMostrado({ desde: '', hasta: '' });
  };

  // Métricas derivadas del conjunto filtrado
  const totalRecorridos = viajesFiltrados.length;
  const tiempoTotal = viajesFiltrados.reduce((suma, v) => suma + v.duracion, 0);
  const periodoTexto =
    periodoMostrado.desde && periodoMostrado.hasta
      ? `${formatearFechaCorta(periodoMostrado.desde)} – ${formatearFechaCorta(periodoMostrado.hasta)}`
      : 'Sin rango de fechas';

  return (
    <UsuarioLayout itemActivo="Historial">
      <div className={styles.raiz}>
        <EncabezadoPagina
          etiqueta="Módulo de usuario / Movilidad"
          titulo="Historial de Viajes"
          subtitulo="Consulta de recorridos realizados, tiempos acumulados y detalle de estaciones en Tunja Bici."
          acciones={
            /* Cuando exista React Router, este cambio navega a /usuario/historial-pagos */
            <SelectorHistorial activo="viajes" onCambiar={() => {}} />
          }
        />

        <FiltroFechas
          idPrefijo="viajes"
          desde={desde}
          hasta={hasta}
          onDesde={setDesde}
          onHasta={setHasta}
          onConsultar={handleConsultar}
          onLimpiar={handleLimpiar}
        />

        <div className={styles.metricas}>
          <MetricaUsuario
            etiqueta="Total recorridos"
            valor={totalRecorridos}
            detalle="viajes registrados"
            icono={<IconoBicicleta />}
          />
          <MetricaUsuario
            etiqueta="Tiempo total acumulado"
            valor={`${tiempoTotal} min`}
            detalle={formatearTiempoTotal(tiempoTotal)}
            icono={<IconoReloj />}
          />
          <MetricaUsuario
            etiqueta="Periodo consultado"
            valor={periodoTexto}
            detalle="Rango de fechas activo"
            icono={<IconoCalendario />}
          />
        </div>

        <TablaViajes viajes={viajesFiltrados} />

        {/* Pendiente: descarga de reportes (PDF y CSV) desde el backend */}
        <div className={styles.descargas}>
          <button type="button" className="boton">
            <IconoDescarga /> Descargar reporte PDF
          </button>
          <button type="button" className="boton">
            Descargar CSV
          </button>
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default HistorialPage;
