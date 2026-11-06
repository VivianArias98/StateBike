import { IconoNfc } from '../../../../components/Iconos/Iconos.jsx';
import ListaDatos from '../../components/ListaDatos.jsx';
import { formatearPesos } from '../../formato.js';
import styles from './PasoNfc.module.css';

// Paso 1: confirmar que la tarjeta NFC está lista para vincular un plan
function PasoNfc({ nfc, saldo, onVolver, onContinuar }) {
  const datos = [
    { etiqueta: 'Identificador', valor: `#${nfc}` },
    { etiqueta: 'Saldo disponible en billetera', valor: `${formatearPesos(saldo)} COP` },
    { etiqueta: 'Estado', valor: 'Lista para vincular plan' },
    { etiqueta: 'Estado de planes', valor: 'Sin plan activo vigente' },
  ];

  return (
    <section className={`tarjeta ${styles.raiz}`} aria-labelledby="verificacion-titulo">
      <header className={styles.cabecera}>
        <h2 id="verificacion-titulo" className={styles.tituloSeccion}>
          Verificación de hardware
        </h2>
        <span className="insignia insignia--activa">Conectado</span>
      </header>

      <div className={styles.centro}>
        <span className={styles.icono} aria-hidden="true">
          <IconoNfc />
        </span>
        <h3 className={styles.titulo}>Tarjeta NFC vinculada y activa</h3>
        <p className={styles.texto}>
          El plan de suscripción que elijas quedará automáticamente asociado a tu tarjeta física NFC para desbloquear
          bicicletas en los anclajes del sistema.
        </p>
      </div>

      <div className={styles.caja}>
        <ListaDatos datos={datos} />
      </div>

      <p className={styles.ayuda}>¿No tienes una tarjeta física aún? Solícitala en los puntos de atención autorizados.</p>

      <div className={styles.acciones}>
        <button type="button" className="boton" onClick={onVolver}>
          Volver a mi plan
        </button>
        <button type="button" className="boton boton--acento" onClick={onContinuar}>
          Continuar a selección de plan
        </button>
      </div>
    </section>
  );
}

export default PasoNfc;
