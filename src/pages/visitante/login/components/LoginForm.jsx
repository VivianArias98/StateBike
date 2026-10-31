import styles from './LoginForm.module.css';

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

function LoginForm() {
  return (
    <form className={styles.raiz}>
      <h2 className={styles.titulo}>Iniciar sesión</h2>
      <p className={styles.subtitulo}>Ingresa con tu correo y contraseña</p>

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
            placeholder="Tu contraseña"
          />
          <button type="button" className={styles.ojo} aria-label="Mostrar contraseña">
            <IconoOcultar />
          </button>
        </div>
      </div>

      <button type="submit" className={`boton boton--primario boton--bloque ${styles.accion}`}>
        Ingresar
      </button>

      <a href="#" className={`enlace ${styles.enlaceDerecha}`}>
        ¿Olvidaste tu contraseña?
      </a>

      <p className={styles.alterno}>
        ¿Primera vez? <a href="#" className="enlace">Crear cuenta</a>
      </p>
    </form>
  );
}

export default LoginForm;