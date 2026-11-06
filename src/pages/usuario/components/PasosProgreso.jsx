import { IconoCheck } from '../../../components/Iconos/Iconos.jsx';
import styles from './PasosProgreso.module.css';

// Indicador de pasos. pasos: [{ titulo, detalle }]. pasoActual: índice del paso en curso (0 = primero).
// Los pasos anteriores quedan como hechos, el actual como activo y los siguientes como pendientes.
function PasosProgreso({ pasos, pasoActual, etiqueta = 'Progreso' }) {
  return (
    <ol className={styles.lista} aria-label={etiqueta}>
      {pasos.map((paso, indice) => {
        const estado = indice < pasoActual ? 'hecho' : indice === pasoActual ? 'activo' : 'pendiente';
        return (
          <li
            key={paso.titulo}
            className={`${styles.paso} ${styles[estado]}`}
            aria-current={estado === 'activo' ? 'step' : undefined}
          >
            <span className={styles.circulo} aria-hidden="true">
              {estado === 'hecho' ? <IconoCheck /> : indice + 1}
            </span>
            <span className={styles.texto}>
              <span className={styles.titulo}>{paso.titulo}</span>
              {paso.detalle && <span className={styles.detalle}>{paso.detalle}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default PasosProgreso;
