import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './RegistroForm.module.css';
import { registrar } from '../../../../utils/auth.js';
import { validarRegistro } from '../../../../utils/validaciones.js';
import { textoError } from '../../../../utils/mensajesError.js';
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
  const [modalTerminosAbierto, setModalTerminosAbierto] = useState(false);

  // Estados de validación en tiempo real para la contraseña
  const tiene8Caracteres = datos.contrasena.length >= 8;
  const tieneLetra = /[a-zA-Z]/.test(datos.contrasena);
  const tieneNumero = /[0-9]/.test(datos.contrasena);
  const contrasenasCoinciden =
    datos.confirmacion.length > 0 && datos.contrasena === datos.confirmacion;
  const contrasenasNoCoinciden =
    datos.confirmacion.length > 0 && datos.contrasena !== datos.confirmacion;

  // El mensaje de error permanece visible durante 4 segundos y luego desaparece automáticamente
  useEffect(() => {
    if (!error) return undefined;
    const temporizador = setTimeout(() => {
      setError('');
    }, 4000);
    return () => clearTimeout(temporizador);
  }, [error]);


  function cambiar(campo, valor) {
    if (error) setError('');
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

      // Enfocar automáticamente el primer campo vacío para guiar al usuario
      if (!datos.nombreCompleto.trim()) {
        document.getElementById('nombre')?.focus();
      } else if (!datos.fechaNacimiento) {
        document.getElementById('nacimiento-dia')?.focus();
      } else if (!datos.correo.trim()) {
        document.getElementById('correo')?.focus();
      } else if (!datos.contrasena) {
        document.getElementById('password')?.focus();
      } else if (!datos.confirmacion) {
        document.getElementById('confirmar')?.focus();
      }
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

      {error && (
        <div
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
        <label htmlFor="nombre" className={styles.etiqueta}>Nombre completo</label>
        <input
          id="nombre"
          type="text"
          className={`input ${styles.entrada}`}
          placeholder="Escribe tu nombre completo"
          value={datos.nombreCompleto}
          onChange={(e) => cambiar('nombreCompleto', e.target.value)}
          onFocus={() => { if (error) setError(''); }}
          autoComplete="name"
        />
      </div>

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="nacimiento-dia" className={styles.etiqueta}>Fecha de nacimiento</label>
        <SelectorFechaNacimiento
          id="nacimiento"
          valor={datos.fechaNacimiento}
          onChange={(fecha) => cambiar('fechaNacimiento', fecha)}
          onFocus={() => { if (error) setError(''); }}
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
          onFocus={() => { if (error) setError(''); }}
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
            onFocus={() => { if (error) setError(''); }}
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

        <div className={styles.cajaRequisitos}>
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
        <label htmlFor="confirmar" className={styles.etiqueta}>Confirmar contraseña</label>
        <div className={styles.control}>
          <input
            id="confirmar"
            type={mostrar.confirmacion ? 'text' : 'password'}
            className={`input ${styles.entrada} ${styles.conOjo}`}
            placeholder="Repite tu contraseña"
            value={datos.confirmacion}
            onChange={(e) => cambiar('confirmacion', e.target.value)}
            onFocus={() => { if (error) setError(''); }}
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
