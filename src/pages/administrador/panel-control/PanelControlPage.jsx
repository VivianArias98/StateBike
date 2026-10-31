import { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout/AdminLayout.jsx';
import Etiqueta from '../../../components/Etiqueta/Etiqueta.jsx';
import PanelEncabezado from './components/PanelEncabezado.jsx';
import TarjetaIndicador from './components/TarjetaIndicador.jsx';
import OcupacionAnclajes from './components/OcupacionAnclajes.jsx';
import IncidenciasRecientes from './components/IncidenciasRecientes.jsx';
import styles from './PanelControlPage.module.css';

//MOCK
const INDICADORES = {
  estacionesActivas: 12,
  estacionesInactivas: 3,
  bicicletasDisponibles: 48,
  porcentajeFlota: 80,
  viajesEnCurso: 7,
  incidenciasAbiertas: 4,
};

const ESTACIONES = [
  { id: 1, nombre: 'Central', ocupados: 8, capacidad: 10 },
  { id: 2, nombre: 'Plaza', ocupados: 3, capacidad: 12 },
  { id: 3, nombre: 'Terminal', ocupados: 10, capacidad: 10 },
  { id: 4, nombre: 'Universidad', ocupados: 5, capacidad: 8 },
];

const INCIDENCIAS = [
  { id: 1, tipo: 'Daño en bicicleta', detalle: 'BIC-002', estado: 'ABIERTA' },
  { id: 2, tipo: 'Daño en bicicleta', detalle: 'BIC-014', estado: 'ABIERTA' },
  { id: 3, tipo: 'Falla en anclaje', detalle: 'ANC-005', estado: 'ABIERTA' },
  { id: 4, tipo: 'Daño en bicicleta', detalle: 'BIC-008', estado: 'ABIERTA' },
];

function PanelControlPage() {
  //Cuando exista el backend, estos datos se cargarán con useEffect
  const [indicadores] = useState(INDICADORES);
  const [estaciones] = useState(ESTACIONES);
  const [incidencias] = useState(INCIDENCIAS);

  //Datos derivados para el componente de ocupación
  const estacionesOcupacion = estaciones.map((estacion) => ({
    ...estacion,
    porcentaje: Math.round((estacion.ocupados / estacion.capacidad) * 100),
    lleno: estacion.ocupados >= estacion.capacidad,
  }));
  const totalOcupados = estaciones.reduce((suma, e) => suma + e.ocupados, 0);
  const capacidadTotal = estaciones.reduce((suma, e) => suma + e.capacidad, 0);

  //Pendiente: lógica de los botones de simulación
  const cambiarModo = () => {};
  const simularRolNoAdmin = () => {};

  return (
    <AdminLayout itemActivo="Panel de control">
      <div className={styles.raiz}>
        <PanelEncabezado
          titulo="Panel de control"
          actualizado="Actualizado hace 1 min"
          modo="Datos Normales"
          onCambiarModo={cambiarModo}
          onSimularRol={simularRolNoAdmin}
        />

        <div className={styles.indicadores}>
          <TarjetaIndicador
            titulo="Estaciones activas"
            valor={indicadores.estacionesActivas}
            etiqueta={<Etiqueta texto={`${indicadores.estacionesInactivas} inactivas`} color="verde" />}
          />
          <TarjetaIndicador
            titulo="Bicicletas disponibles"
            valor={indicadores.bicicletasDisponibles}
            etiqueta={<Etiqueta texto={`${indicadores.porcentajeFlota}% flota`} color="menta" />}
          />
          <TarjetaIndicador
            titulo="Viajes en curso"
            valor={indicadores.viajesEnCurso}
            vivo
          />
          <TarjetaIndicador
            titulo="Incidencias abiertas"
            valor={indicadores.incidenciasAbiertas}
            etiqueta={<Etiqueta texto="PENDIENTES" color="amarilla" />}
            enlace="Ver detalles →"
          />
        </div>

        <div className={styles.detalle}>
          <OcupacionAnclajes
            estaciones={estacionesOcupacion}
            totalOcupados={totalOcupados}
            capacidadTotal={capacidadTotal}
          />
          <IncidenciasRecientes incidencias={incidencias} filtro="ABIERTA" />
        </div>

        <footer className={styles.pie}>
          <span>StationBike</span>
          <span>Modo Solo Consulta: La información se actualiza automáticamente cada 60s.</span>
        </footer>
      </div>
    </AdminLayout>
  );
}

export default PanelControlPage;