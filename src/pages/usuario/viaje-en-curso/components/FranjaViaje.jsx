import { IconoUbicacion } from '../../../../components/Iconos/Iconos.jsx';
import styles from './FranjaViaje.module.css';

// Franja verde con la bicicleta, la estación de origen y el NFC del viaje activo.
function FranjaViaje({ idBicicleta, estacionOrigen, nfc }) {
  return (
    <section className={styles.raiz}>
      <p className={styles.bloque}>
        Id_Bicicleta: <u className={styles.destacado}>{idBicicleta}</u> · Viaje activo
      </p>

      <p className={styles.bloque}>
        <IconoUbicacion />
        Estación de origen: {estacionOrigen}
      </p>

      <p className={styles.chip}>NFC ID: {nfc}</p>
    </section>
  );
}

export default FranjaViaje;
