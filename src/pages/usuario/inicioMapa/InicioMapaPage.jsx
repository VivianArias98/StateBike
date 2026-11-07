import React from 'react';
import MapaTunja from '../../../components/MapaTunja/MapaTunja';
import MetricasUsuario from './components/MetricasUsuario';
import EstacionesLista from './components/EstacionesLista';
import styles from './InicioMapaPage.module.css';

function InicioMapaPage({ onVerDetalleEstacion }) {
  const estaciones = [
    { id: '1', nombre: 'Estación Centro / Plaza de Bolívar', direccion: 'Cra. 10 #20-15', bicis: 7, libres: 5, lat: 5.5323, lng: -73.3614 },
    { id: '2', nombre: 'Universidad de Boyacá', direccion: 'Carrera 2ª Este #64-169', bicis: 2, libres: 8, lat: 5.5539, lng: -73.3530 },
    { id: '3', nombre: 'Centro comercial Viva', direccion: 'Avenida Universitaria', bicis: 6, libres: 4, lat: 5.5412, lng: -73.3562 }
  ];

  return (
    <div className={styles.raiz}>
      <header className={styles.saludo}>
        <span className={styles.migas}>USUARIO / INICIO Y ESTACIONES / PANTALLA PRINCIPAL</span>
        <div className={styles.encabezadoTitulo}>
          <h1 className="titulo-pagina">Hola, Camila</h1>
          <span className="insignia insignia--activa">● RED OPERATIVA TUNJA</span>
        </div>
        <p className={styles.subtitulo}>
          Consulta las estaciones de Tunja y encuentra una bicicleta para tu próximo viaje.
        </p>
      </header>

      {/* Componente modular de 3 métricas */}
      <MetricasUsuario />

      {/* Grid Principal: Mapa a la izquierda, Lista de estaciones a la derecha */}
      <div className={styles.principalGrid}>
        <div className={styles.columnaMapa}>
          <MapaTunja 
            estaciones={estaciones} 
            onSeleccionarEstacion={(est) => onVerDetalleEstacion(est)} 
          />
        </div>

        <div className={styles.columnaLista}>
          <div className={styles.encabezadoLista}>
            <h2 className={styles.tituloSeccion}>Estaciones cercanas</h2>
            <span className={styles.conteoEstaciones}>3 ESTACIONES</span>
          </div>

          <EstacionesLista 
            estaciones={estaciones} 
            onSeleccionarEstacion={onVerDetalleEstacion} 
          />

          <button 
            type="button" 
            className="boton boton--primario boton--bloque"
            onClick={() => onVerDetalleEstacion(estaciones[0])}
          >
            🔓 DESBLOQUEAR BICICLETA
          </button>

          <p className={styles.notaInferior}>
            💡 También puedes acercar tu tarjeta física <strong>#TUN-4821</strong> directamente al ítem del anclaje.
          </p>
        </div>
      </div>
    </div>
  );
}

export default InicioMapaPage;