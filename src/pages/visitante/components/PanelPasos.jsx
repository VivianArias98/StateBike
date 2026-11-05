import { Icono } from './IconosVisitante.jsx';
import styles from './PanelPasos.module.css';

// Lista de pasos del proceso de registro (sobre fondo oscuro).
// estado: 'hecho' (check), 'activo' (número resaltado) o 'pendiente' (atenuado).
function PanelPasos({ pasos }) {
  return (
    <ol className={styles.lista}>
      {pasos.map((paso, indice) => (
        <li key={paso.titulo} className={`${styles.paso} ${styles[paso.estado]}`}>
          <span className={styles.marcador} aria-hidden="true">
            {paso.estado === 'hecho' ? <Icono nombre="check" /> : indice + 1}
          </span>

          <span className={styles.texto}>
            <span className={styles.titulo}>{paso.titulo}</span>
            {paso.nota && <span className={styles.nota}>{paso.nota}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default PanelPasos;
