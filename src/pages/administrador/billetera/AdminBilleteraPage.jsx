import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout/AdminLayout.jsx';
import AdminEncabezado from '../components/AdminEncabezado.jsx';
import { IconoBilletera } from '../../../components/Iconos/Iconos.jsx';
import Aviso from '../../../components/Avisos/Aviso.jsx';
import { pedirAutenticado } from '../../../utils/auth.js';
import { textoError } from '../../../utils/mensajesError.js';
import { leerSesion } from '../../../utils/sesion.js';
import { formatearPesos } from '../../usuario/formato.js';
import styles from './AdminBilleteraPage.module.css';

const RECARGA_MINIMA = 100;
const RECARGA_MAXIMA = 500000;
const SALDO_MAXIMO = 2000000;

const SUGERIDOS = [
  { valor: 10000, detalle: 'Básica' },
  { valor: 20000, detalle: 'Frecuente' },
  { valor: 32000, detalle: 'Plan Mensual' },
  { valor: 50000, detalle: 'Larga duración' },
];

function AdminBilleteraPage() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);
  const [aviso, setAviso] = useState('');
  const [tipoAviso, setTipoAviso] = useState('info');

  // Estado del modal de recarga
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [saldoUsuario, setSaldoUsuario] = useState(0);
  const [cargandoSaldo, setCargandoSaldo] = useState(false);
  const [montoTexto, setMontoTexto] = useState('');
  const [errorMonto, setErrorMonto] = useState('');
  const [procesandoRecarga, setProcesandoRecarga] = useState(false);

  const peticionIdRef = useRef(0);
  const primeraCargaRef = useRef(true);

  const cargarCuentas = async (termino = '') => {
    const miPeticionId = ++peticionIdRef.current;
    setCargando(true);
    try {
      const query = termino ? `?busqueda=${encodeURIComponent(termino)}` : '';
      const datos = await pedirAutenticado(`/admin/cuentas${query}`);
      if (miPeticionId === peticionIdRef.current) {
        setUsuarios(datos.usuarios || []);
      }
    } catch (err) {
      if (miPeticionId !== peticionIdRef.current) return;
      if (err.status === 401 || err.status === 403) {
        navigate('/login');
        return;
      }
      setAviso(textoError(err) || 'No se pudo conectar con el servidor');
      setTipoAviso('error');
    } finally {
      if (miPeticionId === peticionIdRef.current) {
        setCargando(false);
      }
    }
  };

  useEffect(() => {
    if (primeraCargaRef.current) {
      primeraCargaRef.current = false;
      cargarCuentas('');
      return;
    }

    const termino = busqueda.trim();
    if (!termino) {
      // Si el campo quedó vacío (por ejemplo al borrar con backspace), ya se manejó de inmediato en manejarCambioBusqueda
      return;
    }

    const timer = setTimeout(() => {
      cargarCuentas(termino);
    }, 250);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda]);

  const manejarCambioBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    if (!valor.trim()) {
      cargarCuentas('');
    }
  };

  const limpiarBusqueda = () => {
    setBusqueda('');
    cargarCuentas('');
  };

  const abrirModalRecarga = async (usr) => {
    setUsuarioSeleccionado(usr);
    setMontoTexto('');
    setErrorMonto('');
    setCargandoSaldo(true);
    try {
      const datos = await pedirAutenticado(`/admin/cuentas/${usr.id}/billetera`);
      setSaldoUsuario(datos?.saldo ?? 0);
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        navigate('/login');
        return;
      }
      setSaldoUsuario(0);
    } finally {
      setCargandoSaldo(false);
    }
  };

  const cerrarModal = () => {
    setUsuarioSeleccionado(null);
    setMontoTexto('');
    setErrorMonto('');
  };

  const handleRecargar = async (e) => {
    e.preventDefault();
    setErrorMonto('');

    // Verificar si la sesión activa del navegador sigue siendo Administrador
    const sesionActual = leerSesion();
    if (sesionActual?.usuario?.rol !== 'ADMINISTRADOR') {
      setErrorMonto(
        'Tu sesión en este navegador cambió o no tiene rol de Administrador (posiblemente iniciaste sesión como usuario en otra pestaña). Inicia sesión nuevamente como Administrador.'
      );
      return;
    }

    const montoNum = Number(montoTexto);
    if (!/^\d+$/.test(montoTexto) || montoNum < RECARGA_MINIMA || montoNum > RECARGA_MAXIMA) {
      setErrorMonto(`El monto debe estar entre ${formatearPesos(RECARGA_MINIMA)} y ${formatearPesos(RECARGA_MAXIMA)} COP`);
      return;
    }

    if (saldoUsuario + montoNum > SALDO_MAXIMO) {
      setErrorMonto(`La recarga supera el saldo máximo permitido de ${formatearPesos(SALDO_MAXIMO)} COP`);
      return;
    }

    setProcesandoRecarga(true);
    try {
      const resJson = await pedirAutenticado(`/admin/cuentas/${usuarioSeleccionado.id}/recargar`, {
        metodo: 'POST',
        cuerpo: { monto: montoNum },
      });

      setAviso(
        `✓ Recarga exitosa para ${usuarioSeleccionado.nombreCompleto}: +${formatearPesos(montoNum)} COP. Nuevo saldo: ${formatearPesos(resJson.nuevoSaldo)} COP.`
      );
      setTipoAviso('exito');
      cerrarModal();
      await cargarCuentas(busqueda.trim());
    } catch (err) {
      if (err.status === 401 || err.status === 403 || err.codigo === 'sin_permisos') {
        setErrorMonto('No tienes permisos de Administrador o tu sesión expiró. Vuelve a iniciar sesión.');
      } else {
        setErrorMonto(textoError(err) || err.message || 'Error al procesar la recarga en taquilla');
      }
    } finally {
      setProcesandoRecarga(false);
    }
  };

  return (
    <AdminLayout itemActivo="Billetera">
      <div className={styles.raiz}>
        <AdminEncabezado
          etiqueta="Administración / Taquilla & Finanzas"
          titulo="Billetera & Recarga en Taquilla"
          subtitulo="Punto de atención presencial: busca a un usuario ciudadano y abona saldo a su billetera en tiempo real."
          icono={<IconoBilletera />}
          acciones={
            <span
              className="insignia insignia--activa"
              style={{ height: '2.5rem', padding: '0 var(--espacio-4)', fontWeight: 700 }}
            >
              {busqueda.trim()
                ? `${usuarios.length} ${usuarios.length === 1 ? 'coincidencia' : 'coincidencias'}`
                : `${usuarios.length} cuentas registradas`}
            </span>
          }
        />

        <div className={styles.barraAcciones}>
          <form
            className={styles.formularioBusqueda}
            onSubmit={(e) => {
              e.preventDefault();
              cargarCuentas(busqueda.trim());
            }}
          >
            <div className={styles.contenedorInputBusqueda}>
              <input
                type="text"
                className={`input ${styles.inputBusqueda}`}
                placeholder="Buscar por nombre o correo electrónico..."
                value={busqueda}
                onChange={manejarCambioBusqueda}
              />
              {busqueda && (
                <button
                  type="button"
                  className={styles.botonLimpiarInput}
                  onClick={limpiarBusqueda}
                  aria-label="Borrar búsqueda"
                  title="Borrar búsqueda y restaurar lista"
                >
                  ✕
                </button>
              )}
            </div>
            <button type="submit" className={styles.botonBuscar} disabled={cargando}>
              {cargando ? 'Buscando...' : 'Buscar cuenta'}
            </button>
            {busqueda && (
              <button
                type="button"
                className={styles.botonRestablecer}
                onClick={limpiarBusqueda}
                title="Mostrar todas las cuentas registradas"
              >
                Ver todas
              </button>
            )}
          </form>
        </div>

        <div className={styles.contenedorTabla}>
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre completo</th>
                <th>Correo electrónico</th>
                <th>Rol</th>
                <th>Tarjeta NFC</th>
                <th style={{ textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--espacio-6)' }}>
                    {cargando
                      ? 'Consultando cuentas de usuario...'
                      : busqueda.trim()
                      ? `No se encontraron cuentas que coincidan con "${busqueda.trim()}".`
                      : 'No hay cuentas de usuario registradas.'}
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => {
                  const tieneTarjeta = Boolean(u.tarjeta);
                  return (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 700 }}>#{u.id}</td>
                      <td style={{ fontWeight: 600 }}>{u.nombreCompleto || 'Sin registrar'}</td>
                      <td>{u.correo}</td>
                      <td>
                        <span
                          className={`insignia ${u.rol === 'ADMINISTRADOR' ? 'insignia--activa' : ''}`}
                          style={{ fontSize: '11px' }}
                        >
                          {u.rol}
                        </span>
                      </td>
                      <td>
                        {tieneTarjeta ? (
                          <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                            •••• {u.tarjeta.ultimosDigitos}
                          </span>
                        ) : (
                          <span style={{ opacity: 0.5, fontSize: 'var(--texto-xs)' }}>Sin vincular</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className={styles.botonRecargar}
                          onClick={() => abrirModalRecarga(u)}
                          title={`Recargar saldo en taquilla a ${u.nombreCompleto}`}
                        >
                          <IconoBilletera /> Recargar saldo
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Modal interactivo de Recarga en Taquilla */}
        {usuarioSeleccionado && (
          <div className={styles.modalFondo} onClick={cerrarModal}>
            <div className={styles.modalTarjeta} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalCabecera}>
                <h2 className={styles.modalTitulo}>Recargar Saldo en Taquilla</h2>
                <button
                  type="button"
                  className={styles.modalCerrar}
                  onClick={cerrarModal}
                  aria-label="Cerrar ventana"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleRecargar}>
                <div className={styles.modalCuerpo}>
                  <div className={styles.infoUsuario}>
                    <p className={styles.infoNombre}>{usuarioSeleccionado.nombreCompleto}</p>
                    <p className={styles.infoDetalle}>
                      {usuarioSeleccionado.correo} · ID #{usuarioSeleccionado.id}
                    </p>
                    <div className={styles.saldoActualBox}>
                      <span>Saldo actual en billetera:</span>
                      <strong>
                        {cargandoSaldo ? 'Consultando...' : `${formatearPesos(saldoUsuario)} COP`}
                      </strong>
                    </div>
                  </div>

                  <p style={{ fontSize: 'var(--texto-xs)', fontWeight: 600, color: 'var(--color-texto-suave)' }}>
                    Montos sugeridos de selección rápida:
                  </p>
                  <div className={styles.grillaSugeridos}>
                    {SUGERIDOS.map((sug) => {
                      const activo = Number(montoTexto) === sug.valor;
                      return (
                        <button
                          key={sug.valor}
                          type="button"
                          className={`${styles.botonSugerido} ${activo ? styles.sugeridoActivo : ''}`}
                          onClick={() => {
                            setMontoTexto(String(sug.valor));
                            setErrorMonto('');
                          }}
                        >
                          <span>+{formatearPesos(sug.valor)} COP</span>
                          <span className={styles.sugeridoSub}>{sug.detalle}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className={styles.campoMonto}>
                    <label htmlFor="monto-taquilla" style={{ fontSize: 'var(--texto-xs)', fontWeight: 600 }}>
                      O escribe el monto a abonar (COP):
                    </label>
                    <div className={styles.inputMontoWrapper}>
                      <span className={styles.prefijoMonto}>$</span>
                      <input
                        id="monto-taquilla"
                        type="text"
                        inputMode="numeric"
                        className={styles.inputMonto}
                        placeholder="Ej. 20000"
                        value={montoTexto}
                        onChange={(e) => {
                          setMontoTexto(e.target.value.replace(/\D/g, ''));
                          setErrorMonto('');
                        }}
                      />
                      <span className={styles.sufijoMonto}>COP</span>
                    </div>
                  </div>

                  <p className={styles.ayudaLimites}>
                    • Mínimo por recarga: {formatearPesos(RECARGA_MINIMA)} COP.<br />
                    • Máximo por operación: {formatearPesos(RECARGA_MAXIMA)} COP.<br />
                    • Techo máximo acumulable en billetera: {formatearPesos(SALDO_MAXIMO)} COP.
                  </p>

                  {errorMonto && (
                    <p className="mensaje-error" role="alert">
                      {errorMonto}
                    </p>
                  )}
                </div>

                <div className={styles.modalPie}>
                  <button
                    type="button"
                    className={styles.botonCancelar}
                    onClick={cerrarModal}
                    disabled={procesandoRecarga}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={styles.botonConfirmar}
                    disabled={procesandoRecarga || !montoTexto}
                  >
                    {procesandoRecarga ? 'Acreditando saldo...' : 'Confirmar recarga en taquilla'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <Aviso mensaje={aviso} tipo={tipoAviso} onCerrar={() => setAviso('')} />
      </div>
    </AdminLayout>
  );
}

export default AdminBilleteraPage;
