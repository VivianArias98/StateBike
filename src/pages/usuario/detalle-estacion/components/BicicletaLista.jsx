import { IconoCheck } from '../../../../components/Iconos/Iconos.jsx';
import styles from './BicicletaLista.module.css';

// Caja verde que confirma la bicicleta lista para desanclar en el anclaje elegido
function BicicletaLista({ numeroAnclaje }) {
  return (
    <div className={styles.raiz}>
      <span className={styles.marca} aria-hidden="true">
        <IconoCheck />
      </span>
      <p className={styles.texto}>
        Bicicleta <strong>#SB-0104</strong> lista para desanclaje en el <strong>Anclaje {numeroAnclaje}</strong>.
      </p>
      <span className={styles.bateria}>BATERÍA: 98%</span>
    </div>
  );
}

export default BicicletaLista;
