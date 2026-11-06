import styles from './OpcionesIncidencia.module.css';

// Opciones del tipo de incidencia (botones de radio). El valor lo guarda la página.
function OpcionesIncidencia({ opciones, valor, onCambiar }) {
  return (
    <div className={styles.raiz} role="radiogroup" aria-label="Tipo de incidencia">
      {opciones.map((opcion) => {
        const seleccionada = opcion.valor === valor;
        return (
          <label
            key={opcion.valor}
            className={seleccionada ? `${styles.opcion} ${styles.seleccionada}` : styles.opcion}
          >
            <input
              type="radio"
              name="tipo-incidencia"
              value={opcion.valor}
              checked={seleccionada}
              onChange={() => onCambiar(opcion.valor)}
              className={styles.radio}
            />
            <span>{opcion.texto}</span>
          </label>
        );
      })}
    </div>
  );
}

export default OpcionesIncidencia;
