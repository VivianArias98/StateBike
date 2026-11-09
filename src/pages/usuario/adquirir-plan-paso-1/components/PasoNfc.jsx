import { IconoNfc } from '../../../../components/Iconos/Iconos.jsx';
import { formatearPesos } from '../../formato.js';
import styles from './PasoNfc.module.css';

// Paso 1: estado real de la tarjeta NFC y del plan. Si no se cumple una precondición, muestra el
// mensaje de la HU y no deja continuar.
function PasoNfc({ tarjeta, saldo, tienePlan, bloqueo, onVolver, onContinuar }) {
  return (
    <section className={`tarjeta ${styles.raiz}`} aria-labelledby="verificacion-titulo">
      <header className={styles.cabecera}>
        <h2 id="verificacion-titulo" className={styles.tituloSeccion}>
          Verificación de tarjeta
        </h2>
      </header>

      <div className={styles.centro}>
        <span className={styles.halo} aria-hidden="true">
          <span className={styles.icono}>
            <IconoNfc />
          </span>
        </span>
        <h3 className={styles.titulo}>
          {tarjeta?.estado === 'ACTIVA' ? 'Tarjeta NFC vinculada y activa' : 'Tarjeta NFC no disponible'}
        </h3>
        <p className={styles.texto}>
          El plan que elijas quedará asociado a tu cuenta y podrás usarlo con tu tarjeta NFC para desbloquear
          bicicletas en los anclajes del sistema.
        </p>
      </div>

      <div className={styles.caja}>
        <div className={styles.fila}>
          <div className={styles.dato}>
            <p className={styles.etiqueta}>Tarjeta</p>
            <p className={styles.valorMono}>{tarjeta ? `•••• ${tarjeta.ultimosDigitos}` : 'SIN VINCULAR'}</p>
          </div>
          <div className={styles.dato}>
            <p className={styles.etiqueta}>Saldo disponible en billetera</p>
            <p className={styles.valorExito}>{formatearPesos(saldo)} COP</p>
          </div>
        </div>
        <div className={styles.fila}>
          <div className={styles.dato}>
            <p className={styles.etiqueta}>Estado de la tarjeta</p>
            <span className={styles.estadoLista}>{tarjeta?.estado ?? 'SIN VINCULAR'}</span>
          </div>
          <div className={styles.dato}>
            <p className={styles.etiqueta}>Estado de planes</p>
            <p className={styles.valor}>{tienePlan ? 'Con plan activo vigente' : 'Sin plan activo vigente'}</p>
          </div>
        </div>
      </div>

      {bloqueo && (
        <p className="mensaje-error" role="alert">
          {bloqueo}
        </p>
      )}

      <div className={styles.acciones}>
        <button type="button" className={`boton ${styles.volver}`} onClick={onVolver}>
          Volver a mi plan
        </button>
        <button type="button" className="boton boton--secundario" onClick={onContinuar} disabled={Boolean(bloqueo)}>
          Continuar a selección de plan
        </button>
      </div>
    </section>
  );
}

export default PasoNfc;
