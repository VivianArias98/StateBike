import { IconoNfc } from '../../../../components/Iconos/Iconos.jsx';
import styles from './PanelNfc.module.css';

// Paso 1: la tarjeta NFC que se acerca al lector del anclaje
function PanelNfc({ ultimos, anclaje }) {
  return (
    <section className={`tarjeta ${styles.raiz}`} aria-labelledby="nfc-titulo">
      <h2 id="nfc-titulo" className={styles.titulo}>
        1 Acerca tu tarjeta NFC
      </h2>

      <div className={styles.lector}>
        <span className={styles.icono} aria-hidden="true">
          <IconoNfc />
        </span>
        <p className={styles.numero}>Tarjeta ••••{ultimos}</p>
        <span className="insignia insignia--activa">Activa · Tarjeta reconocida</span>
      </div>

      <p className={styles.ayuda}>
        Acerca tu tarjeta al lector del anclaje {anclaje}. Mantén la bicicleta en el rack hasta confirmar el
        desbloqueo.
      </p>
    </section>
  );
}

export default PanelNfc;
