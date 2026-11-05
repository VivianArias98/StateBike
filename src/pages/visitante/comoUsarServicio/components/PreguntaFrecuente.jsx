import { Icono } from '../../components/IconosVisitante.jsx';
import styles from './PreguntaFrecuente.module.css';

// Pregunta con su respuesta visible (sin desplegar) y un icono por pregunta.
function PreguntaFrecuente({ pregunta, respuesta, icono }) {
  return (
    <article className={`tarjeta ${styles.raiz}`}>
      <span className={styles.icono} aria-hidden="true">
        <Icono nombre={icono} />
      </span>

      <div className={styles.contenido}>
        <h3 className={styles.pregunta}>{pregunta}</h3>
        <p className={styles.respuesta}>{respuesta}</p>
      </div>
    </article>
  );
}

export default PreguntaFrecuente;
