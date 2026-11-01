import styles from './RegistroForm.module.css';

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

function RegistroForm() {
  return (
    <form className={styles.raiz}>
      <h1 className={styles.titulo}>Crea tu cuenta</h1>
      <p className={styles.subtitulo}>Debes ser mayor de edad para registrarte</p>

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="nombre" className={styles.etiqueta}>Nombre completo</label>
        <input
          id="nombre"
          type="text"
          className={`input ${styles.entrada}`}
          placeholder="Escribe tu nombre completo"
        />
      </div>

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="nacimiento" className={styles.etiqueta}>Fecha de nacimiento</label>
        <input id="nacimiento" type="date" className={`input ${styles.entrada}`} />
      </div>

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="correo" className={styles.etiqueta}>Correo electrónico</label>
        <input
          id="correo"
          type="email"
          className={`input ${styles.entrada}`}
          placeholder="nombre@correo.com"
        />
      </div>

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="password" className={styles.etiqueta}>Contraseña</label>
        <div className={styles.control}>
          <input
            id="password"
            type="password"
            className={`input ${styles.entrada} ${styles.conOjo}`}
            placeholder="Crea una contraseña"
          />
          <button type="button" className={styles.ojo} aria-label="Mostrar contraseña">
            <IconoOcultar />
          </button>
        </div>
      </div>

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="confirmar" className={styles.etiqueta}>Confirmar contraseña</label>
        <div className={styles.control}>
          <input
            id="confirmar"
            type="password"
            className={`input ${styles.entrada} ${styles.conOjo}`}
            placeholder="Repite tu contraseña"
          />
          <button type="button" className={styles.ojo} aria-label="Mostrar contraseña">
            <IconoOcultar />
          </button>
        </div>
      </div>

      <label className={styles.terminos}>
        <input type="checkbox" />
        Acepto los términos y condiciones y el tratamiento de mis datos personales
      </label>

      <button type="button" className={`boton boton--primario boton--bloque ${styles.accion}`}>
        Crear cuenta
      </button>

      <p className={styles.alterno}>
        ¿Ya tienes cuenta? <a href="#" className="enlace">Iniciar sesión</a>
      </p>
    </form>
  );
}

export default RegistroForm;
