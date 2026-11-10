import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout/AdminLayout.jsx';
import AdminEncabezado from '../components/AdminEncabezado.jsx';
import { IconoUsuario } from '../../../components/Iconos/Iconos.jsx';
import Aviso from '../../../components/Avisos/Aviso.jsx';
import { leerSesion } from '../../../utils/sesion.js';
import styles from './CuentasPage.module.css';

function CuentasPage() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);
  const [aviso, setAviso] = useState('');

  const [usuarioAInactivar, setUsuarioAInactivar] = useState(null);
  const [usuarioAReactivar, setUsuarioAReactivar] = useState(null);
  const [procesando, setProcesando] = useState(false);

  const sesionActual = leerSesion();
  const idAdminActual = sesionActual?.usuario?.id;

  const cargarCuentas = async (termino = '') => {
    setCargando(true);
    try {
      const token = sesionActual?.acceso;
      const query = termino ? `?busqueda=${encodeURIComponent(termino)}` : '';
      const respuesta = await fetch(`/api/admin/cuentas${query}`, {
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
        throw new Error('Error al cargar las cuentas de usuario');
      }

      const datos = await respuesta.json();
      setUsuarios(datos.usuarios || []);
    } catch (error) {
      console.error(error);
      setAviso('No se pudo conectar con el servidor para obtener las cuentas');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCuentas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    cargarCuentas(busqueda);
  };

  const handleInactivar = async () => {
    if (!usuarioAInactivar) return;
    setProcesando(true);
    try {
      const token = sesionActual?.acceso;
      const respuesta = await fetch(`/api/admin/cuentas/${usuarioAInactivar.id}/inactivar`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const resJson = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        if (resJson.error === 'no_inactivar_propia_cuenta') {
          throw new Error('No es posible inactivar la propia cuenta de administrador en sesión');
        }
        if (resJson.error === 'inactivar_con_viaje') {
          throw new Error('No se puede inactivar la cuenta: el usuario tiene un viaje en curso activo');
        }
        throw new Error(resJson.mensaje || 'Error al inactivar la cuenta');
      }

      setAviso(resJson.mensaje || 'Cuenta de usuario inactivada correctamente');
      setUsuarioAInactivar(null);
      await cargarCuentas(busqueda);
    } catch (err) {
      setAviso(err.message);
    } finally {
      setProcesando(false);
    }
  };

  const handleReactivar = async () => {
    if (!usuarioAReactivar) return;
    setProcesando(true);
    try {
      const token = sesionActual?.acceso;
      const respuesta = await fetch(`/api/admin/cuentas/${usuarioAReactivar.id}/reactivar`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const resJson = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(resJson.mensaje || 'Error al reactivar la cuenta');
      }

      setAviso(resJson.mensaje || 'Cuenta de usuario reactivada correctamente');
      setUsuarioAReactivar(null);
      await cargarCuentas(busqueda);
    } catch (err) {
      setAviso(err.message);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <AdminLayout itemActivo="Cuentas">
      <div className={styles.raiz}>
        <AdminEncabezado
          etiqueta="Administración / Perfiles & Accesos"
          titulo="Gestión de Cuentas de Usuario"
          subtitulo="Control de perfiles registrados, estado operativo y alternancia de acceso al sistema (HU_21)."
          icono={<IconoUsuario />}
          acciones={
            <span className="insignia insignia--activa" style={{ height: '2.5rem', padding: '0 var(--espacio-4)', fontWeight: 700 }}>
              {usuarios.length} cuentas registradas
            </span>
          }
        />

        {aviso && (
          <div>
            <Aviso mensaje={aviso} onCerrar={() => setAviso('')} />
          </div>
        )}

        <form onSubmit={handleBuscar} className={styles.barraBusqueda}>
          <input
            type="search"
            className={`input ${styles.inputBuscador}`}
            placeholder="Buscar por correo o nombre completo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar cuenta de usuario"
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
                cargarCuentas('');
              }}
            >
              Limpiar
            </button>
          )}
        </form>

        <section className="tarjeta" aria-label="Listado de cuentas" style={{ padding: 0, overflow: 'hidden' }}>
          <div className={`tabla ${styles.tablaContenedor} ${styles.tablaCuentas}`}>
            <table>
              <thead>
                <tr>
                  <th className={styles.colId}>ID</th>
                  <th className={styles.colNombre}>Nombre Completo</th>
                  <th className={styles.colCorreo}>Correo Electrónico</th>
                  <th className={styles.colRol}>Rol</th>
                  <th className={styles.colTelefono}>Teléfono</th>
                  <th className={styles.colTarjeta}>Tarjeta NFC</th>
                  <th className={styles.colAcceso}>Último Acceso</th>
                  <th className={styles.colAcciones}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: 'var(--espacio-6)' }}>
                      {cargando ? 'Cargando cuentas...' : 'No se encontraron cuentas de usuario'}
                    </td>
                  </tr>
                ) : (
                  usuarios.map((u) => {
                    const esAdmin = u.rol === 'ADMINISTRADOR';
                    const esPropiaCuenta = Number(u.id) === Number(idAdminActual);
                    const tieneTarjeta = Boolean(u.tarjeta);

                    return (
                      <tr key={u.id}>
                        <td className={styles.colId} style={{ fontWeight: 700 }}>#{u.id}</td>
                        <td className={styles.colNombre} style={{ fontWeight: 600 }} title={u.nombreCompleto}>
                          {u.nombreCompleto || 'Sin registrar'}
                          {esPropiaCuenta && (
                            <span
                              className="insignia insignia--activa"
                              style={{ marginLeft: 'var(--espacio-2)', fontSize: '10px' }}
                            >
                              TÚ
                            </span>
                          )}
                        </td>
                        <td className={styles.colCorreo} title={u.correo}>
                          {u.correo}
                        </td>
                        <td className={styles.colRol}>
                          <span
                            className={`insignia ${esAdmin ? 'insignia--activa' : ''}`}
                            style={{
                              backgroundColor: esAdmin ? 'var(--color-primario)' : 'var(--color-input-fondo)',
                              color: 'var(--color-texto)',
                            }}
                          >
                            {u.rol}
                          </span>
                        </td>
                        <td className={styles.colTelefono} style={{ fontSize: 'var(--texto-s)' }}>
                          {u.telefono || '—'}
                        </td>
                        <td className={styles.colTarjeta}>
                          {tieneTarjeta ? (
                            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                              •••• {u.tarjeta.ultimosDigitos}
                            </span>
                          ) : (
                            <span style={{ opacity: 0.5, fontSize: 'var(--texto-xs)' }}>Sin vincular</span>
                          )}
                        </td>
                        <td className={styles.colAcceso} style={{ fontSize: 'var(--texto-xs)', opacity: 0.8 }}>
                          {u.ultimoAcceso?.slice(0, 16) || 'Sin accesos'}
                        </td>
                        <td className={styles.colAcciones}>
                          <div className={styles.accionesCelda}>
                            {esPropiaCuenta ? (
                              <span style={{ fontSize: 'var(--texto-xs)', opacity: 0.6 }}>
                                Cuenta actual
                              </span>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className={`boton boton--secundario ${styles.botonAccion}`}
                                  onClick={() => setUsuarioAInactivar(u)}
                                  title="Inactivar el acceso de este usuario"
                                >
                                  Inactivar
                                </button>
                                <button
                                  type="button"
                                  className={`boton boton--primario ${styles.botonAccion}`}
                                  onClick={() => setUsuarioAReactivar(u)}
                                  title="Reactivar el acceso de este usuario"
                                >
                                  Reactivar
                                </button>
                              </>
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

        {/* Modal de Confirmación para Inactivar Cuenta */}
        {usuarioAInactivar && (
          <div className={styles.modalFondo} role="dialog" aria-modal="true">
            <div className={styles.modalCaja}>
              <h2 className={styles.modalTitulo}>Inactivar Cuenta de Usuario</h2>
              <p className={styles.modalTexto}>
                ¿Está seguro de inactivar la cuenta de <strong>{usuarioAInactivar.nombreCompleto}</strong> ({usuarioAInactivar.correo})?
              </p>
              <p style={{ fontSize: 'var(--texto-xs)', opacity: 0.8, margin: 0 }}>
                Una vez inactivada, el usuario no podrá iniciar sesión en la plataforma ni retirar bicicletas de las estaciones de Tunja.
              </p>

              <div className={styles.modalAcciones}>
                <button
                  type="button"
                  className="boton boton--secundario"
                  onClick={() => setUsuarioAInactivar(null)}
                  disabled={procesando}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="boton boton--primario"
                  onClick={handleInactivar}
                  disabled={procesando}
                >
                  {procesando ? 'Inactivando...' : 'Sí, Inactivar Cuenta'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmación para Reactivar Cuenta */}
        {usuarioAReactivar && (
          <div className={styles.modalFondo} role="dialog" aria-modal="true">
            <div className={styles.modalCaja}>
              <h2 className={styles.modalTitulo}>Reactivar Cuenta de Usuario</h2>
              <p className={styles.modalTexto}>
                ¿Desea reactivar la cuenta de <strong>{usuarioAReactivar.nombreCompleto}</strong> ({usuarioAReactivar.correo})?
              </p>
              <p style={{ fontSize: 'var(--texto-xs)', opacity: 0.8, margin: 0 }}>
                El usuario volverá a tener acceso a iniciar sesión en StationBike y a utilizar su billetera y suscripciones.
              </p>

              <div className={styles.modalAcciones}>
                <button
                  type="button"
                  className="boton boton--secundario"
                  onClick={() => setUsuarioAReactivar(null)}
                  disabled={procesando}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="boton boton--primario"
                  onClick={handleReactivar}
                  disabled={procesando}
                >
                  {procesando ? 'Reactivando...' : 'Sí, Reactivar Cuenta'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default CuentasPage;

