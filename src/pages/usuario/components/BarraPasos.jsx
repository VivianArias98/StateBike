import { IconoCheck } from '../../../components/Iconos/Iconos.jsx';
import styles from './BarraPasos.module.css';

// Barra de pasos del flujo: UNA sola tarjeta con los pasos separados por divisores.
// El paso activo se marca con fondo verde claro.
function BarraPasos({ pasos }) {
  return (
    <nav className={`tarjeta ${styles.raiz}`} aria-label="Pasos para adquirir el plan">
      {pasos.map((paso, indice) => (
        <div
          key={indice}
          className={paso.estado === 'activo' ? `${styles.paso} ${styles.pasoActivo}` : styles.paso}
          aria-current={paso.estado === 'activo' ? 'step' : undefined}
        >
          <span className={`${styles.indicador} ${styles[paso.estado]}`} aria-hidden="true">
            {paso.estado === 'completado' ? <IconoCheck /> : indice + 1}
          </span>
          <div className={styles.textos}>
            <p className={styles.etiqueta}>{paso.etiqueta}</p>
            <p className={styles.titulo}>{paso.titulo}</p>
            {paso.detalle && <p className={styles.detalle}>{paso.detalle}</p>}
          </div>
        </div>
      ))}
    </nav>
  );
}

export default BarraPasos;
