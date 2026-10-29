import styles from './RegistroForm.module.css';

function RegistroForm() {
  return (
    <form className={styles.raiz}>
      <h1 className={styles.titulo}>Crea tu cuenta</h1>
      <p className={styles.subtitulo}>Debes ser mayor de edad para registrarte</p>

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="nombre">Nombre completo</label>
        <input
          id="nombre"
          type="text"
          className="input"
          placeholder="Escribe tu nombre completo"
        />
      </div>

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="nacimiento">Fecha de nacimiento</label>
        <input id="nacimiento" type="date" className="input" />
      </div>

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
            placeholder="Crea una contraseña"
          />
          <button type="button" className={styles.ojo} aria-label="Mostrar contraseña">
            🚫
          </button>
        </div>
      </div>

      <div className={`campo ${styles.campo}`}>
        <label htmlFor="confirmar">Confirmar contraseña</label>
        <div className={styles.control}>
          <input
            id="confirmar"
            type="password"
            className={`input ${styles.conOjo}`}
            placeholder="Repite tu contraseña"
          />
          <button type="button" className={styles.ojo} aria-label="Mostrar contraseña">
            🚫
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