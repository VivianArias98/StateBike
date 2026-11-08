import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout/AdminLayout.jsx';
import Aviso from '../../../components/Avisos/Aviso.jsx';
import EstacionesTable from './components/EstacionesTable.jsx';
import RegistrarEstacionPage from './RegistrarEstacionPage.jsx';
import EditarEstacionPage from './EditarEstacionPage.jsx';
import styles from './EstacionesPage.module.css';

function leerToken() {
  try {
    const sesion = JSON.parse(localStorage.getItem('stationbike.sesion'));
    return sesion?.acceso || null;
  } catch {
    return null;
  }
}

function EstacionesPage() {
  const navigate = useNavigate();
  const [estaciones, setEstaciones] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [aviso, setAviso] = useState('');
  const [cargando, setCargando] = useState(true);

  // Qué pantalla se muestra: 'lista' | 'registrar' | 'editar'
  const [vista, setVista] = useState('lista');
  const [estacionEditando, setEstacionEditando] = useState(null);

  // Modal de confirmación para inactivar (HU_13)
  const [estacionAInactivar, setEstacionAInactivar] = useState(null);

  const cargarEstaciones = async () => {
    try {
      const token = leerToken();
      const respuesta = await fetch('/api/admin/estaciones', {
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!respuesta.ok) {
        if (respuesta.status === 401 || respuesta.status === 403) {
          navigate('/login');
          return;
        }
        throw new Error('Error al cargar estaciones');
      }

      const datos = await respuesta.json();
      const lista = Array.isArray(datos) ? datos : (datos.estaciones || []);
      setEstaciones(lista);
    } catch (error) {
      console.error(error);
      setAviso('No se pudo conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEstaciones();
  }, []);

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

  // ---------- Acciones con la API ----------
  // Registrar (HU_11)
  const handleGuardarNueva = async (datos) => {
    const token = leerToken();
    const respuesta = await fetch('/api/admin/estaciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(datos),
    });

    const resJson = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
      if (resJson.error === 'nombre_estacion_duplicado') {
        throw new Error('El nombre de la estación ya se encuentra registrado');
      }
      throw new Error(resJson.mensaje || 'Error al registrar estación');
    }

    await cargarEstaciones();
  };

  // Editar (HU_12)
  const handleActualizar = async (datos) => {
    const token = leerToken();
    const respuesta = await fetch(`/api/admin/estaciones/${datos.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        nombre: datos.nombre,
        direccion: datos.direccion,
        lat: datos.lat,
        lng: datos.lng,
      }),
    });

    const resJson = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
      if (resJson.error === 'nombre_estacion_duplicado') {
        throw new Error('El nombre de la estación ya se encuentra registrado');
      }
      throw new Error(resJson.mensaje || 'Error al modificar estación');
    }

    setAviso('Estación modificada con éxito');
    await cargarEstaciones();
    handleVolver();
  };

  // Inactivar con confirmación (HU_13)
  const handleSolicitarInactivar = (id) => {
    const estacion = estaciones.find((e) => e.id === id);
    if (!estacion || estacion.estado !== 'ACTIVE') return;
    setEstacionAInactivar(estacion);
  };

  const handleConfirmarInactivar = async () => {
    if (!estacionAInactivar) return;

    try {
      const token = leerToken();
      const respuesta = await fetch(`/api/admin/estaciones/${estacionAInactivar.id}/inactivar`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const resJson = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        if (resJson.error === 'estacion_con_bicicletas') {
          setAviso('La estación tiene bicicletas asignadas, reubíquelas antes de inactivar');
        } else {
          setAviso(resJson.mensaje || 'Error al inactivar la estación');
        }
        return;
      }

      setAviso('La estación ha sido inactivada de forma correcta');
      await cargarEstaciones();
    } catch {
      setAviso('Error de conexión al inactivar la estación');
    } finally {
      setEstacionAInactivar(null);
    }
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

      {cargando ? (
        <p style={{ color: 'var(--color-texto-suave)', padding: '1rem 0' }}>Cargando estaciones...</p>
      ) : estaciones.length === 0 ? (
        <p style={{ color: 'var(--color-texto-suave)', padding: '1rem 0' }}>No hay estaciones registradas</p>
      ) : estacionesFiltradas.length === 0 ? (
        <p style={{ color: 'var(--color-texto-suave)', padding: '1rem 0' }}>No se encontraron estaciones con ese nombre</p>
      ) : (
        <EstacionesTable
          estaciones={estacionesFiltradas}
          onEditar={handleEditar}
          onInactivar={handleSolicitarInactivar}
        />
      )}

      {/* Modal de confirmación para inactivar estación (HU_13) */}
      {estacionAInactivar && (
        <div className={styles.modalFondo} role="dialog" aria-modal="true" aria-labelledby="modal-inactivar-titulo">
          <div className={styles.modalCaja}>
            <h2 id="modal-inactivar-titulo" className={styles.modalTitulo}>
              Inactivar estación
            </h2>
            <p className={styles.modalTexto}>
              ¿Está seguro de que desea inactivar la estación <strong>{estacionAInactivar.nombre}</strong>?
            </p>
            <p className={styles.modalTexto}>
              Esta acción deshabilitará la estación para nuevos retiros y devoluciones en el sistema.
            </p>
            <div className={styles.modalAcciones}>
              <button
                type="button"
                className="boton boton--secundario"
                onClick={() => setEstacionAInactivar(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={`boton ${styles.botonPeligro}`}
                onClick={handleConfirmarInactivar}
              >
                Confirmar inactivación
              </button>
            </div>
          </div>
        </div>
      )}

      <Aviso mensaje={aviso} onCerrar={() => setAviso('')} />
    </AdminLayout>
  );
}

export default EstacionesPage;