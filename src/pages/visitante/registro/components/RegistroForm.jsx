import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './RegistroForm.module.css';
import { registrar } from '../../../../utils/auth.js';
import { validarCamposRegistro } from '../../../../utils/validaciones.js';
import { textoError } from '../../../../utils/mensajesError.js';
import { IconoOjo } from '../../../../components/Iconos/Iconos.jsx';
import SelectorFechaNacimiento from './SelectorFechaNacimiento.jsx';
import ModalTerminos from './ModalTerminos.jsx';

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

const CAMPOS_VACIOS = {
  nombreCompleto: '',
  fechaNacimiento: '',
  correo: '',
  telefono: '',
  contrasena: '',
  confirmacion: '',
  aceptaTerminos: false,
};

function RegistroForm() {
  const navegar = useNavigate();
  const [datos, setDatos] = useState(CAMPOS_VACIOS);
  const [mostrar, setMostrar] = useState({ contrasena: false, confirmacion: false });
  const [error, setError] = useState('');
  const [erroresCampos, setErroresCampos] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [modalTerminosAbierto, setModalTerminosAbierto] = useState(false);

  // Estados de validación en tiempo real para la contraseña (normalizada sin espacios accidentales)
  const pwdLimpia = datos.contrasena.trim();
  const confLimpia = datos.confirmacion.trim();
  const tiene8Caracteres = pwdLimpia.length >= 8;
  const tieneLetra = /[a-zA-Z]/.test(pwdLimpia);
  const tieneNumero = /[0-9]/.test(pwdLimpia);
  const contrasenasCoinciden =
    confLimpia.length > 0 && pwdLimpia === confLimpia;
  const contrasenasNoCoinciden =
    confLimpia.length > 0 && pwdLimpia !== confLimpia;

  function cambiar(campo, valor) {
    if (error) setError('');
    if (erroresCampos[campo]) {
      setErroresCampos((anterior) => {
        const copia = { ...anterior };
        delete copia[campo];
        return copia;
      });
    }
    setDatos((anterior) => ({ ...anterior, [campo]: valor }));
  }

  function alternarOjo(campo) {
    setMostrar((anterior) => ({ ...anterior, [campo]: !anterior[campo] }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setError('');

    const errs = validarCamposRegistro(datos);
    setErroresCampos(errs);

    if (Object.keys(errs).length > 0) {
      if (errs.nombreCompleto) {
        document.getElementById('nombre')?.focus();
      } else if (errs.fechaNacimiento) {
        document.getElementById('nacimiento-dia')?.focus();
      } else if (errs.correo) {
        document.getElementById('correo')?.focus();
      } else if (errs.telefono) {
        document.getElementById('telefono')?.focus();
      } else if (errs.contrasena) {
        document.getElementById('password')?.focus();
      } else if (errs.confirmacion) {
        document.getElementById('confirmar')?.focus();
      }
      return;
    }

    setEnviando(true);
    try {
      const respuesta = await registrar({
        nombreCompleto: datos.nombreCompleto.trim().replace(/\s+/g, ' '),
        fechaNacimiento: datos.fechaNacimiento.trim(),
        correo: datos.correo.trim().toLowerCase(),
        telefono: datos.telefono.trim().replace(/\s+/g, ''),
        contrasena: datos.contrasena.trim(),
        confirmacion: datos.confirmacion.trim(),
        aceptaTerminos: datos.aceptaTerminos,
      });
      navegar('/login', {
        replace: true,
        state: { mensaje: respuesta?.mensaje ?? 'CUENTA CREADA CON ÉXITO' },
      });
    } catch (e) {
      const msg = textoError(e);
      setError(msg);
      if (msg.toLowerCase().includes('correo')) {
        setErroresCampos((prev) => ({ ...prev, correo: msg }));
      }
      setEnviando(false);
    }
  }

  return (
    <form className={styles.raiz} onSubmit={enviar} noValidate>
      <h2 className={styles.titulo}>Crea tu cuenta</h2>
      <p className={styles.subtitulo}>Debes ser mayor de edad para registrarte</p>

      {error && (
        <div
          id="registro-error-general"
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
        <label htmlFor="nombre" className={styles.etiqueta}>
          Nombre completo <span aria-hidden="true">*</span>
        </label>
        <input
          id="nombre"
          type="text"
          className={`input ${styles.entrada}`}
          placeholder="Escribe tu nombre completo"
          value={datos.nombreCompleto}
          onChange={(e) => cambiar('nombreCompleto', e.target.value)}
          autoComplete="name"
          required
          aria-required="true"
          aria-invalid={Boolean(erroresCampos.nombreCompleto)}
          aria-describedby={erroresCampos.nombreCompleto ? 'error-nombre' : undefined}
        />
        {erroresCampos.nombreCompleto && (
          <p id="error-nombre" className="mensaje-error" role="alert" style={{ marginTop: 'var(--espacio-1)', fontSize: 'var(--texto-xs)' }}>
            {erroresCampos.nombreCompleto}
          </p>
        )}
      </div>

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="nacimiento-dia" className={styles.etiqueta}>
          Fecha de nacimiento <span aria-hidden="true">*</span>
        </label>
        <SelectorFechaNacimiento
          id="nacimiento"
          valor={datos.fechaNacimiento}
          onChange={(fecha) => cambiar('fechaNacimiento', fecha)}
        />
        {erroresCampos.fechaNacimiento && (
          <p id="error-fecha" className="mensaje-error" role="alert" style={{ marginTop: 'var(--espacio-1)', fontSize: 'var(--texto-xs)' }}>
            {erroresCampos.fechaNacimiento}
          </p>
        )}
      </div>

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="correo" className={styles.etiqueta}>
          Correo electrónico <span aria-hidden="true">*</span>
        </label>
        <input
          id="correo"
          type="email"
          className={`input ${styles.entrada}`}
          placeholder="nombre@correo.com"
          value={datos.correo}
          onChange={(e) => cambiar('correo', e.target.value)}
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={Boolean(erroresCampos.correo)}
          aria-describedby={erroresCampos.correo ? 'error-correo' : undefined}
        />
        {erroresCampos.correo && (
          <p id="error-correo" className="mensaje-error" role="alert" style={{ marginTop: 'var(--espacio-1)', fontSize: 'var(--texto-xs)' }}>
            {erroresCampos.correo}
          </p>
        )}
      </div>

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="telefono" className={styles.etiqueta}>
          Teléfono celular <span aria-hidden="true">*</span>
        </label>
        <input
          id="telefono"
          type="tel"
          className={`input ${styles.entrada}`}
          placeholder="Ej: 3001234567"
          value={datos.telefono}
          onChange={(e) => cambiar('telefono', e.target.value)}
          autoComplete="tel"
          required
          aria-required="true"
          aria-invalid={Boolean(erroresCampos.telefono)}
          aria-describedby={erroresCampos.telefono ? 'error-telefono' : undefined}
        />
        {erroresCampos.telefono && (
          <p id="error-telefono" className="mensaje-error" role="alert" style={{ marginTop: 'var(--espacio-1)', fontSize: 'var(--texto-xs)' }}>
            {erroresCampos.telefono}
          </p>
        )}
      </div>

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="password" className={styles.etiqueta}>
          Contraseña <span aria-hidden="true">*</span>
        </label>
        <div className={styles.control}>
          <input
            id="password"
            type={mostrar.contrasena ? 'text' : 'password'}
            className={`input ${styles.entrada} ${styles.conOjo}`}
            placeholder="Crea una contraseña"
            value={datos.contrasena}
            onChange={(e) => cambiar('contrasena', e.target.value)}
            autoComplete="new-password"
            required
            aria-required="true"
            aria-invalid={Boolean(erroresCampos.contrasena)}
            aria-describedby={
              erroresCampos.contrasena
                ? 'error-contrasena requisitos-contrasena'
                : 'requisitos-contrasena'
            }
          />
          <button
            type="button"
            className={styles.ojo}
            aria-label={mostrar.contrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onClick={() => alternarOjo('contrasena')}
          >
            {mostrar.contrasena ? <IconoOcultar /> : <IconoOjo />}
          </button>
        </div>

        {erroresCampos.contrasena && (
          <p id="error-contrasena" className="mensaje-error" role="alert" style={{ marginTop: 'var(--espacio-1)', fontSize: 'var(--texto-xs)' }}>
            {erroresCampos.contrasena}
          </p>
        )}

        <div id="requisitos-contrasena" className={styles.cajaRequisitos} aria-live="polite">
          <span className={styles.tituloRequisitos}>Requisitos de la contraseña:</span>
          <div className={styles.itemRequisito}>
            <span className={tiene8Caracteres ? styles.iconoCheck : styles.iconoPunto}>
              {tiene8Caracteres ? '✓' : '•'}
            </span>
            <span className={tiene8Caracteres ? styles.textoCumplido : styles.textoPendiente}>
              Mínimo 8 caracteres {datos.contrasena.length > 0 && !tiene8Caracteres ? `(llevas ${datos.contrasena.length})` : ''}
            </span>
          </div>
          <div className={styles.itemRequisito}>
            <span className={tieneLetra ? styles.iconoCheck : styles.iconoPunto}>
              {tieneLetra ? '✓' : '•'}
            </span>
            <span className={tieneLetra ? styles.textoCumplido : styles.textoPendiente}>
              Al menos una letra (a-z o A-Z)
            </span>
          </div>
          <div className={styles.itemRequisito}>
            <span className={tieneNumero ? styles.iconoCheck : styles.iconoPunto}>
              {tieneNumero ? '✓' : '•'}
            </span>
            <span className={tieneNumero ? styles.textoCumplido : styles.textoPendiente}>
              Al menos un número (0-9)
            </span>
          </div>
        </div>
      </div>

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="confirmar" className={styles.etiqueta}>
          Confirmar contraseña <span aria-hidden="true">*</span>
        </label>
        <div className={styles.control}>
          <input
            id="confirmar"
            type={mostrar.confirmacion ? 'text' : 'password'}
            className={`input ${styles.entrada} ${styles.conOjo}`}
            placeholder="Repite tu contraseña"
            value={datos.confirmacion}
            onChange={(e) => cambiar('confirmacion', e.target.value)}
            autoComplete="new-password"
            required
            aria-required="true"
            aria-invalid={Boolean(erroresCampos.confirmacion)}
            aria-describedby={erroresCampos.confirmacion ? 'error-confirmar' : undefined}
          />
          <button
            type="button"
            className={styles.ojo}
            aria-label={mostrar.confirmacion ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onClick={() => alternarOjo('confirmacion')}
          >
            {mostrar.confirmacion ? <IconoOcultar /> : <IconoOjo />}
          </button>
        </div>
        {erroresCampos.confirmacion && (
          <p id="error-confirmar" className="mensaje-error" role="alert" style={{ marginTop: 'var(--espacio-1)', fontSize: 'var(--texto-xs)' }}>
            {erroresCampos.confirmacion}
          </p>
        )}
        {contrasenasCoinciden && (
          <div className={styles.itemRequisito} style={{ marginTop: 'var(--espacio-1)' }}>
            <span className={styles.iconoCheck}>✓</span>
            <span className={styles.textoCumplido}>Las contraseñas coinciden</span>
          </div>
        )}
        {contrasenasNoCoinciden && (
          <div className={styles.itemRequisito} style={{ marginTop: 'var(--espacio-1)' }}>
            <span className={styles.iconoCruz}>✕</span>
            <span className={styles.textoInvalido}>Las contraseñas no coinciden</span>
          </div>
        )}
      </div>

      <label className={styles.terminos}>
        <input
          type="checkbox"
          className={styles.casilla}
          checked={datos.aceptaTerminos}
          onChange={(e) => cambiar('aceptaTerminos', e.target.checked)}
          required
          aria-required="true"
          aria-invalid={Boolean(erroresCampos.aceptaTerminos)}
          aria-describedby={erroresCampos.aceptaTerminos ? 'error-terminos' : undefined}
        />
        <span>
          Acepto los{' '}
          <button
            type="button"
            className={styles.enlaceTerminos}
            onClick={(e) => {
              e.preventDefault();
              setModalTerminosAbierto(true);
            }}
          >
            términos y condiciones
          </button>{' '}
          y el{' '}
          <button
            type="button"
            className={styles.enlaceTerminos}
            onClick={(e) => {
              e.preventDefault();
              setModalTerminosAbierto(true);
            }}
          >
            tratamiento de mis datos personales
          </button>
        </span>
      </label>
      {erroresCampos.aceptaTerminos && (
        <p id="error-terminos" className="mensaje-error" role="alert" style={{ marginTop: '-0.5rem', marginBottom: 'var(--espacio-3)', fontSize: 'var(--texto-xs)' }}>
          {erroresCampos.aceptaTerminos}
        </p>
      )}

      <ModalTerminos
        abierto={modalTerminosAbierto}
        onCerrar={() => setModalTerminosAbierto(false)}
        onAceptar={() => cambiar('aceptaTerminos', true)}
      />

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
