import VisitanteLayout from '../../../layouts/VisitanteLayout/VisitanteLayout.jsx';
import styles from './RecuperarContrasena.module.css';

function RecuperarContrasena() {
  return (
    <VisitanteLayout>
      <div className={styles.pagina}>
        <section className={`contexto-oscuro ${styles.panel}`} aria-label="Bienvenida">
          <h1 className={styles.titulo}>
            Vuelve a pedalear <br />por Tunja.
          </h1>
          <p className={styles.descripcion}>
            Recupera el acceso a tu cuenta para consultar tu plan, tus viajes y las estaciones disponibles.
          </p>
          <span className={styles.barra} aria-hidden="true" />
        </section>

        <section className={styles.tarjeta} aria-labelledby="titulo-recuperar">
          <h2 id="titulo-recuperar" className={styles.titulo2}>Recuperar contraseña</h2>
          <p className={styles.subtitulo}>Ingresa tu correo y te enviaremos un enlace</p>

          <div className={`campo ${styles.campo}`}>
            <label htmlFor="correo-recuperar" className={styles.etiqueta}>Correo electrónico</label>
            <input
              id="correo-recuperar"
              type="email"
              className={`input ${styles.entrada}`}
              defaultValue="camila.rojas@correo.com"
            />
          </div>

          <button type="button" className={`boton boton--primario boton--bloque ${styles.accion}`}>
            Enviar enlace
          </button>

          <p className={styles.volver}>
            <a href="/login" className="enlace">← Volver a iniciar sesión</a>
          </p>
        </section>
      </div>
    </VisitanteLayout>
  );
}

export default RecuperarContrasena;
