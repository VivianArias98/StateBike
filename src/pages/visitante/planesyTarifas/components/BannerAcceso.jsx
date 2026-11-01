import styles from './BannerAcceso.module.css';

function BannerAcceso() {
  return (
    <section className={styles.raiz}>
      <div>
        <h2 className={styles.titulo}>¿Quieres adquirir un plan?</h2>
        <p className={styles.texto}>
          Para adquirir un plan debes registrarte e iniciar sesión
        </p>
      </div>

      <div className={styles.acciones}>
        <a href="/login" className="boton boton--s">Iniciar sesión</a>
        <a href="/registro" className="boton boton--primario boton--s">Registrarse</a>
      </div>
    </section>
  );
}

export default BannerAcceso;