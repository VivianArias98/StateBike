import { IconoCandado, IconoFlecha } from '../../../../components/Iconos/Iconos.jsx';
import styles from './BannerSinPlan.module.css';

// Aviso cuando el usuario no tiene un plan activo, con la acción para adquirir uno
function BannerSinPlan({ nfc, onAdquirir }) {
  return (
    <section className={`tarjeta ${styles.raiz}`} aria-labelledby="sin-plan-titulo">
      <span className={styles.icono} aria-hidden="true">
        <IconoCandado />
      </span>

      <div className={styles.texto}>
        <div className={styles.etiquetaFila}>
          <p className={styles.etiqueta}>Estado del sistema // Acceso vehicular</p>
          <span className={styles.conectado}>
            <span className="punto-vivo" aria-hidden="true" />
            Conectado
          </span>
        </div>
        <h2 id="sin-plan-titulo" className={styles.titulo}>
          No tienes ningún plan activo actualmente
        </h2>
        <p className={styles.descripcion}>
          Para hacer uso de las bicicletas del sistema y desbloquear anclajes con tu tarjeta NFC vinculada (#{nfc}),
          selecciona y adquiere uno de los planes disponibles a continuación. El débito se realiza de tu billetera
          registrada.
        </p>
      </div>

      <button type="button" className={`boton boton--acento ${styles.accion}`} onClick={onAdquirir}>
        + Adquirir plan <IconoFlecha />
      </button>
    </section>
  );
}

export default BannerSinPlan;
