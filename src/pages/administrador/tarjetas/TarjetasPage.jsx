import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout/AdminLayout.jsx';
import AdminEncabezado from '../components/AdminEncabezado.jsx';
import { IconoNfc } from '../../../components/Iconos/Iconos.jsx';
import Aviso from '../../../components/Avisos/Aviso.jsx';
import { leerSesion } from '../../../utils/sesion.js';
import styles from './TarjetasPage.module.css';

function TarjetasPage() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);
  const [aviso, setAviso] = useState('');
  const [tipoAviso, setTipoAviso] = useState('info');

  // Modales
  const [usuarioAVincular, setUsuarioAVincular] = useState(null);
  const [uidInput, setUidInput] = useState('');
  const [errorUid, setErrorUid] = useState('');
  const [guardando, setGuardando] = useState(false);

  const [usuarioADesvincular, setUsuarioADesvincular] = useState(null);

  const cargarUsuarios = async (termino = '') => {
    setCargando(true);
    try {
      const sesion = leerSesion();
      const token = sesion?.acceso;
      const query = termino ? `?q=${encodeURIComponent(termino)}` : '';
      const respuesta = await fetch(`/api/admin/tarjetas${query}`, {
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
        throw new Error('Error al cargar la lista de tarjetas');
      }

      const datos = await respuesta.json();
      setUsuarios(datos.usuarios || []);
    } catch (error) {
      console.error(error);
      setAviso('No se pudo conectar con el servidor para obtener las tarjetas');
      setTipoAviso('error');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      cargarUsuarios(busqueda.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [busqueda]);

  const handleBuscar = (e) => {
    e.preventDefault();
    cargarUsuarios(busqueda.trim());
  };

  const abrirModalVincular = (usuario) => {
    setUsuarioAVincular(usuario);
    setUidInput('');
    setErrorUid('');
  };

  const handleVincular = async (e) => {
    e.preventDefault();
    setErrorUid('');

    const normalizado = uidInput.trim().toUpperCase();
    if (!normalizado) {
      setErrorUid('El UID de la tarjeta NFC es obligatorio');
      return;
    }

    if (!/^[0-9A-F]{4,32}$/.test(normalizado)) {
      setErrorUid('El UID debe ser hexadecimal (0-9, A-F) entre 4 y 32 caracteres');
      return;
    }

    setGuardando(true);
    try {
      const sesion = leerSesion();
      const token = sesion?.acceso;
      const respuesta = await fetch('/api/admin/tarjetas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          usuarioId: usuarioAVincular.usuarioId,
          uid: normalizado,
        }),
      });

      const resJson = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        if (resJson.error === 'tarjeta_en_uso') {
          throw new Error('La tarjeta NFC con ese UID ya se encuentra asignada a otro usuario');
        }
        if (resJson.error === 'usuario_con_tarjeta') {
          throw new Error('El usuario ya cuenta con una tarjeta NFC vinculada');
        }
        if (resJson.error === 'uid_invalido') {
          throw new Error('El formato del UID hexadecimal no es válido');
        }
        if (resJson.error === 'usuario_de_otro_proyecto') {
          throw new Error('El usuario pertenece a otro proyecto y no puede ser modificado');
        }
        throw new Error(resJson.mensaje || 'Error al vincular la tarjeta NFC');
      }

      setAviso(resJson.mensaje || 'Tarjeta NFC vinculada exitosamente');
      setTipoAviso('exito');
      setUsuarioAVincular(null);
      await cargarUsuarios(busqueda);
    } catch (err) {
      setErrorUid(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleDesvincular = async () => {
    if (!usuarioADesvincular) return;
    setGuardando(true);
    try {
      const sesion = leerSesion();
      const token = sesion?.acceso;
      const respuesta = await fetch(`/api/admin/tarjetas/${usuarioADesvincular.usuarioId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const resJson = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        if (resJson.error === 'desvincular_con_viaje') {
          throw new Error('No se puede desvincular la tarjeta mientras el usuario tenga un viaje en curso activo');
        }
        throw new Error(resJson.mensaje || 'Error al desvincular la tarjeta');
      }

      setAviso(resJson.mensaje || 'Tarjeta NFC desvinculada exitosamente');
      setTipoAviso('exito');
      setUsuarioADesvincular(null);
      await cargarUsuarios(busqueda);
    } catch (err) {
      setAviso(err.message);
      setTipoAviso('error');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <AdminLayout itemActivo="Tarjetas NFC">
      <div>
        <AdminEncabezado
          etiqueta="Administración / Hardware & Accesos"
          titulo="Gestión de Tarjetas NFC"
          subtitulo="Vinculación de tarjetas físicas al perfil de usuarios mediante UID hexadecimal y desvinculación controlada."
          icono={<IconoNfc />}
          acciones={
            <span className="insignia insignia--activa" style={{ height: '2.5rem', padding: '0 var(--espacio-4)', fontWeight: 700 }}>
              {usuarios.filter((u) => u.estadoTarjeta === 'ACTIVA').length} tarjetas activas
            </span>
          }
        />

        {aviso && (
          <div style={{ marginBottom: 'var(--espacio-4)' }}>
            <Aviso mensaje={aviso} onCerrar={() => setAviso('')} />
          </div>
        )}

        <form onSubmit={handleBuscar} className={styles.barraBusqueda}>
          <input
            type="search"
            className={`input ${styles.inputBuscador}`}
            placeholder="Buscar por nombre, correo, ID o tarjeta..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar usuario"
          />
          <button type="submit" className="boton boton--secundario" disabled={cargando}>
            Buscar
          </button>
          {busqueda && (
            <button
              type="button"
              className="boton boton--secundario"
              onClick={() => {
                setBusqueda('');
                cargarUsuarios('');
              }}
            >
              Limpiar
            </button>
          )}
        </form>

        <section className="tarjeta" aria-label="Listado de usuarios y tarjetas" style={{ padding: 0, overflow: 'hidden' }}>
          <div className={`tabla ${styles.tablaContenedor} ${styles.tablaTarjetas}`}>
            <table>
              <thead>
                <tr>
                  <th className={styles.colId}>ID</th>
                  <th className={styles.colUsuario}>Usuario</th>
                  <th className={styles.colCorreo}>Correo</th>
                  <th className={styles.colEstado}>Estado Tarjeta</th>
                  <th className={styles.colDigitos}>Últimos Dígitos</th>
                  <th className={styles.colAcciones}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--espacio-6)' }}>
                      {cargando ? 'Cargando usuarios...' : 'No se encontraron usuarios registrados'}
                    </td>
                  </tr>
                ) : (
                  usuarios.map((u) => {
                    const tieneTarjeta = u.estadoTarjeta !== 'SIN VINCULAR';
                    const esActiva = u.estadoTarjeta === 'ACTIVA';

                    return (
                      <tr key={u.usuarioId}>
                        <td className={styles.colId} style={{ fontWeight: 600 }}>#{u.usuarioId}</td>
                        <td className={styles.colUsuario} title={u.nombreCompleto}>{u.nombreCompleto || 'Sin nombre'}</td>
                        <td className={styles.colCorreo} title={u.correo}>{u.correo}</td>
                        <td className={styles.colEstado}>
                          {tieneTarjeta ? (
                            <span
                              className={`insignia ${esActiva ? 'insignia--activa' : 'insignia--inactiva'}`}
                            >
                              {esActiva ? 'ACTIVA' : 'BLOQUEADA'}
                            </span>
                          ) : (
                            <span className="insignia" style={{ opacity: 0.6 }}>
                              SIN VINCULAR
                            </span>
                          )}
                        </td>
                        <td className={styles.colDigitos}>
                          {u.ultimosDigitos ? (
                            <span className={styles.tarjetaNfcBadge}>•••• {u.ultimosDigitos}</span>
                          ) : (
                            <span style={{ opacity: 0.5 }}>—</span>
                          )}
                        </td>
                        <td className={styles.colAcciones}>
                          <div className={styles.accionesCelda}>
                            {tieneTarjeta ? (
                              <button
                                type="button"
                                className={`boton boton--secundario ${styles.botonAccion}`}
                                onClick={() => setUsuarioADesvincular(u)}
                                title="Desvincular tarjeta física"
                              >
                                Desvincular
                              </button>
                            ) : (
                              <button
                                type="button"
                                className={`boton boton--primario ${styles.botonAccion}`}
                                onClick={() => abrirModalVincular(u)}
                                title="Vincular nueva tarjeta NFC"
                              >
                                Vincular
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Modal de Vinculación */}
        {usuarioAVincular && (
          <div className={styles.modalFondo} role="dialog" aria-modal="true">
            <div className={styles.modalCaja}>
              <h2 className={styles.modalTitulo}>Vincular Tarjeta NFC</h2>
              <p className={styles.modalTexto}>
                Asignando tarjeta física para: <strong>{usuarioAVincular.nombreCompleto}</strong> (
                {usuarioAVincular.correo})
              </p>

              <form onSubmit={handleVincular} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--espacio-3)' }}>
                <div className="campo">
                  <label htmlFor="uid-tarjeta" style={{ fontWeight: 600, fontSize: 'var(--texto-s)' }}>
                    UID Hexadecimal de la Tarjeta NFC *
                  </label>
                  <input
                    id="uid-tarjeta"
                    type="text"
                    className="input"
                    placeholder="Ej. A1B2C3D4 o 045A9B8C"
                    value={uidInput}
                    onChange={(e) => setUidInput(e.target.value.toUpperCase())}
                    maxLength={32}
                    autoFocus
                    required
                  />
                  <small style={{ fontSize: 'var(--texto-xs)', opacity: 0.7 }}>
                    Ingrese de 4 a 32 caracteres hexadecimales (0-9, A-F) obtenidos del lector o tótem.
                  </small>
                </div>

                {errorUid && (
                  <p className="mensaje-error" role="alert" style={{ margin: 0 }}>
                    {errorUid}
                  </p>
                )}

                <div className={styles.modalAcciones}>
                  <button
                    type="button"
                    className="boton boton--secundario"
                    onClick={() => setUsuarioAVincular(null)}
                    disabled={guardando}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="boton boton--primario"
                    disabled={guardando}
                  >
                    {guardando ? 'Vinculando...' : 'Confirmar y Vincular'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Desvinculación */}
        {usuarioADesvincular && (
          <div className={styles.modalFondo} role="dialog" aria-modal="true">
            <div className={styles.modalCaja}>
              <h2 className={styles.modalTitulo}>Confirmar Desvinculación</h2>
              <p className={styles.modalTexto}>
                ¿Está seguro de desvincular la tarjeta NFC actual de <strong>{usuarioADesvincular.nombreCompleto}</strong>?
              </p>
              <p style={{ fontSize: 'var(--texto-xs)', opacity: 0.8, margin: 0 }}>
                La tarjeta pasará a estado <strong>SIN VINCULAR</strong>. Si el usuario cuenta con un plan vigente, este no se cancelará pero el usuario requerirá una nueva tarjeta física para desbloquear bicicletas.
              </p>

              <div className={styles.modalAcciones}>
                <button
                  type="button"
                  className="boton boton--secundario"
                  onClick={() => setUsuarioADesvincular(null)}
                  disabled={guardando}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="boton boton--primario"
                  onClick={handleDesvincular}
                  disabled={guardando}
                >
                  {guardando ? 'Desvinculando...' : 'Sí, Desvincular'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default TarjetasPage;

