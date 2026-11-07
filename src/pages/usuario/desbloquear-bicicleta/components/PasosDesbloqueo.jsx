import styles from './PasosDesbloqueo.module.css';

// Los tres pasos del desbloqueo, cada uno en su tarjeta verde. pasos: [{ titulo }]
function PasosDesbloqueo({ pasos, pasoActual = 0 }) {
  return (
    <ol className={styles.lista} aria-label="Pasos para desbloquear la bicicleta">
      {pasos.map((paso, indice) => (
        <li
          key={paso.titulo}
          className={`${styles.paso} ${indice === pasoActual ? styles.activo : ''}`}
          aria-current={indice === pasoActual ? 'step' : undefined}
        >
          <span className={styles.numero} aria-hidden="true">
            {indice + 1}
          </span>
          <span className={styles.titulo}>{paso.titulo}</span>
        </li>
      ))}
    </ol>
  );
}

export default PasosDesbloqueo;
