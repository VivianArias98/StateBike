import { formatearPesos } from '../../formato.js';
import styles from './TarjetaSaldo.module.css';

// Saldo disponible de la billetera (HU_23): modelo de recarga en taquilla presencial
function TarjetaSaldo({ saldo }) {
  return (
    <section className={styles.raiz} aria-label="Saldo disponible">
      <p className={styles.etiqueta}>SALDO DISPONIBLE</p>
      <p className={styles.monto}>
        {formatearPesos(saldo)} <span className={styles.moneda}>COP</span>
      </p>
      <p className={styles.descripcion}>
        Saldo disponible para adquirir planes de viaje y saldar cobros por minutos de exceso.
      </p>

      <div className={styles.avisoPresencial}>
        <div className={styles.iconoPunto} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
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
