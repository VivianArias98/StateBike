import styles from './EspecificacionServicio.module.css';

// Tabla de especificación del servicio. Solo dibuja, no guarda estado.
// filas: [{ etiqueta, valor, destacado }]
// filaBicicleta: { icono, valor } — fila especial con fondo oscuro
function EspecificacionServicio({ filas, filaBicicleta, onVerHistorial, onLiberarBicicleta }) {
  return (
    <section className={`tarjeta ${styles.raiz}`}>
      <h2 className={styles.titulo}>Especificación del servicio</h2>

      <dl className={styles.lista}>
        {filas.map((fila) => (
          <div key={fila.etiqueta} className={styles.fila}>
            <dt className={styles.etiqueta}>{fila.etiqueta}</dt>
            <dd className={fila.destacado ? `${styles.valor} ${styles.valorDestacado}` : styles.valor}>
              {fila.valor}
            </dd>
          </div>
        ))}
      </dl>

      {filaBicicleta && (
        <div className={styles.filaBici}>
          <span className={styles.filaBiciEtiqueta}>Bicicleta asegurada</span>
          <span className={styles.filaBiciValor}>
            <span aria-hidden="true">🔗</span>
            {filaBicicleta}
          </span>
        </div>
      )}

      <div className={styles.acciones}>
        <button
          type="button"
          className={`boton boton--bloque ${styles.botonHistorial}`}
          onClick={onVerHistorial}
        >
          VER DETALLE EN HISTORIAL →
        </button>
        <button
          type="button"
          className="boton boton--acento boton--bloque"
          onClick={onLiberarBicicleta}
        >
          LIBERAR OTRA BICICLETA 🚲
        </button>
      </div>
    </section>
  );
}

export default EspecificacionServicio;
