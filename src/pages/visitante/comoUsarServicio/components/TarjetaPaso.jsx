import { Icono } from '../../components/IconosVisitante.jsx';
import styles from './TarjetaPaso.module.css';

// Paso numerado de "Pasos para utilizar el sistema".
function TarjetaPaso({ numero, etiqueta, titulo, texto, fase, icono }) {
  return (
    <article className={`tarjeta ${styles.raiz}`}>
      <div className={styles.cabecera}>
        <span className={styles.numero}>{numero}</span>
        <span className={`insignia ${styles.etiqueta}`}>{etiqueta}</span>
      </div>

      <span className={styles.icono} aria-hidden="true">
        <Icono nombre={icono} />
      </span>

      <h3 className={styles.titulo}>{titulo}</h3>
      <p className={styles.texto}>{texto}</p>

      <p className={styles.fase}>{fase}</p>
    </article>
  );
}

export default TarjetaPaso;
