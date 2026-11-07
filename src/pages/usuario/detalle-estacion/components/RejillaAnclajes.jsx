import { IconoCheck } from '../../../../components/Iconos/Iconos.jsx';
import styles from './RejillaAnclajes.module.css';

// Cuadrícula de anclajes. Solo se pueden elegir los que tienen bicicleta; los libres quedan deshabilitados.
function RejillaAnclajes({ anclajes, seleccionado, onSeleccionar }) {
  return (
    <ul className={styles.rejilla} aria-label="Anclajes de la estación">
      {anclajes.map((anclaje) => {
        const activo = anclaje.numero === seleccionado;
        const clases = [
          styles.anclaje,
          anclaje.tieneBicicleta ? styles.conBicicleta : styles.libre,
          activo ? styles.activo : '',
        ].join(' ');

        return (
          <li key={anclaje.numero} className={styles.celda}>
            <button
              type="button"
              className={clases}
              disabled={!anclaje.tieneBicicleta}
              aria-pressed={activo}
              onClick={() => onSeleccionar(anclaje.numero)}
            >
              {activo && (
                <span className={styles.marca} aria-hidden="true">
                  <IconoCheck />
                </span>
              )}
              <span className={styles.numero}>{String(anclaje.numero).padStart(2, '0')}</span>
              <span className={styles.estado}>{anclaje.tieneBicicleta ? 'Bici' : 'Libre'}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default RejillaAnclajes;
