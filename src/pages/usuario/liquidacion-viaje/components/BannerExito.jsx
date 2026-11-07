import { IconoCheck } from '../../../../components/Iconos/Iconos.jsx';
import styles from './BannerExito.module.css';

// Banner verde con el resultado del viaje. Solo dibuja.
function BannerExito() {
  return (
    <section className={styles.raiz}>
      <div className={styles.texto}>
        <span className={styles.icono} aria-hidden="true">
          <IconoCheck />
        </span>
        <div>
          <h2 className={styles.titulo}>VIAJE FINALIZADO CON ÉXITO</h2>
          <p className={styles.descripcion}>
            La bicicleta quedó bloqueada correctamente en el anclaje y se confirmó la devolución con su tarjeta NFC. Su viaje ha sido cerrado y registrado sin cobros adicionales.
          </p>
        </div>
      </div>

      <span className={styles.chip}>BLOQUEADO EN ANCLAJE</span>
    </section>
  );
}

export default BannerExito;
