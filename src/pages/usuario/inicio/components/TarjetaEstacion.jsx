import { IconoBicicleta, IconoFlecha, IconoUbicacion } from '../../../../components/Iconos/Iconos.jsx';
import styles from './TarjetaEstacion.module.css';

// Fila de una estación cercana. Es un botón para que se pueda usar con teclado.
function TarjetaEstacion({ nombre, direccion, bicicletas, anclajesLibres, onAbrir }) {
  return (
    <button type="button" className={`tarjeta ${styles.raiz}`} onClick={onAbrir}>
      <span className={styles.icono} aria-hidden="true">
        <IconoBicicleta />
      </span>

      <span className={styles.texto}>
        <span className={styles.nombre}>{nombre}</span>
        <span className={styles.direccion}>
          <IconoUbicacion /> {direccion}
        </span>
        <span className={styles.disponibilidad}>
          <strong className={styles.bicicletas}>{bicicletas} bicicletas</strong> · {anclajesLibres} anclajes libres
        </span>
      </span>

      <span className={styles.flecha} aria-hidden="true">
        <IconoFlecha />
      </span>
    </button>
  );
}

export default TarjetaEstacion;
