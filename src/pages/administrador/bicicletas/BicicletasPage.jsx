import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout/AdminLayout.jsx';
import AdminEncabezado from '../components/AdminEncabezado.jsx';
import { IconoBicicleta } from '../../../components/Iconos/Iconos.jsx';
import Aviso from '../../../components/Avisos/Aviso.jsx';
import BicicletasTable from './components/BicicletasTable.jsx';
import BicicletaForm from './components/BicicletaForm.jsx';
import styles from './BicicletasPage.module.css';

function leerToken() {
  try {
    const sesion = JSON.parse(localStorage.getItem('stationbike.sesion'));
    return sesion?.acceso || null;
  } catch {
    return null;
  }
}

function BicicletasPage() {
  const navigate = useNavigate();
  const [bicicletas, setBicicletas] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [aviso, setAviso] = useState('');
  const [cargando, setCargando] = useState(false);
  const [bicicletaAInactivar, setBicicletaAInactivar] = useState(null);
  const [bicicletaAActivar, setBicicletaAActivar] = useState(null);
  const [estacionSeleccionada, setEstacionSeleccionada] = useState('');

  const cargarBicicletas = async (termino = '') => {
    try {
      const token = leerToken();
      const query = termino ? `?q=${encodeURIComponent(termino)}` : '';
      const respuesta = await fetch(`/api/admin/bicicletas${query}`, {
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
        throw new Error('Error al cargar bicicletas');
      }

      const datos = await respuesta.json();
      const lista = Array.isArray(datos) ? datos : (datos.bicicletas || []);
      setBicicletas(lista);
    } catch (error) {
      console.error(error);
      setAviso('No se pudo conectar con el servidor');
    }
  };

  const cargarEstaciones = async () => {
    try {
      const token = leerToken();
      const respuesta = await fetch('/api/admin/estaciones', {
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (respuesta.ok) {
        const datos = await respuesta.json();
        const listaEst = Array.isArray(datos) ? datos : (datos.estaciones || []);
        setEstaciones(listaEst);
      }
    } catch {
      // Ignorar error secundario de estaciones
    }
  };

  useEffect(() => {
    cargarBicicletas(busqueda);
    cargarEstaciones();
  }, [busqueda]);

  // Estaciones activas con anclajes libres para el selector del formulario
  const estacionesDisponibles = estaciones.filter((est) => {
    const libres = est.anclajesLibres ?? (est.anclajes - (est.anclajesOcupados || 0));
    return est.estado === 'ACTIVE' && libres > 0;
  });

  // Registrar bicicleta (HU_14)
  const handleRegistrar = async (datos) => {
    setCargando(true);
    try {
      const token = leerToken();
      const respuesta = await fetch('/api/admin/bicicletas', {
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
        if (resJson.error === 'codigo_bicicleta_duplicado') {
          throw new Error('El código de la bicicleta ya se encuentra registrado');
        }
        if (resJson.error === 'estacion_sin_anclajes_libres') {
          throw new Error('La estación no tiene anclajes libres');
        }
        throw new Error(resJson.mensaje || 'Error al registrar bicicleta');
      }

      setAviso('REGISTRO DE BICICLETA EXITOSO');
      await cargarBicicletas(busqueda);
      await cargarEstaciones();
    } finally {
      setCargando(false);
    }
  };

  // Alternar estado entre DISPONIBLE y MANTENIMIENTO (HU_20)
  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      const token = leerToken();
      const respuesta = await fetch(`/api/admin/bicicletas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      const resJson = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        if (resJson.error === 'bicicleta_en_uso') {
          setAviso('La bicicleta está en uso');
        } else {
          setAviso(resJson.mensaje || 'Error al cambiar estado de la bicicleta');
        }
        return;
      }

      setAviso('BICICLETA ACTUALIZADA CORRECTAMENTE');
      await cargarBicicletas(busqueda);
      await cargarEstaciones();
    } catch {
      setAviso('Error de conexión al actualizar la bicicleta');
    }
  };

  // Inactivar bicicleta (HU_20)
  const handleSolicitarInactivar = (bici) => {
    if (bici.estado === 'EN_USO' || bici.estado === 'INACTIVA') return;
    setBicicletaAInactivar(bici);
  };

  const handleConfirmarInactivar = async () => {
    if (!bicicletaAInactivar) return;

    try {
      const token = leerToken();
      const respuesta = await fetch(`/api/admin/bicicletas/${bicicletaAInactivar.id}/inactivar`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const resJson = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        if (resJson.error === 'bicicleta_en_uso') {
          setAviso('La bicicleta está en uso');
        } else {
          setAviso(resJson.mensaje || 'Error al inactivar la bicicleta');
        }
        return;
      }

      setAviso('BICICLETA INACTIVADA CORRECTAMENTE');
      await cargarBicicletas(busqueda);
      await cargarEstaciones();
    } catch {
      setAviso('Error de conexión al inactivar la bicicleta');
    } finally {
      setBicicletaAInactivar(null);
    }
  };

  // Activar bicicleta inactiva asignándole un anclaje
  const handleSolicitarActivar = (bici) => {
    if (bici.estado !== 'INACTIVA') return;
    if (estacionesDisponibles.length > 0) {
      setEstacionSeleccionada(String(estacionesDisponibles[0].id));
    } else {
      setEstacionSeleccionada('');
    }
    setBicicletaAActivar(bici);
  };

  const handleConfirmarActivar = async () => {
    if (!bicicletaAActivar) return;

    setCargando(true);
    try {
      const token = leerToken();
      const respuesta = await fetch(`/api/admin/bicicletas/${bicicletaAActivar.id}/activar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          estacionId: estacionSeleccionada ? Number(estacionSeleccionada) : undefined,
        }),
      });

      const resJson = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        if (resJson.error === 'estacion_sin_anclajes_libres') {
          setAviso('La estación seleccionada no tiene anclajes libres');
        } else if (resJson.error === 'sin_anclajes_disponibles') {
          setAviso('No hay estaciones con anclajes libres para ubicar la bicicleta');
        } else {
          setAviso(resJson.mensaje || 'Error al activar la bicicleta');
        }
        return;
      }

      setAviso('BICICLETA ACTIVADA CORRECTAMENTE');
      await cargarBicicletas(busqueda);
      await cargarEstaciones();
    } catch {
      setAviso('Error de conexión al activar la bicicleta');
    } finally {
      setCargando(false);
      setBicicletaAActivar(null);
    }
  };

  return (
    <AdminLayout itemActivo="Bicicletas">
      <AdminEncabezado
        etiqueta="Administración / Flota de Transporte"
        titulo="Gestión de Bicicletas"
        subtitulo="Supervisión de flota, asignación de anclajes automáticos, alternancia a mantenimiento e inactivación."
        icono={<IconoBicicleta />}
        acciones={
          <span className="insignia insignia--activa" style={{ height: '2.5rem', padding: '0 var(--espacio-4)', fontWeight: 700 }}>
            🚲 {bicicletas.length} bicicletas registradas
          </span>
        }
      />

      <div className={styles.contenido}>
        <input
          type="search"
          className={`input ${styles.buscador}`}
          placeholder="Buscar bicicleta por código (ej. BICI-001)..."
          aria-label="Buscar bicicleta por código"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className={styles.tabla}>
          <BicicletasTable
            bicicletas={bicicletas}
            onCambiarEstado={handleCambiarEstado}
            onInactivar={handleSolicitarInactivar}
            onActivar={handleSolicitarActivar}
          />
        </div>

        <div className={styles.formulario}>
          <BicicletaForm
            estacionesDisponibles={estacionesDisponibles}
            onRegistrar={handleRegistrar}
            cargando={cargando}
          />
        </div>
      </div>

      {/* Modal de confirmación para inactivar bicicleta (HU_20) */}
      {bicicletaAInactivar && (
        <div className={styles.modalFondo} role="dialog" aria-modal="true" aria-labelledby="modal-inactivar-bici-titulo">
          <div className={styles.modalCaja}>
            <h2 id="modal-inactivar-bici-titulo" className={styles.modalTitulo}>
              Inactivar bicicleta
            </h2>
            <p className={styles.modalTexto}>
              ¿Está seguro de que desea inactivar la bicicleta <strong>{bicicletaAInactivar.codigo}</strong>?
            </p>
            <p className={styles.modalTexto}>
              Esta acción liberará su anclaje y la retirará de la flota operativa disponible.
            </p>
            <div className={styles.modalAcciones}>
              <button
                type="button"
                className="boton boton--secundario"
                onClick={() => setBicicletaAInactivar(null)}
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

      {/* Modal de confirmación para activar bicicleta */}
      {bicicletaAActivar && (
        <div className={styles.modalFondo} role="dialog" aria-modal="true" aria-labelledby="modal-activar-bici-titulo">
          <div className={styles.modalCaja}>
            <h2 id="modal-activar-bici-titulo" className={styles.modalTitulo}>
              Activar bicicleta
            </h2>
            <p className={styles.modalTexto}>
              ¿Está seguro de que desea reactivar la bicicleta <strong>{bicicletaAActivar.codigo}</strong>?
            </p>

            {estacionesDisponibles.length > 0 ? (
              <div className="campo" style={{ marginTop: 'var(--espacio-3)', marginBottom: 'var(--espacio-3)' }}>
                <label htmlFor="estacion-activar-select" style={{ fontWeight: 700, fontSize: 'var(--texto-s)' }}>
                  Estación de destino (con anclajes libres):
                </label>
                <select
                  id="estacion-activar-select"
                  className="input"
                  value={estacionSeleccionada}
                  onChange={(e) => setEstacionSeleccionada(e.target.value)}
                >
                  {estacionesDisponibles.map((est) => {
                    const libres = est.anclajesLibres ?? (est.anclajes - (est.anclajesOcupados || 0));
                    return (
                      <option key={est.id} value={est.id}>
                        {est.nombre} ({libres} anclajes libres)
                      </option>
                    );
                  })}
                </select>
              </div>
            ) : (
              <p className="mensaje-error" style={{ margin: 'var(--espacio-3) 0' }}>
                No hay estaciones activas con anclajes libres en este momento. Debe liberar un anclaje antes de reactivar.
              </p>
            )}

            <div className={styles.modalAcciones}>
              <button
                type="button"
                className="boton boton--secundario"
                onClick={() => setBicicletaAActivar(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="boton boton--primario"
                onClick={handleConfirmarActivar}
                disabled={estacionesDisponibles.length === 0}
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

export default BicicletasPage;
