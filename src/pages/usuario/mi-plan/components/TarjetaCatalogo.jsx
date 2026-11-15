import { IconoCheck, IconoMedalla } from '../../../../components/Iconos/Iconos.jsx';
import styles from './TarjetaCatalogo.module.css';

// Tarjeta de un plan del catálogo de Mi Plan.
function TarjetaCatalogo({
  encabezado,
  vigencia,
  nombre,
  descripcion,
  precio,
  unidad,
  detallePrecio,
  caracteristicas = [],
  etiqueta,
  destacada = false,
  esRecomendado = false,
  variante = 'suave',
  deshabilitada = variante === 'actual',
  accion,
  onAccion,
}) {
  return (
    <article
      className={`tarjeta ${styles.raiz} ${destacada ? styles.destacada : ''} ${
        esRecomendado ? styles.recomendadaCard : ''
      }`}
    >
      {etiqueta && (
        <span
          className={`${styles.etiqueta} ${
            esRecomendado ? styles.etiquetaRecomendada : ''
          }`}
        >
          {esRecomendado && (
            <span className={styles.iconoMedalla} aria-hidden="true">
              <IconoMedalla />
            </span>
          )}
          <span>{etiqueta}</span>
        </span>
      )}

      <header className={styles.cabecera}>
        <h3 className={styles.encabezado}>{encabezado}</h3>
        {vigencia && <span className={styles.vigencia}>{vigencia}</span>}
      </header>

      {nombre && <p className={styles.nombre}>{nombre}</p>}
      {descripcion && <p className={styles.descripcion}>{descripcion}</p>}

      <div className={styles.precioBloque}>
        <div className={styles.precio}>
          <span className={styles.cifra}>{precio}</span>
          {unidad && <span className={styles.unidad}>{unidad}</span>}
        </div>
        {detallePrecio && <p className={styles.detallePrecio}>{detallePrecio}</p>}
      </div>

      <ul className={styles.caracteristicas}>
        {caracteristicas.map((caracteristica) => (
          <li key={caracteristica}>
            <span className={styles.check} aria-hidden="true">
              <IconoCheck />
            </span>
            <span>{caracteristica}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={`boton boton--bloque ${styles[variante] || styles.suave}`}
        disabled={deshabilitada}
        onClick={onAccion}
      >
        {accion}
      </button>
    </article>
  );
}

export default TarjetaCatalogo;
