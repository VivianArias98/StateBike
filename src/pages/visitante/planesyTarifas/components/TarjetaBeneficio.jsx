import { Icono } from '../../components/IconosVisitante.jsx';
import styles from './TarjetaBeneficio.module.css';

function TarjetaBeneficio({ icono, titulo, texto }) {
  return (
    <article className={styles.raiz}>
      <span className={styles.icono} aria-hidden="true">
        <Icono nombre={icono} />
      </span>
      <div className={styles.contenido}>
        <h3 className={styles.titulo}>{titulo}</h3>
        <p className={styles.texto}>{texto}</p>
      </div>
    </article>
  );
}

export default TarjetaBeneficio;
