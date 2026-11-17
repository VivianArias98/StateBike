import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout/AdminLayout.jsx';
import AdminEncabezado from '../components/AdminEncabezado.jsx';
import { IconoUbicacion, IconoPlus } from '../../../components/Iconos/Iconos.jsx';
import Aviso from '../../../components/Avisos/Aviso.jsx';
import EstacionesTable from './components/EstacionesTable.jsx';
import RegistrarEstacionPage from './RegistrarEstacionPage.jsx';
import EditarEstacionPage from './EditarEstacionPage.jsx';
import { pedirAutenticado } from '../../../utils/auth.js';
import styles from './EstacionesPage.module.css';

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
  // Destino y estado para reubicación de bicicletas al inactivar
  const [estacionDestinoReubicacion, setEstacionDestinoReubicacion] = useState('');
  const [reubicando, setReubicando] = useState(false);
  // Modal de confirmación para activar
  const [estacionAActivar, setEstacionAActivar] = useState(null);

  const cargarEstaciones = async () => {
    try {
      const datos = await pedirAutenticado('/admin/estaciones');
      const lista = Array.isArray(datos) ? datos : (datos.estaciones || []);
      setEstaciones(lista);
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        navigate('/login');
        return;
      }
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
    try {
      await pedirAutenticado('/admin/estaciones', {
        metodo: 'POST',
        cuerpo: datos,
      });
      await cargarEstaciones();
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        navigate('/login');
        return;
      }
      if (err.codigo === 'nombre_estacion_duplicado') {
        throw new Error('El nombre de la estación ya se encuentra registrado');
      }
      throw new Error(err.mensaje || 'Error al registrar estación');
    }
  };

  // Editar (HU_12)
  const handleActualizar = async (datos) => {
    try {
      const resJson = await pedirAutenticado(`/admin/estaciones/${datos.id}`, {
        metodo: 'PUT',
        cuerpo: {
          nombre: datos.nombre,
          direccion: datos.direccion,
          lat: datos.lat,
          lng: datos.lng,
        },
      });

      setAviso(resJson?.mensaje || 'Estación modificada con éxito');
      await cargarEstaciones();
      handleVolver();
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        navigate('/login');
        return;
      }
      if (err.codigo === 'nombre_estacion_duplicado') {
        throw new Error('El nombre de la estación ya se encuentra registrado');
      }
      throw new Error(err.mensaje || 'Error al modificar estación');
    }
  };

  // Inactivar con confirmación (HU_13)
  const handleSolicitarInactivar = (id) => {
    const estacion = estaciones.find((e) => e.id === id);
    if (!estacion || estacion.estado !== 'ACTIVE') return;
    setEstacionAInactivar(estacion);

    const bicisOcupadas = Number(estacion.anclajesOcupados || 0);
    const candidatas = estaciones.filter(
      (e) =>
        e.id !== estacion.id &&
        e.estado === 'ACTIVE' &&
        (e.anclajesLibres ?? (e.anclajes - (e.anclajesOcupados || 0))) >= bicisOcupadas
    );
    if (candidatas.length > 0) {
      setEstacionDestinoReubicacion(String(candidatas[0].id));
    } else {
      setEstacionDestinoReubicacion('');
    }
  };

  const handleConfirmarInactivar = async () => {
    if (!estacionAInactivar) return;

    try {
      await pedirAutenticado(`/admin/estaciones/${estacionAInactivar.id}/inactivar`, {
        metodo: 'PATCH',
      });
      setAviso('La estación ha sido inactivada de forma correcta');
      await cargarEstaciones();
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        navigate('/login');
        return;
      }
      if (err.codigo === 'estacion_con_bicicletas') {
        setAviso('La estación tiene bicicletas asignadas, reubíquelas antes de inactivar');
      } else {
        setAviso(err.mensaje || 'Error al inactivar la estación');
      }
    } finally {
      setEstacionAInactivar(null);
    }
  };

  const handleReubicarEInactivar = async (soloReubicar = false) => {
    if (!estacionAInactivar || !estacionDestinoReubicacion) return;

    setReubicando(true);
    try {
      // 1. Reubicar todas las bicicletas hacia la estación de destino
      await pedirAutenticado(`/admin/bicicletas/estacion/${estacionAInactivar.id}/reubicar-todas`, {
        metodo: 'PATCH',
        cuerpo: {
          estacionDestinoId: Number(estacionDestinoReubicacion),
        },
      });

      if (soloReubicar) {
        setAviso('Bicicletas reubicadas correctamente');
        await cargarEstaciones();
        setEstacionAInactivar(null);
        return;
      }

      // 2. Inactivar la estación una vez reubicadas las bicicletas
      await pedirAutenticado(`/admin/estaciones/${estacionAInactivar.id}/inactivar`, {
        metodo: 'PATCH',
      });

      setAviso('Bicicletas reubicadas y estación inactivada de forma correcta');
      await cargarEstaciones();
      setEstacionAInactivar(null);
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        navigate('/login');
        return;
      }
      setAviso(err.mensaje || 'Error al procesar la reubicación');
    } finally {
      setReubicando(false);
    }
  };

  // Activar estación con confirmación
  const handleSolicitarActivar = (id) => {
    const estacion = estaciones.find((e) => e.id === id);
    if (!estacion || estacion.estado !== 'INACTIVE') return;
    setEstacionAActivar(estacion);
  };

  const handleConfirmarActivar = async () => {
    if (!estacionAActivar) return;

    try {
      await pedirAutenticado(`/admin/estaciones/${estacionAActivar.id}/activar`, {
        metodo: 'PATCH',
      });
      setAviso('La estación ha sido activada de forma correcta');
      await cargarEstaciones();
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        navigate('/login');
        return;
      }
      setAviso(err.mensaje || 'Error al activar la estación');
    } finally {
      setEstacionAActivar(null);
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
      <AdminEncabezado
        etiqueta="Administración / Red Física"
        titulo="Gestión de Estaciones"
        subtitulo="Supervisión, alta de puntos físicos en Tunja, edición de anclajes e inactivación controlada."
        icono={<IconoUbicacion />}
        acciones={
          <button
            type="button"
            className="boton boton--primario"
            onClick={handleRegistrar}
          >
            <IconoPlus /> Registrar Estación
          </button>
        }
      />

      <div className={styles.barra}>
        <input
          type="search"
          className={`input ${styles.buscador}`}
          placeholder="Buscar estación por nombre..."
          aria-label="Buscar estación por nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        {busqueda && (
          <button
            type="button"
            className="boton boton--secundario"
            onClick={() => setBusqueda('')}
          >
            Limpiar
          </button>
        )}
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
          onActivar={handleSolicitarActivar}
        />
      )}

      {/* Modal de confirmación para inactivar estación (HU_13) con soporte para reubicación */}
      {estacionAInactivar && (() => {
        const bicisEnEstacion = Number(estacionAInactivar.anclajesOcupados || 0);
        const tieneBicis = bicisEnEstacion > 0;
        const candidatas = estaciones.filter(
          (e) =>
            e.id !== estacionAInactivar.id &&
            e.estado === 'ACTIVE' &&
            (e.anclajesLibres ?? (e.anclajes - (e.anclajesOcupados || 0))) >= bicisEnEstacion
        );

        return (
          <div className={styles.modalFondo} role="dialog" aria-modal="true" aria-labelledby="modal-inactivar-titulo">
            <div className={styles.modalCaja}>
              <h2 id="modal-inactivar-titulo" className={styles.modalTitulo}>
                Inactivar estación
              </h2>
              <p className={styles.modalTexto}>
                ¿Está seguro de que desea inactivar la estación <strong>{estacionAInactivar.nombre}</strong>?
              </p>

              {tieneBicis ? (
                <>
                  <div className={styles.alertaReubicacion}>
                    <strong>Atención:</strong> Esta estación tiene{' '}
                    <strong>
                      {bicisEnEstacion} {bicisEnEstacion === 1 ? 'bicicleta asignada' : 'bicicletas asignadas'}
                    </strong>
                    . Para poder inactivarla, debe reubicarlas a otra estación activa con anclajes disponibles.
                  </div>

                  {candidatas.length > 0 ? (
                    <div>
                      <label
                        htmlFor="estacion-destino-reubicar"
                        style={{ display: 'block', fontWeight: 700, fontSize: 'var(--texto-s)', marginBottom: 'var(--espacio-2)' }}
                      >
                        Estación de destino para las bicicletas:
                      </label>
                      <select
                        id="estacion-destino-reubicar"
                        className="input"
                        value={estacionDestinoReubicacion}
                        onChange={(e) => setEstacionDestinoReubicacion(e.target.value)}
                        disabled={reubicando}
                      >
                        {candidatas.map((est) => {
                          const libres = est.anclajesLibres ?? (est.anclajes - (est.anclajesOcupados || 0));
                          return (
                            <option key={est.id} value={est.id}>
                              {est.nombre} ({libres} anclajes libres)
                            </option>
                          );
                        })}
                      </select>

                      <div className={styles.modalAcciones} style={{ flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="boton boton--secundario"
                          onClick={() => setEstacionAInactivar(null)}
                          disabled={reubicando}
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          className="boton boton--secundario"
                          onClick={() => handleReubicarEInactivar(true)}
                          disabled={reubicando || !estacionDestinoReubicacion}
                          title="Mover las bicicletas sin inactivar la estación"
                        >
                          {reubicando ? 'Reubicando...' : 'Solo reubicar'}
                        </button>
                        <button
                          type="button"
                          className={`boton ${styles.botonPeligro}`}
                          onClick={() => handleReubicarEInactivar(false)}
                          disabled={reubicando || !estacionDestinoReubicacion}
                          title="Reubicar bicicletas e inactivar la estación de inmediato"
                        >
                          {reubicando ? 'Procesando...' : 'Reubicar e inactivar'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className={styles.modalTexto} style={{ color: 'var(--color-error-texto)', fontSize: 'var(--texto-s)' }}>
                        Ninguna otra estación activa cuenta con suficientes anclajes libres simultáneos ({bicisEnEstacion}) para recibir toda la flota junta. Puede reubicarlas individualmente desde la gestión de bicicletas.
                      </p>
                      <div className={styles.modalAcciones}>
                        <button
                          type="button"
                          className="boton boton--secundario"
                          onClick={() => setEstacionAInactivar(null)}
                        >
                          Cerrar
                        </button>
                        <button
                          type="button"
                          className="boton boton--primario"
                          onClick={() => {
                            setEstacionAInactivar(null);
                            navigate('/admin/bicicletas');
                          }}
                        >
                          Ir a Bicicletas
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        );
      })()}

      {/* Modal de confirmación para activar estación */}
      {estacionAActivar && (
        <div className={styles.modalFondo} role="dialog" aria-modal="true" aria-labelledby="modal-activar-titulo">
          <div className={styles.modalCaja}>
            <h2 id="modal-activar-titulo" className={styles.modalTitulo}>
              Activar estación
            </h2>
            <p className={styles.modalTexto}>
              ¿Está seguro de que desea activar la estación <strong>{estacionAActivar.nombre}</strong>?
            </p>
            <p className={styles.modalTexto}>
              La estación volverá a estar disponible en el mapa para retiros, devoluciones y anclajes en la red.
            </p>
            <div className={styles.modalAcciones}>
              <button
                type="button"
                className="boton boton--secundario"
                onClick={() => setEstacionAActivar(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="boton boton--primario"
                onClick={handleConfirmarActivar}
              >
                Confirmar activación
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
