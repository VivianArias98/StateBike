import { IconoCheck } from '../../../components/Iconos/Iconos.jsx';
import styles from './TarjetaPlan.module.css';

// Tarjeta de un plan del catálogo. Solo dibuja lo que recibe; la acción la decide la página.
// insignia: texto de la pastilla superior (por ejemplo "Recomendado" o "Tu plan actual").
// destacada: resalta la tarjeta (plan recomendado, actual o seleccionado).
function TarjetaPlan({
  codigo,
  vigencia,
  nombre,
  descripcion,
  precio,
  unidad,
  caracteristicas,
  insignia,
  destacada = false,
  accion,
  accionDeshabilitada = false,
  onAccion,
}) {
  return (
    <article className={`tarjeta ${styles.raiz} ${destacada ? styles.destacada : ''}`}>
      <header className={styles.cabecera}>
        <div className={styles.identificacion}>
          {codigo && <p className={styles.codigo}>{codigo}</p>}
          {insignia && <span className={styles.insignia}>{insignia}</span>}
        </div>
        {vigencia && <span className={styles.vigencia}>{vigencia}</span>}
      </header>

      <h3 className={styles.nombre}>{nombre}</h3>
      {descripcion && <p className={styles.descripcion}>{descripcion}</p>}

      <p className={styles.precio}>
        <span className={styles.cifra}>{precio}</span>
        {unidad && <span className={styles.unidad}>{unidad}</span>}
      </p>

      <ul className={styles.caracteristicas}>
        {caracteristicas.map((caracteristica) => (
          <li key={caracteristica}>
            <span className={styles.check}>
              <IconoCheck />
            </span>
            {caracteristica}
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={`boton boton--bloque ${destacada ? 'boton--acento' : ''} ${styles.accion}`}
        disabled={accionDeshabilitada}
        onClick={onAccion}
      >
        {accion}
      </button>
    </article>
  );
}

export default TarjetaPlan;
