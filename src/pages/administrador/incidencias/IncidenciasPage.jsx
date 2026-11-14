import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout/AdminLayout.jsx';
import AdminEncabezado from '../components/AdminEncabezado.jsx';
import { IconoAlerta } from '../../../components/Iconos/Iconos.jsx';
import Aviso from '../../../components/Avisos/Aviso.jsx';
import { leerSesion } from '../../../utils/sesion.js';
import { formatearFechaBogota } from '../../../utils/formatoMoneda.js';
import styles from './IncidenciasPage.module.css';

const MAPA_TIPOS = {
  BICICLETA: 'Daño en Bicicleta',
  ANCLAJE: 'Falla en Estación/Anclaje',
  TARJETA: 'Tarjeta NFC perdida/dañada',
  OTRO: 'Otro reporte operativo',
};

function IncidenciasPage() {
  const navigate = useNavigate();
  const [incidencias, setIncidencias] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('TODAS');
  const [cargando, setCargando] = useState(false);
  const [aviso, setAviso] = useState('');

  // Modales
  const [incidenciaAAtender, setIncidenciaAAtender] = useState(null);
  const [observacionInput, setObservacionInput] = useState('');
  const [errorObservacion, setErrorObservacion] = useState('');
  const [guardando, setGuardando] = useState(false);

  const [incidenciaACerrar, setIncidenciaACerrar] = useState(null);

  const cargarIncidencias = async (estado = filtroEstado) => {
    setCargando(true);
    try {
      const sesion = leerSesion();
      const token = sesion?.acceso;
      const query = estado && estado !== 'TODAS' ? `?estado=${encodeURIComponent(estado)}` : '';
      const respuesta = await fetch(`/api/admin/incidencias${query}`, {
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
        throw new Error('Error al cargar la lista de incidencias');
      }

      const datos = await respuesta.json();
      setIncidencias(datos.incidencias || []);
    } catch (error) {
      console.error(error);
      setAviso('No se pudo conectar con el servidor para obtener las incidencias');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarIncidencias(filtroEstado);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroEstado]);

  const abrirModalAtender = (inc) => {
    setIncidenciaAAtender(inc);
    setObservacionInput(inc.observacionAdmin || inc.observacion || '');
    setErrorObservacion('');
  };

  const handleAtender = async (e) => {
    e.preventDefault();
    setErrorObservacion('');

    const obsLimpia = observacionInput.trim();
    if (!obsLimpia) {
      setErrorObservacion('La observación del administrador es obligatoria para atender la incidencia');
      return;
    }

    setGuardando(true);
    try {
      const sesion = leerSesion();
      const token = sesion?.acceso;
      const respuesta = await fetch(`/api/admin/incidencias/${incidenciaAAtender.id}/atender`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ observacion: obsLimpia }),
      });

      const resJson = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(resJson.mensaje || 'Error al atender la incidencia');
      }

      setAviso(resJson.mensaje || 'Incidencia atendida exitosamente');
      setIncidenciaAAtender(null);
      await cargarIncidencias(filtroEstado);
    } catch (err) {
      setErrorObservacion(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleCerrar = async () => {
    if (!incidenciaACerrar) return;
    setGuardando(true);
    try {
      const sesion = leerSesion();
      const token = sesion?.acceso;
      const respuesta = await fetch(`/api/admin/incidencias/${incidenciaACerrar.id}/cerrar`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const resJson = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        if (resJson.error === 'debe_atender_primero') {
          throw new Error('Debe atender la incidencia con una observación antes de poder cerrarla');
        }
        throw new Error(resJson.mensaje || 'Error al cerrar la incidencia');
      }

      setAviso(resJson.mensaje || 'Incidencia cerrada exitosamente');
      setIncidenciaACerrar(null);
      await cargarIncidencias(filtroEstado);
    } catch (err) {
      setAviso(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <AdminLayout itemActivo="Incidencias">
      <div className={styles.raiz}>
        <AdminEncabezado
          etiqueta="Administración / Soporte Técnico & Daños"
          titulo="Gestión de Incidencias"
          subtitulo="Supervisión, atención técnica obligatoria y cierre formal de fallas en bicicletas, estaciones y tarjetas."
          icono={<IconoAlerta />}
          acciones={
            <div className={styles.filtrosBarra} role="group" aria-label="Filtrar por estado">
              {['TODAS', 'ABIERTA', 'ATENDIDA', 'CERRADA'].map((estado) => (
                <button
                  key={estado}
                  type="button"
                  className={`${styles.filtroBoton} ${filtroEstado === estado ? styles.filtroActivo : ''}`}
                  onClick={() => setFiltroEstado(estado)}
                >
                  {estado}
                </button>
              ))}
            </div>
          }
        />

        {aviso && (
          <div>
            <Aviso mensaje={aviso} onCerrar={() => setAviso('')} />
          </div>
        )}

        <section className="tarjeta" aria-label="Listado de incidencias registradas" style={{ padding: 0, overflow: 'hidden' }}>
          <div className={`tabla ${styles.tablaContenedor} ${styles.tablaIncidencias}`}>
            <table>
              <thead>
                <tr>
                  <th className={styles.colId}>#ID</th>
                  <th className={styles.colTipo}>Tipo</th>
                  <th className={styles.colRecurso}>Recurso Afectado</th>
                  <th className={styles.colUsuario}>Reportado Por</th>
                  <th className={styles.colFecha}>Fecha</th>
                  <th className={styles.colEstado}>Estado</th>
                  <th className={styles.colDescripcion}>Descripción del Usuario</th>
                  <th className={styles.colObservacion}>Observación Admin</th>
                  <th className={styles.colAcciones}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {incidencias.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: 'var(--espacio-6)' }}>
                      {cargando ? 'Cargando incidencias...' : 'No hay incidencias registradas en este estado'}
                    </td>
                  </tr>
                ) : (
                  incidencias.map((inc) => {
                    const tipoTexto = MAPA_TIPOS[inc.tipo] || inc.tipo;
                    const recursoTexto = inc.codigoBicicleta
                      ? `Bicicleta #${inc.codigoBicicleta}`
                      : inc.nombreEstacion
                      ? `Estación ${inc.nombreEstacion}`
                      : inc.tipo === 'TARJETA'
                      ? 'Tarjeta NFC'
                      : 'Novedad general';

                    const esAbierta = inc.estado === 'ABIERTA';
                    const esAtendida = inc.estado === 'ATENDIDA';
                    const esCerrada = inc.estado === 'CERRADA';

                    return (
                      <tr key={inc.id}>
                        <td className={styles.colId} style={{ fontWeight: 700 }}>#{inc.id}</td>
                        <td className={styles.colTipo}>{tipoTexto}</td>
                        <td className={styles.colRecurso} style={{ fontWeight: 600 }}>{recursoTexto}</td>
                        <td className={styles.colUsuario} title={`${inc.reportadoPor || inc.nombreUsuario || ''} (${inc.correoUsuario || ''})`}>
                          <div>{inc.reportadoPor || inc.nombreUsuario || 'Usuario'}</div>
                          <small style={{ opacity: 0.7 }}>{inc.correoUsuario || ''}</small>
                        </td>
                        <td className={styles.colFecha} style={{ fontSize: 'var(--texto-xs)', opacity: 0.8 }}>
                          {formatearFechaBogota(inc.fechaCreacion || inc.creado) || '—'}
                        </td>
                        <td className={styles.colEstado}>
                          {esAbierta && (
                            <span className="insignia" style={{ backgroundColor: 'var(--color-etiqueta-amarilla)', color: 'var(--color-texto)' }}>
                              ABIERTA
                            </span>
                          )}
                          {esAtendida && (
                            <span className="insignia" style={{ backgroundColor: 'var(--color-etiqueta-menta)', color: 'var(--color-texto)' }}>
                              ATENDIDA
                            </span>
                          )}
                          {esCerrada && (
                            <span className="insignia insignia--inactiva">
                              CERRADA
                            </span>
                          )}
                        </td>
                        <td className={styles.colDescripcion}>
                          <div className={styles.descripcionTexto}>
                            {inc.descripcion}
                          </div>
                        </td>
                        <td className={styles.colObservacion}>
                          {(inc.observacionAdmin || inc.observacion) ? (
                            <div className={styles.observacionTexto}>
                              {inc.observacionAdmin || inc.observacion}
                            </div>
                          ) : (
                            <span style={{ opacity: 0.5, fontSize: 'var(--texto-xs)' }}>Sin atención</span>
                          )}
                        </td>
                        <td className={styles.colAcciones}>
                          <div style={{ display: 'flex', gap: 'var(--espacio-2)', justifyContent: 'flex-end', whiteSpace: 'nowrap' }}>
                            {esAbierta && (
                              <button
                                type="button"
                                className={`boton boton--primario ${styles.botonAccion}`}
                                onClick={() => abrirModalAtender(inc)}
                              >
                                Atender
                              </button>
                            )}
                            {esAtendida && (
                              <>
                                <button
                                  type="button"
                                  className={`boton boton--secundario ${styles.botonAccion}`}
                                  onClick={() => abrirModalAtender(inc)}
                                  title="Editar la observación de atención"
                                >
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  className={`boton boton--primario ${styles.botonAccion}`}
                                  onClick={() => setIncidenciaACerrar(inc)}
                                  title="Cerrar formalmente la incidencia"
                                >
                                  Cerrar
                                </button>
                              </>
                            )}
                            {esCerrada && (
                              <span style={{ fontSize: 'var(--texto-xs)', opacity: 0.6 }}>
                                Solucionada
                              </span>
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

        {/* Modal para Atender Incidencia */}
        {incidenciaAAtender && (
          <div className={styles.modalFondo} role="dialog" aria-modal="true">
            <div className={styles.modalCaja}>
              <h2 className={styles.modalTitulo}>Atender Incidencia #{incidenciaAAtender.id}</h2>
              <p className={styles.modalTexto}>
                <strong>Tipo:</strong> {MAPA_TIPOS[incidenciaAAtender.tipo] || incidenciaAAtender.tipo}
                <br />
                <strong>Reporte del usuario:</strong> {incidenciaAAtender.descripcion}
              </p>

              <form onSubmit={handleAtender} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--espacio-3)' }}>
                <div className="campo">
                  <label htmlFor="obs-incidencia" style={{ fontWeight: 600, fontSize: 'var(--texto-s)' }}>
                    Observación de Atención del Administrador *
                  </label>
                  <textarea
                    id="obs-incidencia"
                    className="input"
                    rows={4}
                    placeholder="Describa la acción técnica realizada, solución o diagnóstico..."
                    value={observacionInput}
                    onChange={(e) => setObservacionInput(e.target.value)}
                    autoFocus
                    required
                  />
                  <small style={{ fontSize: 'var(--texto-xs)', opacity: 0.7 }}>
                    La observación es obligatoria y quedará registrada en el historial de la incidencia.
                  </small>
                </div>

                {errorObservacion && (
                  <p className="mensaje-error" role="alert" style={{ margin: 0 }}>
                    {errorObservacion}
                  </p>
                )}

                <div className={styles.modalAcciones}>
                  <button
                    type="button"
                    className="boton boton--secundario"
                    onClick={() => setIncidenciaAAtender(null)}
                    disabled={guardando}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="boton boton--primario"
                    disabled={guardando}
                  >
                    {guardando ? 'Guardando...' : 'Guardar y Marcar Atendida'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Confirmación para Cerrar Incidencia */}
        {incidenciaACerrar && (
          <div className={styles.modalFondo} role="dialog" aria-modal="true">
            <div className={styles.modalCaja}>
              <h2 className={styles.modalTitulo}>Confirmar Cierre de Incidencia</h2>
              <p className={styles.modalTexto}>
                ¿Confirma que la incidencia <strong>#{incidenciaACerrar.id}</strong> ha sido resuelta en su totalidad?
              </p>
              <div style={{ backgroundColor: 'var(--color-input-fondo)', padding: 'var(--espacio-3)', borderRadius: 'var(--radio-s)' }}>
                <p style={{ margin: 0, fontSize: 'var(--texto-xs)', fontWeight: 600 }}>Observación registrada:</p>
                <p style={{ margin: 'var(--espacio-1) 0 0', fontSize: 'var(--texto-xs)', opacity: 0.9 }}>
                  {incidenciaACerrar.observacionAdmin || incidenciaACerrar.observacion || 'Sin observación previa'}
                </p>
              </div>
              <p style={{ fontSize: 'var(--texto-xs)', opacity: 0.8, margin: 0 }}>
                Una vez cerrada, la incidencia conservará su historial intacto y no podrá ser reabierta.
              </p>

              <div className={styles.modalAcciones}>
                <button
                  type="button"
                  className="boton boton--secundario"
                  onClick={() => setIncidenciaACerrar(null)}
                  disabled={guardando}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="boton boton--primario"
                  onClick={handleCerrar}
                  disabled={guardando}
                >
                  {guardando ? 'Cerrando...' : 'Sí, Cerrar Incidencia'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default IncidenciasPage;

