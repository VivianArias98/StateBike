import { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout/AdminLayout.jsx';
import MapaTunja from '../../../components/MapaTunja/MapaTunja.jsx';
import Aviso from '../../../components/Avisos/Aviso.jsx';
import EstacionForm from './components/EstacionForm.jsx';
import { validarEstacion, nombreRepetido, MENSAJES } from './validaciones.js';
import './EstacionFormPage.css';

const FORMULARIO_VACIO = { nombre: '', direccion: '', capacidad: '' };

// Props:
// - estaciones: lista actual (para validar el nombre repetido y mostrar las otras en el mapa)
// - onGuardar(datos): la lista guarda la nueva estación
// - onCancelar(): vuelve a la lista
function RegistrarEstacionPage({ estaciones, onGuardar, onCancelar }) {
  const [valores, setValores] = useState(FORMULARIO_VACIO);
  const [punto, setPunto] = useState(null); // { lat, lng } o null
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');

  const estacionesActivas = estaciones.filter((estacion) => estacion.estado === 'ACTIVE');

  const handleCambio = (campo, valor) => {
    setValores({ ...valores, [campo]: valor });
  };

  //El mapa llama a esta función en cada clic o al arrastrar el punto
  const handleSeleccionarPunto = (lat, lng) => {
    setPunto({ lat, lng });
  };

  const handleSubmit = (evento) => {
    evento.preventDefault();

    const mensaje = validarEstacion({ ...valores, punto });
    if (mensaje) {
      setError(mensaje);
      return;
    }

    if (nombreRepetido(valores.nombre, estaciones)) {
      setError(MENSAJES.repetido);
      return;
    }

    //La lista crea la estación ACTIVE y sus anclajes LIBRES (uno por puesto)
    onGuardar({
      nombre: valores.nombre.trim(),
      direccion: valores.direccion.trim(),
      capacidad: Number(valores.capacidad),
      lat: punto.lat,
      lng: punto.lng,
    });

    //Limpia el formulario y avisa
    setError('');
    setValores(FORMULARIO_VACIO);
    setPunto(null);
    setAviso('Estación registrada con éxito');
  };

  return (
    <AdminLayout itemActivo="Estaciones">
      <h1 className="estacion-pagina__titulo">Registrar estación</h1>

      <div className="estacion-pagina__contenido">
        <EstacionForm
          modo="registrar"
          valores={valores}
          onCambio={handleCambio}
          onSubmit={handleSubmit}
          onCancelar={onCancelar}
          error={error}
        />

        <MapaTunja
          estaciones={estacionesActivas}
          punto={punto}
          onSeleccionar={handleSeleccionarPunto}
          ayuda="Clic para posicionar estación"
          nota="El número indica las bicicletas disponibles"
        />
      </div>

      <Aviso mensaje={aviso} onCerrar={() => setAviso('')} />
    </AdminLayout>
  );
}

export default RegistrarEstacionPage;