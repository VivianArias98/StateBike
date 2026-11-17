import Etiqueta from '../../../../components/Etiqueta/Etiqueta.jsx';
import { IconoUbicacion } from '../../../../components/Iconos/Iconos.jsx';
import styles from './TablaViajes.module.css';

// Componente de presentación: dibuja la tabla de viajes recibidos por props.
// La lógica de filtrado vive en HistorialPage.
function TablaViajes({ viajes, hayFiltro = false }) {
  if (viajes.length === 0) {
    return (
      <p className={styles.vacio}>
        {hayFiltro
          ? 'No se encontraron viajes en el rango de fechas seleccionado.'
          : 'Aún no has realizado ningún viaje en bicicleta. Cuando desbloquees una bicicleta en una estación, tus recorridos aparecerán registrados aquí.'}
      </p>
    );
  }

  return (
    <div className={`tabla ${styles.raiz}`}>
      <table>
        <caption className="sr-only">Historial de viajes realizados</caption>
        <thead>
          <tr>
            <th scope="col" className={styles.colInicio}>Fecha y hora inicio</th>
            <th scope="col" className={styles.colOrigen}>Origen</th>
            <th scope="col" className={styles.colFin}>Fecha y hora fin</th>
            <th scope="col" className={styles.colDestino}>Destino</th>
            <th scope="col" className={styles.colDuracion}>Duración</th>
            <th scope="col" className={styles.colExceso}>Cobro por exceso</th>
          </tr>
        </thead>
        <tbody>
          {viajes.map((viaje) => {
            const tieneExceso = viaje.costoExceso > 0 || viaje.minutosExceso > 0;

            return (
              <tr key={viaje.id}>
                <td className={styles.celdaFecha}>
                  <span className={`punto-vivo ${styles.punto}`} aria-hidden="true" />
                  {viaje.fechaHoraInicio || viaje.fechaHora}
                </td>
                <td>
                  <span className={styles.origen}>
                    <span className={styles.pin} aria-hidden="true">
                      <IconoUbicacion />
                    </span>
                    {viaje.origen}
                  </span>
                </td>
                <td className={styles.celdaFecha}>
                  {viaje.fechaHoraFin || '—'}
                </td>
                <td className={styles.destino}>
                  {viaje.destino}
                </td>
                <td className={styles.colDuracion}>
                  <Etiqueta
                    texto={`${viaje.duracion} min`}
                    color={tieneExceso ? 'amarilla' : 'menta'}
                  />
                </td>
                <td className={styles.colExceso}>
                  {viaje.costoExceso > 0 ? (
                    <span className={styles.badgeExceso}>
                      +${new Intl.NumberFormat('es-CO').format(viaje.costoExceso)} COP
                    </span>
                  ) : (
                    <span className={styles.sinExceso}>$0 COP</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TablaViajes;
