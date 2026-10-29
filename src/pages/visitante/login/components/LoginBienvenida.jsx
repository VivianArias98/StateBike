import styles from './LoginBienvenida.module.css';

function LoginBienvenida() {
  return (
    <aside className={`contexto-oscuro ${styles.raiz}`}>
      <h2 className={styles.titulo}>Que bueno verte de nuevo!</h2>
      <p className={styles.texto}>
        Entra para ver las estaciones, tu plan y tus viajes. Si eres administrador,
        llegarás a tu panel de control.
      </p>
    </aside>
  );
}

export default LoginBienvenida;