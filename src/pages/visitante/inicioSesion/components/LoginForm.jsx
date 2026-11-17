import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';
import { iniciarSesion } from '../../../../utils/auth.js';
import { validarLogin } from '../../../../utils/validaciones.js';
import { textoError } from '../../../../utils/mensajesError.js';
import { rutaInicio } from '../../../../utils/sesion.js';
import { IconoOjo } from '../../../../components/Iconos/Iconos.jsx';

function IconoOcultar() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ width: '1.25rem', height: '1.25rem' }}
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

function LoginForm() {
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const mensajeRegistro = ubicacion.state?.mensaje;

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  function limpiarError() {
    if (error) setError('');
  }

  async function enviar(evento) {
    evento.preventDefault();
    setError('');

    const errorLocal = validarLogin({ correo, contrasena });
    if (errorLocal) {
      setError(errorLocal);
      if (!correo.trim()) {
        document.getElementById('correo')?.focus();
      } else if (!contrasena.trim()) {
        document.getElementById('password')?.focus();
      }
      return;
    }

    setEnviando(true);
    try {
      const usuario = await iniciarSesion(correo.trim(), contrasena.trim());
      navegar(ubicacion.state?.desde ?? rutaInicio(usuario.rol), { replace: true });
    } catch (e) {
      console.error('Error al iniciar sesión:', e);
      setError(textoError(e));
      setEnviando(false);
    }
  }

  const esErrorCorreo = Boolean(error && (!correo.trim() || error.toLowerCase().includes('correo') || error.toLowerCase().includes('credenciales')));
  const esErrorContrasena = Boolean(error && (!contrasena.trim() || error.toLowerCase().includes('contraseña') || error.toLowerCase().includes('credenciales')));

  return (
    <form className={styles.raiz} onSubmit={enviar} noValidate>
      <h2 className={styles.titulo}>Iniciar sesión</h2>
      <p className={styles.subtitulo}>Ingresa con tu correo y contraseña</p>

      {mensajeRegistro && <p className={styles.mensajeExito} role="status">{mensajeRegistro}</p>}

      {error && (
        <div
          id="login-error"
          className="mensaje-error"
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--espacio-2)',
            marginBottom: 'var(--espacio-4)',
          }}
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError('')}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              fontSize: '1.25rem',
              lineHeight: 1,
              cursor: 'pointer',
              padding: '0 4px',
              opacity: 0.8,
            }}
            aria-label="Cerrar aviso de error"
          >
            ×
          </button>
        </div>
      )}

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="correo" className={styles.etiqueta}>Correo electrónico</label>
        <input
          id="correo"
          type="email"
          className={`input ${styles.entrada}`}
          placeholder="nombre@correo.com"
          value={correo}
          onChange={(e) => {
            limpiarError();
            setCorreo(e.target.value);
          }}
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={esErrorCorreo}
          aria-describedby={error ? "login-error" : undefined}
        />
      </div>

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="password" className={styles.etiqueta}>Contraseña</label>
        <div className={styles.control}>
          <input
            id="password"
            type={mostrarContrasena ? 'text' : 'password'}
            className={`input ${styles.entrada} ${styles.conOjo}`}
            placeholder="Tu contraseña"
            value={contrasena}
            onChange={(e) => {
              limpiarError();
              setContrasena(e.target.value);
            }}
            autoComplete="current-password"
            required
            aria-required="true"
            aria-invalid={esErrorContrasena}
            aria-describedby={error ? "login-error" : undefined}
          />
          <button
            type="button"
            className={styles.ojo}
            aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onClick={() => setMostrarContrasena(!mostrarContrasena)}
          >
            {mostrarContrasena ? <IconoOcultar /> : <IconoOjo />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className={`boton boton--primario boton--bloque ${styles.accion}`}
        disabled={enviando}
      >
        {enviando ? 'Ingresando…' : 'Ingresar'}
      </button>

      <p className={styles.alterno}>
        ¿Primera vez? <Link to="/registro" className="enlace">Crear cuenta</Link>
      </p>
    </form>
  );
}

export default LoginForm;