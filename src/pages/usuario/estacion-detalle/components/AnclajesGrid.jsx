import React from 'react';
import styles from './AnclajesGrid.module.css';

function AnclajesGrid({ anclajeSeleccionado, onSeleccionarAnclaje }) {
  const anclajesOcupados = [1, 2, 3, 4, 5, 6, 7];
  const anclajesLibres = [8, 9, 10, 11, 12];

  return (
    <div className={styles.contenedorAnclajes}>
      <div className={styles.headerGrid}>
        <h2 className={styles.tituloSeccion}>Anclajes de la estación</h2>
        <span className="insignia insignia--activa">
          ANCLAJE ACTIVO: {anclajeSeleccionado < 10 ? `0${anclajeSeleccionado}` : anclajeSeleccionado}
        </span>
      </div>
      <p className={styles.subtituloSeccion}>Selecciona una bicicleta disponible para iniciar tu viaje.</p>

      <div className={styles.anclajesGrid}>
        {anclajesOcupados.map((num) => (
          <button
            key={num}
            type="button"
            className={`${styles.anclajeItem} ${styles.anclajeOcupado} ${
              anclajeSeleccionado === num ? styles.anclajeSeleccionado : ''
            }`}
            onClick={() => onSeleccionarAnclaje(num)}
          >
            {num < 10 ? `0${num}` : num}<br />BICI
          </button>
        ))}
        {anclajesLibres.map((num) => (
          <button
            key={num}
            type="button"
            className={`${styles.anclajeItem} ${styles.anclajeLibre} ${
              anclajeSeleccionado === num ? styles.anclajeSeleccionado : ''
            }`}
            onClick={() => onSeleccionarAnclaje(num)}
          >
            {num < 10 ? `0${num}` : num}<br />LIBRE
          </button>
        ))}
      </div>

      <div className={styles.estadoBanner}>
        <span>
          ✅ Bicicleta <strong>#SB-0104</strong> lista para desanclaje en el Anclaje {anclajeSeleccionado < 10 ? `0${anclajeSeleccionado}` : anclajeSeleccionado}.
        </span>
        <span className="insignia insignia--activa">BATERÍA: 98%</span>
      </div>
    </div>
  );
}

export default AnclajesGrid;