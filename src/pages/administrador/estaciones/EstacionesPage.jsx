import { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout/AdminLayout.jsx';
import Aviso from '../../../components/Avisos/Aviso.jsx';
import EstacionesTable from './components/EstacionesTable.jsx';
import RegistrarEstacionPage from './RegistrarEstacionPage.jsx';
import EditarEstacionPage from './EditarEstacionPage.jsx';
import { ESTACIONES_INICIALES } from './estacionesMock.js';
import styles from './EstacionesPage.module.css';

function EstacionesPage() {
  const [estaciones, setEstaciones] = useState(ESTACIONES_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [aviso, setAviso] = useState('');

  // Qué pantalla se muestra: 'lista' | 'registrar' | 'editar'
  const [vista, setVista] = useState('lista');
  const [estacionEditando, setEstacionEditando] = useState(null);

  const estacionesFiltradas = estaciones.filter((estacion) =>
    estacion.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // ---------- Navegación entre vistas ----------
  const handleRegistrar = () => {
    setVista('registrar');
  };

  const handleEditar = (id) => {
    const estacion = estaciones.find((e) => e.id === id);
    // Solo se pueden editar las estaciones ACTIVE (HU_12)
    if (!estacion || estacion.estado !== 'ACTIVE') return;
    setEstacionEditando(estacion);
    setVista('editar');
  };

  const handleVolver = () => {
    setEstacionEditando(null);
    setVista('lista');
  };

  // ---------- Cambios en los datos ----------
  // Registrar (HU_11): la estación nace ACTIVE y con tantos anclajes como puestos.
  // La pantalla de registrar se queda en el formulario (lo limpia ella misma).
  const handleGuardarNueva = (datos) => {
    const nuevaEstacion = {
      id: Math.max(0, ...estaciones.map((e) => e.id)) + 1, // con backend lo asigna el servidor
      nombre: datos.nombre,
      direccion: datos.direccion,
      anclajes: datos.capacidad,
      bicicletas: 0,
      estado: 'ACTIVE',
      lat: datos.lat,
      lng: datos.lng,
    };
    setEstaciones([...estaciones, nuevaEstacion]);
  };

  // Editar (HU_12): conserva identificador y número de anclajes, vuelve a la lista y avisa
  const handleActualizar = (datos) => {
    setEstaciones(
      estaciones.map((estacion) =>
        estacion.id === datos.id
          ? {
              ...estacion,
              nombre: datos.nombre,
              direccion: datos.direccion,
              lat: datos.lat,
              lng: datos.lng,
            }
          : estacion
      )
    );
    setAviso('Estación modificada con éxito');
    handleVolver();
  };

  // TODO: ventana de confirmación y verificación de bicicletas (HU_13)
  const handleInactivar = (id) => {
    console.log('Inactivar estación', id);
  };

  // ---------- Qué se dibuja ----------
  if (vista === 'registrar') {
    return (
      <RegistrarEstacionPage
        estaciones={estaciones}
        onGuardar={handleGuardarNueva}
        onCancelar={handleVolver}
      />
    );
  }

  if (vista === 'editar' && estacionEditando) {
    return (
      <EditarEstacionPage
        estacion={estacionEditando}
        estaciones={estaciones}
        onGuardar={handleActualizar}
        onCancelar={handleVolver}
      />
    );
  }

  return (
    <AdminLayout itemActivo="Estaciones">
      <h1 className="titulo-pagina">Estaciones</h1>

      <div className={styles.barra}>
        <input
          type="text"
          className={`input ${styles.buscador}`}
          placeholder="Buscar por nombre"
          aria-label="Buscar por nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button
          type="button"
          className={`boton boton--primario ${styles.registrar}`}
          onClick={handleRegistrar}
        >
          Registrar estación
        </button>
      </div>

      {estaciones.length === 0 ? (
        <p>No hay estaciones registradas</p>
      ) : (
        <EstacionesTable
          estaciones={estacionesFiltradas}
          onEditar={handleEditar}
          onInactivar={handleInactivar}
        />
      )}

      <Aviso mensaje={aviso} onCerrar={() => setAviso('')} />
    </AdminLayout>
  );
}

export default EstacionesPage;