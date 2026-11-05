import { Icono } from '../../components/IconosVisitante.jsx';
import styles from './BannerAcceso.module.css';

// Banner de acceso: invita a registrarse o iniciar sesión para comprar un plan.
function BannerAcceso() {
  return (
    <section className={styles.raiz} aria-labelledby="titulo-banner-acceso">
      <div className={styles.info}>
        <span className={styles.icono} aria-hidden="true">
          <Icono nombre="nfc" />
        </span>
        <div>
          <h2 id="titulo-banner-acceso" className={styles.titulo}>
            ¿Quieres adquirir un plan?
          </h2>
          <p className={styles.texto}>
            Para adquirir un plan debes registrarte e iniciar sesión
          </p>
        </div>
      </div>

      <div className={styles.acciones}>
        <a href="/login" className={`boton ${styles.iniciar}`}>
          INICIAR SESIÓN
        </a>
        <a href="/registro" className={`boton boton--primario ${styles.registrarse}`}>
          REGISTRARSE
        </a>
      </div>
    </section>
  );
}

export default BannerAcceso;
