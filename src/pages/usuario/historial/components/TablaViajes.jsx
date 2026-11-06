import styles from './TablaViajes.module.css';

// Componente de presentación: solo dibuja la tabla de viajes recibidos por props.
// La lógica de filtrado vive en HistorialPage.
function TablaViajes({ viajes }) {
  if (viajes.length === 0) {
    return (
      <p className={styles.vacio}>
        No hay registros para el rango seleccionado.
      </p>
    );
  }

  return (
    <div className={`tabla ${styles.raiz}`}>
      <table>
        <thead>
          <tr>
            <th className={styles.colFecha}>Fecha y hora</th>
            <th className={styles.colOrigen}>Origen</th>
            <th className={styles.colDestino}>Destino</th>
            <th className={styles.colDuracion}>Duración</th>
            <th className={styles.colRuta}>Detalle / ruta</th>
          </tr>
        </thead>
        <tbody>
          {viajes.map((viaje) => (
            <tr key={viaje.id}>
              <td>
                <span className={`punto-vivo ${styles.punto}`} aria-hidden="true" />
                {viaje.fechaHora}
              </td>
              <td>{viaje.origen}</td>
              <td>{viaje.destino}</td>
              <td className={styles.duracion}>{viaje.duracion} min</td>
              <td>
                {/* Pendiente: abrir el recorrido del viaje en el mapa */}
                <button type="button" className={`enlace ${styles.enlaceRuta}`}>
                  Ver ruta / mapa →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaViajes;
