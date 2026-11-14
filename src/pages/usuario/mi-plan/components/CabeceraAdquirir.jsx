import { IconoCheck } from '../../../../components/Iconos/Iconos.jsx';
import styles from './CabeceraAdquirir.module.css';

// Encabezado de las pantallas del flujo Adquirir plan (compartido por los 4 pasos)
function CabeceraAdquirir({ etiqueta, titulo, insignia, subtitulo, chip, conCheck = false }) {
  return (
    <header className={styles.cabecera}>
      <div className={styles.bloqueTitulo}>
        {etiqueta && <p className={styles.etiqueta}>{etiqueta}</p>}
        <div className={styles.filaTitulo}>
          <h1 className={styles.titulo}>{titulo}</h1>
          {insignia && <span className={styles.insignia}>{insignia}</span>}
        </div>
        <p className={styles.subtitulo}>{subtitulo}</p>
      </div>
      <span className={styles.chip}>
        {conCheck && <IconoCheck />}
        {chip}
      </span>
    </header>
  );
}

export default CabeceraAdquirir;
