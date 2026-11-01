import styles from './DatosViaje.module.css';

// Tabla de datos del viaje.
// filas: [{ etiqueta, valor }]
function DatosViaje({ idViaje, filas }) {
  return (
    <section className={`tarjeta ${styles.raiz}`} aria-labelledby="titulo-datos-viaje">
      <header className={styles.cabecera}>
        <h2 id="titulo-datos-viaje" className={styles.titulo}>
          DATOS DEL VIAJE
        </h2>
        <span className={styles.id}>ID #{idViaje}</span>
      </header>

      <dl>
        {filas.map((fila) => (
          <div key={fila.etiqueta} className={styles.fila}>
            <dt className={styles.etiqueta}>{fila.etiqueta}</dt>
            <dd className={styles.valor}>{fila.valor}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default DatosViaje;