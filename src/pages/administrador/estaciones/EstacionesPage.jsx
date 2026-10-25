import { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout/AdminLayout.jsx';
import EstacionesTable from './components/EstacionesTable.jsx';
import './EstacionesPage.css';

//Mock
const ESTACIONES_INICIALES = [
  { id: 1, nombre: 'Estación centro', direccion: 'Cra 20#11-15', estado: 'ACTIVE' },
  { id: 2, nombre: 'Estación universidad', direccion: 'Cra 20#11-15', estado: 'INACTIVE' },
  { id: 3, nombre: 'Estacion Parque', direccion: 'Cra 20#11-15', estado: 'ACTIVE' },
  { id: 4, nombre: 'Estación centro comercial', direccion: 'Cra 20#11-15', estado: 'INACTIVE' },
];

function EstacionesPage() {
  const [estaciones] = useState(ESTACIONES_INICIALES);
  const [busqueda, setBusqueda] = useState('');

  const estacionesFiltradas = estaciones.filter((estacion) =>
    estacion.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  //TODO: cada acción abrirá su pantalla o ventana cuando se construya
  const handleRegistrar = () => {
    console.log('Registrar estación');
  };

  const handleEditar = (id) => {
    console.log('Editar estación', id);
  };

  const handleInactivar = (id) => {
    console.log('Inactivar estación', id);
  };

  return (
    <AdminLayout itemActivo="Estaciones">
      <h1 className="estaciones__titulo">Estaciones</h1>

      <div className="estaciones__barra">
        <input
          type="text"
          className="estaciones__buscador"
          placeholder="Buscar por nombre"
          aria-label="Buscar por nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button
          type="button"
          className="boton boton--primario estaciones__registrar"
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
    </AdminLayout>
  );
}

export default EstacionesPage;