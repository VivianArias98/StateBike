import { useState } from 'react';
import AdminLayout from '../../../layouts/AdminLayout/AdminLayout.jsx';
import MapaTunja from '../../../components/MapaTunja/MapaTunja.jsx';
import EstacionForm from './components/EstacionForm.jsx';
import { validarEstacion, nombreRepetido, MENSAJES } from './validaciones.js';
import styles from './EstacionFormPage.module.css';

// Props:
// - estacion: la estación que se edita (ya cargada)
// - estaciones: lista actual (para validar el nombre y mostrar las otras en el mapa)
// - onGuardar(datos): la lista actualiza la estación y vuelve a la lista con el aviso
// - onCancelar(): vuelve a la lista sin cambios
function EditarEstacionPage({ estacion, estaciones, onGuardar, onCancelar }) {
  // Los datos actuales de la estación llegan ya cargados
  const [valores, setValores] = useState({
    nombre: estacion.nombre,
    direccion: estacion.direccion,
    capacidad: estacion.anclajes,
  });
  const [punto, setPunto] = useState({ lat: estacion.lat, lng: estacion.lng });
  const [error, setError] = useState('');

  // Las demás estaciones activas, como referencia en el mapa
  const otrasEstaciones = estaciones.filter(
    (e) => e.estado === 'ACTIVE' && e.id !== estacion.id
  );

  const handleCambio = (campo, valor) => {
    setValores({ ...valores, [campo]: valor });
  };

  const handleSeleccionarPunto = (lat, lng) => {
    setPunto({ lat, lng });
  };

  const handleSubmit = (evento) => {
    evento.preventDefault();

    // El número de anclajes está bloqueado: no se valida
    const mensaje = validarEstacion({ ...valores, punto }, { validarCapacidad: false });
    if (mensaje) {
      setError(mensaje);
      return;
    }

    if (nombreRepetido(valores.nombre, estaciones, estacion.id)) {
      setError(MENSAJES.repetido);
      return;
    }

    // La estación conserva su identificador y su número de anclajes
    onGuardar({
      id: estacion.id,
      nombre: valores.nombre.trim(),
      direccion: valores.direccion.trim(),
      lat: punto.lat,
      lng: punto.lng,
    });
  };

  return (
    <AdminLayout itemActivo="Estaciones">
      <h1 className="titulo-pagina">Editar estación</h1>

      <div className={styles.contenido}>
        <EstacionForm
          modo="editar"
          valores={valores}
          idTexto={`EST-${String(estacion.id).padStart(3, '0')}`}
          onCambio={handleCambio}
          onSubmit={handleSubmit}
          onCancelar={onCancelar}
          error={error}
        />

        <MapaTunja
          estaciones={otrasEstaciones}
          punto={punto}
          onSeleccionar={handleSeleccionarPunto}
          ayuda="Arrastre el punto o haga clic para moverlo"
          nota="El número indica las bicicletas disponibles"
        />
      </div>
    </AdminLayout>
  );
}

export default EditarEstacionPage;