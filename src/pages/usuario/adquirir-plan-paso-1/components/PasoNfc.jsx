import { IconoAyuda, IconoNfc } from '../../../../components/Iconos/Iconos.jsx';
import { formatearPesos } from '../../formato.js';
import { SALDO } from '../../datos-adquirir.js';
import styles from './PasoNfc.module.css';

// Paso 1: confirmar que la tarjeta NFC está lista para vincular un plan
function PasoNfc({ nfc, onVolver, onContinuar }) {
  return (
    <section className={`tarjeta ${styles.raiz}`} aria-labelledby="verificacion-titulo">
      <header className={styles.cabecera}>
        <h2 id="verificacion-titulo" className={styles.tituloSeccion}>
          Verificación de hardware
        </h2>
        <span className={styles.conectado}>
          <span className="punto-vivo" aria-hidden="true" />
          Conectado
        </span>
      </header>

      <div className={styles.centro}>
        <span className={styles.halo} aria-hidden="true">
          <span className={styles.icono}>
            <IconoNfc />
          </span>
        </span>
        <h3 className={styles.titulo}>Tarjeta NFC vinculada y activa</h3>
        <p className={styles.texto}>
          El plan de suscripción que elijas quedará automáticamente asociado a tu tarjeta física NFC para desbloquear
          bicicletas en los anclajes del sistema.
        </p>
      </div>

      <div className={styles.caja}>
        <div className={styles.fila}>
          <div className={styles.dato}>
            <p className={styles.etiqueta}>Identificador</p>
            <p className={styles.valorMono}>#{nfc}</p>
          </div>
          <div className={styles.dato}>
            <p className={styles.etiqueta}>Saldo disponible en billetera</p>
            <p className={styles.valorExito}>{formatearPesos(SALDO)} COP</p>
          </div>
        </div>
        <div className={styles.fila}>
          <div className={styles.dato}>
            <p className={styles.etiqueta}>Estado</p>
            <span className={styles.estadoLista}>Lista para vincular plan</span>
          </div>
          <div className={styles.dato}>
            <p className={styles.etiqueta}>Estado de planes</p>
            <p className={styles.valor}>Sin plan activo vigente</p>
          </div>
        </div>
      </div>

      <p className={styles.ayuda}>
        <IconoAyuda />
        ¿No tienes una tarjeta física aún? Solícitala en los puntos de atención autorizados.
      </p>

      <div className={styles.acciones}>
        <button type="button" className={`boton ${styles.volver}`} onClick={onVolver}>
          Volver a mi plan
        </button>
        <button type="button" className="boton boton--secundario" onClick={onContinuar}>
          Continuar a selección de plan
        </button>
      </div>
    </section>
  );
}

export default PasoNfc;
