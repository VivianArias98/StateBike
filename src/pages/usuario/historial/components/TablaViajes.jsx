import Etiqueta from '../../../../components/Etiqueta/Etiqueta.jsx';
import { IconoUbicacion } from '../../../../components/Iconos/Iconos.jsx';
import styles from './TablaViajes.module.css';

// Minutos incluidos en el plan mensual: un viaje por encima de ese tiempo se marca en amarillo
const MINUTOS_INCLUIDOS = 45;

// Componente de presentación: solo dibuja la tabla de viajes recibidos por props.
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
              <td className={styles.celdaFecha}>
                <span className={`punto-vivo ${styles.punto}`} aria-hidden="true" />
                {viaje.fechaHora}
              </td>
              <td>
                <span className={styles.origen}>
                  <span className={styles.pin} aria-hidden="true">
                    <IconoUbicacion />
                  </span>
                  {viaje.origen}
                </span>
              </td>
              <td className={styles.destino}>{viaje.destino}</td>
              <td className={styles.colDuracion}>
                <Etiqueta
                  texto={`${viaje.duracion} min`}
                  color={viaje.duracion > MINUTOS_INCLUIDOS ? 'amarilla' : 'menta'}
                />
              </td>
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
