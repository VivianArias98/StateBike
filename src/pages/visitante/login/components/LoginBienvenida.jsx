import styles from './LoginBienvenida.module.css';

function LoginBienvenida() {
  return (
    <section className={`contexto-oscuro ${styles.raiz}`}>
      <h1 className={styles.titulo}>Que bueno verte de nuevo!</h1>
      <p className={styles.texto}>
        Entra para ver las estaciones, tu plan y tus viajes. Si eres administrador,
        llegarás a tu panel de control.
      </p>
    </section>
  );
}

export default LoginBienvenida;
