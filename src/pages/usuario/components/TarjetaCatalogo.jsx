import { IconoCheck } from '../../../components/Iconos/Iconos.jsx';
import styles from './TarjetaCatalogo.module.css';

// Tarjeta de un plan del catálogo de Mi Plan. Solo dibuja lo que recibe.
// variante: 'primario' (lima), 'suave' (verde claro) o 'actual' (plan en uso).
// deshabilitada: bloquea el botón (por defecto solo en la variante 'actual').
function TarjetaCatalogo({
  encabezado,
  vigencia,
  nombre,
  descripcion,
  precio,
  unidad,
  detallePrecio,
  caracteristicas,
  etiqueta,
  destacada = false,
  variante = 'suave',
  deshabilitada = variante === 'actual',
  accion,
  onAccion,
}) {
  return (
    <article className={`tarjeta ${styles.raiz} ${destacada ? styles.destacada : ''}`}>
      {etiqueta && <span className={styles.etiqueta}>{etiqueta}</span>}

      <header className={styles.cabecera}>
        <p className={styles.encabezado}>{encabezado}</p>
        {vigencia && <span className={styles.vigencia}>{vigencia}</span>}
      </header>

      {nombre && <h3 className={styles.nombre}>{nombre}</h3>}
      {descripcion && <p className={styles.descripcion}>{descripcion}</p>}

      <div className={styles.precioBloque}>
        <p className={styles.precio}>
          <span className={styles.cifra}>{precio}</span>
          {unidad && <span className={styles.unidad}>{unidad}</span>}
        </p>
        {detallePrecio && <p className={styles.detallePrecio}>{detallePrecio}</p>}
      </div>

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
        className={`boton boton--bloque ${styles[variante]}`}
        disabled={deshabilitada}
        onClick={onAccion}
      >
        {accion}
      </button>
    </article>
  );
}

export default TarjetaCatalogo;
