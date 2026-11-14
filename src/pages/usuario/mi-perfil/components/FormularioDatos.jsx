import { useState } from 'react';
import BarraProgreso from '../../../../components/BarraProgreso/BarraProgreso.jsx';
import { IconoCandado, IconoCheck, IconoOjo } from '../../../../components/Iconos/Iconos.jsx';
import AvatarCiclista from '../../../../components/AvataresCiclistas/AvatarCiclista.jsx';
import ModalSelectorAvatar from '../../../../components/AvataresCiclistas/ModalSelectorAvatar.jsx';
import { useUsuario } from '../../context/UsuarioContext.jsx';
import { formatearFechaCorta } from '../../formato.js';
import { mensajeError } from '../../../../utils/mensajeError.js';
import styles from './FormularioDatos.module.css';

const LONGITUD_MINIMA = 8;

// Edad cumplida a partir de "YYYY-MM-DD" (fecha sin hora: no se convierte de zona horaria)
function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return null;
  const [anio, mes, dia] = fechaNacimiento.split('-').map(Number);
  const hoy = new Date();
  let edad = hoy.getFullYear() - anio;
  if (hoy.getMonth() + 1 < mes || (hoy.getMonth() + 1 === mes && hoy.getDate() < dia)) edad -= 1;
  return edad;
}

// Formulario del perfil (HU_1): nombre y teléfono editables, correo y nacimiento de solo lectura,
// y cambio de contraseña. Los campos viven aquí; el envío lo hace la página con onGuardar.
function FormularioDatos({ perfil, onGuardar, onCancelar }) {
  const { cambiarAvatar } = useUsuario();
  const [modalAvatarAbierto, setModalAvatarAbierto] = useState(false);
  const [nombre, setNombre] = useState(perfil.nombreCompleto ?? '');
  const [telefono, setTelefono] = useState(perfil.telefono ?? '');
  const [claveActual, setClaveActual] = useState('');
  const [claveNueva, setClaveNueva] = useState('');
  const [mostrarActual, setMostrarActual] = useState(false);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const limpiarAvisos = () => {
    if (error) setError('');
    if (mensajeExito) setMensajeExito('');
  };

  const guardar = async (evento) => {
    evento.preventDefault();
    setGuardando(true);
    setError('');
    setMensajeExito('');

    const datos = { nombreCompleto: nombre, telefono };
    if (claveNueva) {
      datos.contrasenaActual = claveActual;
      datos.nuevaContrasena = claveNueva;
    }

    try {
      const res = await onGuardar(datos);
      setClaveActual('');
      setClaveNueva('');
      setMensajeExito(res?.mensaje || 'PERFIL ACTUALIZADO CORRECTAMENTE');
    } catch (errorApi) {
      setError(mensajeError(errorApi));
    } finally {
      setGuardando(false);
    }
  };

  // Vuelve a los valores que tiene guardados el servidor y cancela la edición
  const cancelar = () => {
    setNombre(perfil.nombreCompleto ?? '');
    setTelefono(perfil.telefono ?? '');
    setClaveActual('');
    setClaveNueva('');
    setError('');
    setMensajeExito('');
    if (onCancelar) onCancelar();
  };

  const longitud = claveNueva.length;
  const edad = calcularEdad(perfil.fechaNacimiento);

  return (
    <form className={`tarjeta ${styles.raiz}`} onSubmit={guardar}>
      <header className={styles.cabecera}>
        <div className={styles.bloqueCabeceraAvatar}>
          <button
            type="button"
            className={styles.botonAvatar}
            onClick={() => setModalAvatarAbierto(true)}
            title="Cambiar avatar ciclista"
            aria-label="Cambiar avatar ciclista"
          >
            <AvatarCiclista id={perfil.avatar || 'mujer-casco-1'} tamano="m" />
            <span className={styles.lapiz} aria-hidden="true">
              ✎
            </span>
          </button>
          <div className={styles.textoCabecera}>
            <h2 className={styles.titulo}>Datos de usuario</h2>
            <p className={styles.subtitulo}>Información de contacto y credenciales de acceso</p>
          </div>
        </div>
      </header>

      <div className={styles.rejilla}>
        <div className="campo">
          <label htmlFor="perfil-nombre">Nombre completo</label>
          <input
            id="perfil-nombre"
            className="input"
            value={nombre}
            onChange={(e) => {
              limpiarAvisos();
              setNombre(e.target.value);
            }}
            autoComplete="name"
          />
        </div>

        <div className="campo">
          <label htmlFor="perfil-telefono">Teléfono celular</label>
          <input
            id="perfil-telefono"
            className="input"
            type="tel"
            value={telefono}
            onChange={(e) => {
              limpiarAvisos();
              setTelefono(e.target.value);
            }}
            autoComplete="tel"
          />
        </div>

        <div className="campo">
          <div className={styles.filaCampo}>
            <label htmlFor="perfil-correo">Correo</label>
            <span className="insignia insignia--neutra">
              <IconoCandado /> Solo lectura
            </span>
          </div>
          <input id="perfil-correo" className={`input ${styles.soloLectura}`} value={perfil.correo ?? ''} readOnly />
        </div>

        <div className="campo">
          <div className={styles.filaCampo}>
            <label htmlFor="perfil-nacimiento">Fecha de nacimiento</label>
            <span className="insignia insignia--neutra">
              <IconoCandado /> Solo lectura
            </span>
          </div>
          <input
            id="perfil-nacimiento"
            className={`input ${styles.soloLectura}`}
            value={formatearFechaCorta(perfil.fechaNacimiento)}
            readOnly
          />
          {edad !== null && <p className={styles.ayuda}>Edad: {edad} años</p>}
        </div>
      </div>

      <div className={styles.seccion}>
        <div className={styles.cabeceraCredenciales}>
          <p className={styles.tituloCredenciales}>
            <IconoCandado /> Cambiar contraseña
          </p>
          <p className={styles.ayuda}>Déjala en blanco si no quieres cambiarla</p>
        </div>

        <div className={styles.rejilla}>
          <div className="campo">
            <label htmlFor="perfil-clave-actual">Contraseña actual</label>
            <div className={styles.conBoton}>
              <input
                id="perfil-clave-actual"
                type={mostrarActual ? 'text' : 'password'}
                className={`input ${styles.inputConBoton}`}
                value={claveActual}
                onChange={(e) => {
                  limpiarAvisos();
                  setClaveActual(e.target.value);
                }}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.botonOjo}
                aria-label={mostrarActual ? 'Ocultar contraseña actual' : 'Mostrar contraseña actual'}
                onClick={() => setMostrarActual(!mostrarActual)}
              >
                <IconoOjo />
              </button>
            </div>
            <p className={styles.ayuda}>Requerida únicamente para cambiar la contraseña</p>
          </div>

          <div className="campo">
            <label htmlFor="perfil-clave-nueva">Nueva contraseña</label>
            <div className={styles.conBoton}>
              <input
                id="perfil-clave-nueva"
                type={mostrarNueva ? 'text' : 'password'}
                className={`input ${styles.inputConBoton}`}
                placeholder={`Mínimo ${LONGITUD_MINIMA} caracteres, letras y números`}
                value={claveNueva}
                onChange={(e) => {
                  limpiarAvisos();
                  setClaveNueva(e.target.value);
                }}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.botonOjo}
                aria-label={mostrarNueva ? 'Ocultar nueva contraseña' : 'Mostrar nueva contraseña'}
                onClick={() => setMostrarNueva(!mostrarNueva)}
              >
                <IconoOjo />
              </button>
            </div>
            <div className={styles.fuerza}>
              <BarraProgreso
                valor={Math.min(longitud, LONGITUD_MINIMA)}
                maximo={LONGITUD_MINIMA}
                etiqueta="Longitud de la nueva contraseña"
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <p className="mensaje-error" role="alert">
          {error}
        </p>
      )}

      {mensajeExito && (
        <p className={styles.mensajeExito} role="status">
          <IconoCheck /> {mensajeExito}
        </p>
      )}

      <div className={styles.acciones}>
        <button type="submit" className={`boton boton--acento ${styles.guardar}`} disabled={guardando}>
          <IconoCheck /> {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <button type="button" className="boton" onClick={cancelar} disabled={guardando}>
          Cancelar
        </button>
      </div>

      <ModalSelectorAvatar
        abierto={modalAvatarAbierto}
        avatarActual={perfil.avatar || 'mujer-casco-1'}
        onCerrar={() => setModalAvatarAbierto(false)}
        onSeleccionar={cambiarAvatar}
      />
    </form>
  );
}

export default FormularioDatos;
