import React, { useState } from 'react';
import MapaTunja from '../../../components/MapaTunja/MapaTunja';
import AnclajesGrid from './components/AnclajesGrid';
import styles from './EstacionDetallePage.module.css';

function EstacionDetallePage({ estacion, onVolver }) {
  const [anclajeSeleccionado, setAnclajeSeleccionado] = useState(1);

  const estacionActual = estacion || {
    id: '1',
    nombre: 'Estación Centro',
    direccion: 'Cra. 10 #20-15 · Barrio Centro, Tunja',
    lat: 5.5323,
    lng: -73.3614,
    bicis: 7,
    libres: 5
  };

  return (
    <div className={styles.raiz}>
      <header className={styles.saludo}>
        <p className={styles.migas}>Usuario / Inicio y estaciones / Detalle de estación</p>
        <div className={styles.encabezadoTitulo}>
          <h1 className="titulo-pagina">{estacionActual.nombre}</h1>
          <span className="insignia insignia--activa">● ACTIVA</span>
        </div>
        <p className={styles.subtitulo}>📍 {estacionActual.direccion}</p>
      </header>

      {/* Métricas de la estación */}
      <div className={styles.metricasGrid}>
        <article className="tarjeta">
          <p className={styles.metricaValor}>12</p>
          <p className={styles.subtituloMetrica}>Anclajes totales</p>
        </article>
        <article className="tarjeta">
          <p className={styles.metricaValor}>{estacionActual.bicis}</p>
          <p className={styles.subtituloMetrica}>Bicicletas disponibles</p>
        </article>
        <article className="tarjeta">
          <p className={styles.metricaValor}>{estacionActual.libres}</p>
          <p className={styles.subtituloMetrica}>Anclajes libres</p>
        </article>
      </div>

      {/* Grid con Mapa enfocado a la izquierda y Anclajes a la derecha */}
      <div className={styles.principalGrid}>
        <div className={styles.columnaMapa}>
          <MapaTunja 
            centro={[estacionActual.lat, estacionActual.lng]} 
            zoom={16} 
            estaciones={[estacionActual]} 
          />
        </div>

        <article className="tarjeta">
          <AnclajesGrid 
            anclajeSeleccionado={anclajeSeleccionado}
            onSeleccionarAnclaje={setAnclajeSeleccionado}
          />
        </article>
      </div>

      {/* Botones de acción inferiores */}
      <div className={styles.accionesGrupo}>
        <button type="button" className="boton boton--primario boton--bloque">
          🔓 DESBLOQUEAR BICICLETA
        </button>
        <button
          type="button"
          className="boton boton--secundario boton--bloque"
          onClick={onVolver}
        >
          ← VOLVER AL MAPA
        </button>
      </div>
    </div>
  );
}

export default EstacionDetallePage;