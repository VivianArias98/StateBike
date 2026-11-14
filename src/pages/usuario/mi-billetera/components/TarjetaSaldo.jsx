import { IconoBilletera, IconoUbicacion } from '../../../../components/Iconos/Iconos.jsx';
import { formatearPesos } from '../../formato.js';
import styles from './TarjetaSaldo.module.css';

// Saldo disponible de la billetera (HU_23): modelo de recarga en taquilla presencial administrada
function TarjetaSaldo({ saldo }) {
  return (
    <section className={styles.raiz} aria-label="Saldo disponible">
      <div className={styles.cabecera}>
        <div className={styles.iconoBilletera} aria-hidden="true">
          <IconoBilletera />
        </div>
        <div>
          <span className={styles.etiqueta}>SALDO DISPONIBLE</span>
          <div className={styles.badgeEnVivo}>
            <span className="punto-vivo" aria-hidden="true" />
            <span>Billetera activa</span>
          </div>
        </div>
      </div>

      <div className={styles.montoContenedor}>
        <span className={styles.monto}>{formatearPesos(saldo)}</span>
        <span className={styles.moneda}>COP</span>
      </div>

      <p className={styles.descripcion}>
        Saldo disponible para adquirir planes de viaje y saldar cobros por minutos de exceso.
      </p>

      <div className={styles.avisoPresencial}>
        <div className={styles.iconoPunto} aria-hidden="true">
          <IconoUbicacion />
        </div>
        <div className={styles.contenidoAviso}>
          <p className={styles.tituloAviso}>Recargas presenciales en taquilla</p>
          <p className={styles.textoAviso}>
            Acércate a un punto de atención o estación autorizada de StationBike. El administrador registrará tu recarga en efectivo o débito y el saldo se verá reflejado inmediatamente en esta billetera.
          </p>
        </div>
      </div>
    </section>
  );
}

export default TarjetaSaldo;
