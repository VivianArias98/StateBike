import Etiqueta from '../../../../components/Etiqueta/Etiqueta.jsx';
import { IconoBloqueo, IconoCandado, IconoNfc } from '../../../../components/Iconos/Iconos.jsx';
import styles from './TarjetaNfcPerfil.module.css';

// Tarjeta NFC del usuario: la tarjeta física, su estado y la acción de bloqueo
function TarjetaNfcPerfil({ referencia, ultimos, titular, expira }) {
  // Pendiente: bloquear la tarjeta en el backend
  const bloquear = () => {};

  return (
    <section className={`tarjeta ${styles.raiz}`} aria-labelledby="tarjeta-nfc-titulo">
      <header className={styles.cabecera}>
        <h2 id="tarjeta-nfc-titulo" className={styles.titulo}>
          Tarjeta NFC
        </h2>
        <Etiqueta texto={`#${referencia}`} color="menta" />
      </header>

      <div className={`contexto-oscuro ${styles.tarjetaFisica}`}>
        <div className={styles.filaSuperior}>
          <span className={styles.marca}>
            <IconoNfc /> STATION PASS
          </span>
          <span className="insignia insignia--activa">Activa</span>
        </div>

        <div>
          <p className={styles.etiquetaNumero}>Número / UID físico</p>
          <p className={styles.numero}>•••• •••• {ultimos}</p>
        </div>

        <div className={styles.filaInferior}>
          <span>Titular: {titular}</span>
          <span>Expira: {expira}</span>
        </div>
      </div>

      <p className={styles.aviso}>
        <span className={styles.iconoAviso} aria-hidden="true">
          <IconoCandado />
        </span>
        Una tarjeta bloqueada no desbloquea anclajes ni bicicletas, pero tu plan activo seguirá vigente. No es posible
        bloquear la tarjeta mientras tengas un viaje en curso.
      </p>

      <button type="button" className="boton boton--bloque" onClick={bloquear}>
        <IconoBloqueo /> Bloquear tarjeta NFC
      </button>
    </section>
  );
}

export default TarjetaNfcPerfil;
