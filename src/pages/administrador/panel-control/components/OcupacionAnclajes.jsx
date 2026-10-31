import Etiqueta from '../../../../components/Etiqueta/Etiqueta.jsx';
import styles from './OcupacionAnclajes.module.css';

//Ocupación de anclajes por estación 
//estaciones: [{ id, nombre, ocupados, capacidad, porcentaje, lleno }]
function OcupacionAnclajes({ estaciones, totalOcupados, capacidadTotal }) {
  return (
    <section className={`tarjeta ${styles.raiz}`} aria-labelledby="titulo-ocupacion">
      <header className={styles.cabecera}>
        <h2 id="titulo-ocupacion" className={styles.titulo}>
          Ocupación de anclajes por estación
        </h2>
        <span className={styles.nota}>Capacidad Total</span>
      </header>

      <ul className={styles.lista}>
        {estaciones.map((estacion) => (
          <li key={estacion.id} className={styles.fila}>
            <div className={styles.datos}>
              <span className={styles.nombre}>
                {estacion.nombre}
                {estacion.lleno && <Etiqueta texto="LLENO" color="amarilla" />}
              </span>
              <span className={styles.conteo}>
                {estacion.ocupados}/{estacion.capacidad}
              </span>
            </div>

            <div
              className={styles.barra}
              role="progressbar"
              aria-label={`Ocupación de ${estacion.nombre}`}
              aria-valuenow={estacion.ocupados}
              aria-valuemin={0}
              aria-valuemax={estacion.capacidad}
            >
              {/* El ancho es un valor dinámico, por eso va en línea */}
              <div className={styles.relleno} style={{ width: `${estacion.porcentaje}%` }} />
            </div>
          </li>
        ))}
      </ul>

      <footer className={styles.pie}>
        <span>Fuente: Sensores de telemetría IoT StationBike</span>
        <span>
          Capacidad: {totalOcupados}/{capacidadTotal} anclajes ocupados
        </span>
      </footer>
    </section>
  );
}

export default OcupacionAnclajes;