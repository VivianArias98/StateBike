import styles from './TablaViajes.module.css';

// Componente de presentación: solo dibuja la tabla de viajes recibidos por props.
// La lógica de filtrado y selección vive en HistorialPage.
function TablaViajes({ viajes }) {
  if (viajes.length === 0) {
    return (
      <p className={styles.vacio}>
        No se encontraron viajes para el período seleccionado.
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaViajes;
