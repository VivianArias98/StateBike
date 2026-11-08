import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout/AdminLayout.jsx';
import Etiqueta from '../../../components/Etiqueta/Etiqueta.jsx';
import PanelEncabezado from './components/PanelEncabezado.jsx';
import TarjetaIndicador from './components/TarjetaIndicador.jsx';
import OcupacionAnclajes from './components/OcupacionAnclajes.jsx';
import IncidenciasRecientes from './components/IncidenciasRecientes.jsx';
import styles from './PanelControlPage.module.css';

function leerToken() {
  try {
    const sesion = JSON.parse(localStorage.getItem('stationbike.sesion'));
    return sesion?.acceso || null;
  } catch {
    return null;
  }
}

function PanelControlPage() {
  const navigate = useNavigate();
  const [indicadores, setIndicadores] = useState({
    estacionesActivas: 0,
    estacionesInactivas: 0,
    bicicletasDisponibles: 0,
    porcentajeFlota: 0,
    viajesEnCurso: 0,
    incidenciasAbiertas: 0,
  });
  const [estaciones, setEstaciones] = useState([]);
  const [incidencias, setIncidencias] = useState([]);
  const [actualizado, setActualizado] = useState('Actualizando...');

  const cargarDatos = async () => {
    try {
      const token = leerToken();
      const res = await fetch('/api/admin/resumen', {
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          navigate('/login');
          return;
        }
        return;
      }

      const datos = await res.json();
      if (datos.indicadores) setIndicadores(datos.indicadores);
      if (Array.isArray(datos.estaciones)) setEstaciones(datos.estaciones);
      if (Array.isArray(datos.incidencias)) setIncidencias(datos.incidencias);

      const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setActualizado(`Actualizado a las ${hora}`);
    } catch {
      setActualizado('Sin conexión');
    }
  };

  useEffect(() => {
    cargarDatos();
    const timer = setInterval(cargarDatos, 60000);
    return () => clearInterval(timer);
  }, []);

  // Datos derivados para el componente de ocupación
  const estacionesOcupacion = estaciones.map((estacion) => ({
    ...estacion,
    porcentaje:
      estacion.porcentaje ??
      (estacion.capacidad > 0 ? Math.round((estacion.ocupados / estacion.capacidad) * 100) : 0),
    lleno: estacion.lleno ?? (estacion.ocupados >= estacion.capacidad),
  }));
  const totalOcupados = estaciones.reduce((suma, e) => suma + (e.ocupados || 0), 0);
  const capacidadTotal = estaciones.reduce((suma, e) => suma + (e.capacidad || 0), 0);

  const cambiarModo = () => {
    cargarDatos();
  };

  const simularRolNoAdmin = () => {
    navigate('/inicio');
  };

  return (
    <AdminLayout itemActivo="Panel de control">
      <div className={styles.raiz}>
        <PanelEncabezado
          titulo="Panel de control"
          actualizado={actualizado}
          modo="En vivo"
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