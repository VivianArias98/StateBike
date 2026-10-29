import styles from './LoginForm.module.css';

function LoginForm() {
  return (
    <form className="tarjeta">
      <h1 className={styles.titulo}>Iniciar sesión</h1>
      <p className={styles.subtitulo}>Ingresa con tu correo y contraseña</p>

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="correo">Correo electrónico</label>
        <input
          id="correo"
          type="email"
          className="input"
          placeholder="nombre@correo.com"
        />
      </div>

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="password">Contraseña</label>
        <div className={styles.control}>
          <input
            id="password"
            type="password"
            className={`input ${styles.conOjo}`}
            placeholder="Tu contraseña"
          />
          <button type="button" className={styles.ojo} aria-label="Mostrar contraseña">
            🚫
          </button>
        </div>
      </div>

      <button type="button" className={`boton boton--primario boton--bloque ${styles.accion}`}>
        Ingresar
      </button>

      <p className={styles.alterno}>
        ¿Primera vez? <a href="#" className="enlace">Crear cuenta</a>
      </p>
    </form>
  );
}

export default LoginForm;