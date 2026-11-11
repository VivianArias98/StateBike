import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './RegistroForm.module.css';
import { registrar } from '../../../../utils/auth.js';
import { validarRegistro } from '../../../../utils/validaciones.js';
import { textoError } from '../../../../utils/mensajesError.js';

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
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

const CAMPOS_VACIOS = {
  nombreCompleto: '',
  fechaNacimiento: '',
  correo: '',
  contrasena: '',
  confirmacion: '',
  aceptaTerminos: false,
};

function RegistroForm() {
  const navegar = useNavigate();
  const [datos, setDatos] = useState(CAMPOS_VACIOS);
  const [mostrar, setMostrar] = useState({ contrasena: false, confirmacion: false });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const hoy = new Date().toISOString().slice(0, 10);

  function cambiar(campo, valor) {
    setDatos((anterior) => ({ ...anterior, [campo]: valor }));
  }

  function alternarOjo(campo) {
    setMostrar((anterior) => ({ ...anterior, [campo]: !anterior[campo] }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setError('');

    const errorLocal = validarRegistro(datos);
    if (errorLocal) {
      setError(errorLocal);
      return;
    }

    setEnviando(true);
    try {
      const respuesta = await registrar({
        nombreCompleto: datos.nombreCompleto.trim(),
        fechaNacimiento: datos.fechaNacimiento,
        correo: datos.correo.trim(),
        contrasena: datos.contrasena,
        confirmacion: datos.confirmacion,
        aceptaTerminos: datos.aceptaTerminos,
      });
      navegar('/login', {
        replace: true,
        state: { mensaje: respuesta?.mensaje ?? 'CUENTA CREADA CON ÉXITO' },
      });
    } catch (e) {
      setError(textoError(e));
      setEnviando(false);
    }
  }

  return (
    <form className={styles.raiz} onSubmit={enviar} noValidate>
      <h1 className={styles.titulo}>Crea tu cuenta</h1>
      <p className={styles.subtitulo}>Debes ser mayor de edad para registrarte</p>

      {error && <p className="mensaje-error" role="alert">{error}</p>}

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="nombre" className={styles.etiqueta}>Nombre completo</label>
        <input
          id="nombre"
          type="text"
          className={`input ${styles.entrada}`}
          placeholder="Escribe tu nombre completo"
          value={datos.nombreCompleto}
          onChange={(e) => cambiar('nombreCompleto', e.target.value)}
          autoComplete="name"
        />
      </div>

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="nacimiento" className={styles.etiqueta}>Fecha de nacimiento</label>
        <input
          id="nacimiento"
          type="date"
          className={`input ${styles.entrada}`}
          max={hoy}
          value={datos.fechaNacimiento}
          onChange={(e) => cambiar('fechaNacimiento', e.target.value)}
        />
      </div>

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="correo" className={styles.etiqueta}>Correo electrónico</label>
        <input
          id="correo"
          type="email"
          className={`input ${styles.entrada}`}
          placeholder="nombre@correo.com"
          value={datos.correo}
          onChange={(e) => cambiar('correo', e.target.value)}
          autoComplete="email"
        />
      </div>

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="password" className={styles.etiqueta}>Contraseña</label>
        <div className={styles.control}>
          <input
            id="password"
            type={mostrar.contrasena ? 'text' : 'password'}
            className={`input ${styles.entrada} ${styles.conOjo}`}
            placeholder="Crea una contraseña"
            value={datos.contrasena}
            onChange={(e) => cambiar('contrasena', e.target.value)}
            autoComplete="new-password"
          />
          <button
            type="button"
            className={styles.ojo}
            aria-label={mostrar.contrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onClick={() => alternarOjo('contrasena')}
          >
            <IconoOcultar />
          </button>
        </div>
      </div>

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="confirmar" className={styles.etiqueta}>Confirmar contraseña</label>
        <div className={styles.control}>
          <input
            id="confirmar"
            type={mostrar.confirmacion ? 'text' : 'password'}
            className={`input ${styles.entrada} ${styles.conOjo}`}
            placeholder="Repite tu contraseña"
            value={datos.confirmacion}
            onChange={(e) => cambiar('confirmacion', e.target.value)}
            autoComplete="new-password"
          />
          <button
            type="button"
            className={styles.ojo}
            aria-label={mostrar.confirmacion ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onClick={() => alternarOjo('confirmacion')}
          >
            <IconoOcultar />
          </button>
        </div>
      </div>

      <label className={styles.terminos}>
        <input
          type="checkbox"
          className={styles.casilla}
          checked={datos.aceptaTerminos}
          onChange={(e) => cambiar('aceptaTerminos', e.target.checked)}
        />
        Acepto los términos y condiciones y el tratamiento de mis datos personales
      </label>

      <button
        type="submit"
        className={`boton boton--primario boton--bloque ${styles.accion}`}
        disabled={enviando}
      >
        {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
      </button>

      <p className={styles.alterno}>
        ¿Ya tienes cuenta? <Link to="/login" className="enlace">Iniciar sesión</Link>
      </p>
    </form>
  );
}

export default RegistroForm;
