import { IconoBicicleta } from '../../../../components/Iconos/Iconos.jsx';
import styles from './LoginBienvenida.module.css';

function LoginBienvenida() {
  return (
    <section className={`contexto-oscuro ${styles.raiz}`} aria-labelledby="titulo-bienvenida">
      <div className={styles.marcaAgua} aria-hidden="true">
        <IconoBicicleta />
      </div>

      <div className={styles.contenido}>
        <div className={styles.iconoInsignia} aria-hidden="true">
          <IconoBicicleta />
        </div>

        <h1 id="titulo-bienvenida" className={styles.titulo}>
          ¡Qué bueno verte de nuevo!
        </h1>

        <div className={styles.lineaAcento} aria-hidden="true" />

        <p className={styles.texto}>
          Entra para ver las estaciones, tu plan y tus viajes. Si eres administrador,
          llegarás a tu panel de control.
        </p>
      </div>
    </section>
  );
}

export default LoginBienvenida;
