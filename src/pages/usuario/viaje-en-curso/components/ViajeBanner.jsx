import { IconoUbicacion, IconoNfc } from '../../../../components/Iconos/Iconos.jsx';
import styles from './ViajeBanner.module.css';

// Franja con el resumen del viaje activo
function ViajeBanner({ codigoBicicleta, estacionInicio, anclaje, nfc }) {
  return (
    <section className={styles.raiz}>
      <p className={styles.estado}>
        <span className={styles.punto} aria-hidden="true" />
        {codigoBicicleta} · Viaje activo
      </p>

      <p className={styles.inicio}>
        <IconoUbicacion />
        <span>
          Inicio: <strong>{estacionInicio}</strong> · Anclaje {anclaje}
        </span>
      </p>

      <p className={styles.nfc}>
        <IconoNfc />
        NFC ••••{nfc}
      </p>
    </section>
  );
}

export default ViajeBanner;