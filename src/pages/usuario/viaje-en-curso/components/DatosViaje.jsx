import styles from './DatosViaje.module.css';

// Tabla de datos del viaje.
// filas: [{ etiqueta, valor, tipo }] donde tipo puede ser 'chip' (borde) u 'oscuro' (fondo negro).
function DatosViaje({ idViaje, filas }) {
  return (
    <section className={`tarjeta ${styles.raiz}`} aria-labelledby="titulo-datos-viaje">
      <header className={styles.cabecera}>
        <h2 id="titulo-datos-viaje" className={styles.titulo}>DATOS DEL VIAJE</h2>
        <span className={styles.id}>{idViaje}</span>
      </header>

      <dl className={styles.lista}>
        {filas.map((fila) => (
          <div key={fila.etiqueta} className={styles.fila}>
            <dt className={styles.etiqueta}>{fila.etiqueta}</dt>
            <dd className={styles.valor}>
              {fila.tipo === 'chip' && <span className={styles.chip}>{fila.valor}</span>}
              {fila.tipo === 'oscuro' && <span className={styles.oscuro}>{fila.valor}</span>}
              {!fila.tipo && fila.valor}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default DatosViaje;
