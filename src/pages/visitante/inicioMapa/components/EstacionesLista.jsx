import styles from './EstacionesLista.module.css';

function IconoBuscar() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function EstacionesLista({ estaciones, busqueda, onBuscar, seleccionadaId, onSeleccionar }) {
  return (
    <section className={styles.raiz}>
      <div className={styles.buscador}>
        <IconoBuscar />
        <input
          type="search"
          className={styles.inputBuscar}
          placeholder="Buscar estación por nombre"
          aria-label="Buscar estación por nombre"
          value={busqueda}
          onChange={(evento) => onBuscar(evento.target.value)}
        />
      </div>

      <ul className={styles.lista}>
        {estaciones.map((estacion) => {
          const activa = estacion.id === seleccionadaId;

          return (
            <li key={estacion.id}>
              <button
                type="button"
                aria-pressed={activa}
                className={`${styles.tarjeta} ${activa ? styles.activa : ''}`}
                onClick={() => onSeleccionar(estacion.id)}
              >
                <span className={styles.nombre}>{estacion.nombre}</span>
                <span className={styles.zona}>{estacion.zona}</span>

                <span className={styles.estado}>
                  <span className={styles.pastilla}>
                    {estacion.bicicletas} bicicletas disponibles
                  </span>
                  <span>{estacion.anclajes} anclajes libres</span>
                </span>
              </button>
            </li>
          );
        })}

        {estaciones.length === 0 && (
          <li className={styles.vacio}>No encontramos estaciones con ese nombre.</li>
        )}
      </ul>
    </section>
  );
}

export default EstacionesLista;