import React from 'react';
import styles from './EstacionesLista.module.css';

function EstacionesLista({ estaciones, onSeleccionarEstacion }) {
  return (
    <div className={styles.estacionesLista}>
      {estaciones.map((est) => (
        <article 
          key={est.id} 
          className={styles.estacionTarjeta} 
          onClick={() => onSeleccionarEstacion(est)}
        >
          <div>
            <h2 className={styles.estacionNombre}>{est.nombre}</h2>
            <p className={styles.estacionDireccion}>📍 {est.direccion}</p>
            <p className={styles.estacionEstado}>{est.bicis} bicicletas · {est.libres} anclajes libres</p>
          </div>
          <span>›</span>
        </article>
      ))}
    </div>
  );
}

export default EstacionesLista;