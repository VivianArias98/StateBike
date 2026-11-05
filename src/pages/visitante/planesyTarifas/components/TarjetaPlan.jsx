import { Icono } from '../../components/IconosVisitante.jsx';
import styles from './TarjetaPlan.module.css';

// Tarjeta de un plan del catálogo. El plan "actual" lleva borde verde,
// etiqueta "TU PLAN ACTUAL" y un estado en lugar del botón de compra.
function TarjetaPlan({ plan }) {
  const { codigo, dias, nombre, descripcion, precio, unidad, lineas, actual } = plan;

  return (
    <article
      className={`${styles.raiz} ${actual ? styles.actual : ''}`}
      aria-label={`${nombre}, ${precio} ${unidad}`}
    >
      {actual && <span className={styles.etiquetaActual}>TU PLAN ACTUAL</span>}

      <header className={styles.cabecera}>
        <span className={styles.codigo}>{codigo}</span>
        <span className={styles.dias}>{dias}</span>
      </header>

      <h2 className={styles.nombre}>{nombre}</h2>
      <p className={styles.descripcion}>{descripcion}</p>

      <p className={styles.precio}>
        <span className={actual ? styles.precioVerde : ''}>{precio}</span>
        <span className={styles.unidad}>{unidad}</span>
      </p>

      <div className={styles.separador} aria-hidden="true" />

      <ul className={styles.lista}>
        {lineas.map((linea, indice) => (
          <li key={indice} className={styles.linea}>
            <span className={styles.check} aria-hidden="true">
              <Icono nombre="check" />
            </span>
            <span>
              {linea.pre}
              <strong>{linea.fuerte}</strong>
              {linea.post}
            </span>
          </li>
        ))}
        <li className={`${styles.linea} ${styles.lineaSecundaria}`}>
          <span className={styles.info} aria-hidden="true">
            <Icono nombre="info" />
          </span>
          <span>
            Exceso: <strong>$100 COP/min</strong>
          </span>
        </li>
      </ul>

      {actual ? (
        <p className={styles.estadoActivo}>
          <Icono nombre="candado" />
          <span>Plan Activo – En Uso</span>
        </p>
      ) : (
        <a href="/login" className={`boton boton--primario ${styles.adquirir}`}>
          Adquirir Plan
          <Icono nombre="flechaDerecha" />
        </a>
      )}
    </article>
  );
}

export default TarjetaPlan;
