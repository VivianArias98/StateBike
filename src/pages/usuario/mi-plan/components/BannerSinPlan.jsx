import { IconoCandado, IconoFlecha } from '../../../../components/Iconos/Iconos.jsx';
import styles from './BannerSinPlan.module.css';

// Aviso cuando el usuario no tiene un plan activo (HU_17), con la acción para adquirir uno.
// mensaje llega del backend: "No tiene un plan activo" o "Su plan ha vencido".
function BannerSinPlan({ mensaje, onAdquirir }) {
  return (
    <section className={`tarjeta ${styles.raiz}`} aria-labelledby="sin-plan-titulo">
      <span className={styles.icono} aria-hidden="true">
        <IconoCandado />
      </span>

      <div className={styles.texto}>
        <h2 id="sin-plan-titulo" className={styles.titulo}>
          {mensaje}
        </h2>
        <p className={styles.descripcion}>
          Para usar las bicicletas del sistema y desbloquear anclajes con tu tarjeta NFC
          vinculada, adquiere uno de los planes disponibles. El valor se
          descuenta del saldo de tu billetera.
        </p>
      </div>

      <button type="button" className={`boton boton--acento ${styles.accion}`} onClick={onAdquirir}>
        + Adquirir plan <IconoFlecha />
      </button>
    </section>
  );
}

export default BannerSinPlan;
