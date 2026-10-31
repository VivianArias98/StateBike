import styles from './RegistroBienvenida.module.css';

function RegistroBienvenida() {
  return (
    <aside className={styles.raiz}>
      <h2 className={styles.titulo}>Muévete por Tunja en bicicleta.</h2>
      <p className={styles.texto}>
        Crea tu cuenta, compra un plan y desbloquea una bicicleta con tu tarjeta NFC
      </p>

      <ol className={styles.pasos}>
        <li className={styles.paso}>
          <span className={styles.numero}>1.</span>
          Crea tu cuenta
        </li>
        <li className={styles.paso}>
          <span className={styles.numero}>2.</span>
          Un administrador vincula tu tarjeta NFC
        </li>
        <li className={styles.paso}>
          <span className={styles.numero}>3.</span>
          Compra un plan y empieza a pedalear
        </li>
      </ol>
    </aside>
  );
}

export default RegistroBienvenida;