import React, { useState } from 'react';
import styles from './EstacionesPage.module.css';

function EstacionesPage() {
  const [vista, setVista] = useState('inicio');
  const [anclajeSeleccionado, setAnclajeSeleccionado] = useState(1);

  return (
    <div className={styles.raiz}>
      <header className={styles.encabezado}>
        <div className={styles.marca}>🚲 StationBike</div>
        <nav className={styles.navegacion}>
          <button
            type="button"
            className={`${styles.menuItem} ${vista === 'inicio' ? styles.menuItemActivo : ''}`}
            onClick={() => setVista('inicio')}
          >
            Mapa
          </button>
          <button
            type="button"
            className={`${styles.menuItem} ${vista === 'detalle' ? styles.menuItemActivo : ''}`}
            onClick={() => setVista('detalle')}
          >
            Historial
          </button>
          <button type="button" className={styles.menuItem}>
            Mi Perfil
          </button>
        </nav>
        <div className={styles.usuarioBadge}>
          <span className="insignia insignia--activa">NFC: ACTIVA #TUN-4821</span>
          <span>Camila Rojas</span>
        </div>
      </header>

      <main className={styles.contenido}>
        {vista === 'inicio' ? (
          <section>
            <div className={styles.saludo}>
              <h1 className="titulo-pagina">Hola, Camila</h1>
              <p className={styles.subtitulo}>
                Consulta las estaciones de Tunja y encuentra una bicicleta para tu próximo viaje.
              </p>
            </div>

            <div className={styles.metricasGrid}>
              <article className="tarjeta">
                <p className={styles.metricaEtiqueta}>MI PLAN</p>
                <p className={styles.metricaValor}>Plan mensual</p>
                <p className={styles.metricaDetalle}>45 min incluidos por viaje</p>
              </article>
              <article className="tarjeta">
                <p className={styles.metricaEtiqueta}>TIEMPO DISPONIBLE</p>
                <p className={styles.metricaValor}>45 minutos</p>
                <p className={styles.metricaDetalle}>Disponibles para tu próximo viaje</p>
              </article>
              <article className="tarjeta">
                <p className={styles.metricaEtiqueta}>TARJETA NFC</p>
                <p className={styles.metricaValor}>•••• 4821</p>
                <p className={styles.metricaEstado}>
                  <span className="punto-vivo" style={{ '--color-punto': 'var(--color-primario)' }}></span> ACTIVA - Lista para usar
                </p>
              </article>
            </div>

            <div className={styles.principalGrid}>
              <div className={styles.mapaContenedor}>
                <p className={styles.metricaValor}>🗺️ Mapa Interactivo (Tunja)</p>
                <p className={styles.subtitulo}>Carga de mapa con Leaflet / OpenStreetMap</p>
              </div>

              <div>
                <div className={styles.estacionesLista}>
                  <article className={styles.estacionTarjeta} onClick={() => setVista('detalle')}>
                    <div>
                      <h2 className={styles.estacionNombre}>Estación Centro / Plaza de Bolívar</h2>
                      <p className={styles.estacionDireccion}>📍 Cra. 10 #20-15</p>
                      <p className={styles.estacionEstado}>7 bicicletas · 5 anclajes libres</p>
                    </div>
                    <span>›</span>
                  </article>

                  <article className={styles.estacionTarjeta} onClick={() => setVista('detalle')}>
                    <div>
                      <h2 className={styles.estacionNombre}>Universidad de Boyacá</h2>
                      <p className={styles.estacionDireccion}>📍 Carrera 2ª Este #64-169</p>
                      <p className={styles.estacionEstado}>2 bicicletas · 8 anclajes libres</p>
                    </div>
                    <span>›</span>
                  </article>

                  <article className={styles.estacionTarjeta} onClick={() => setVista('detalle')}>
                    <div>
                      <h2 className={styles.estacionNombre}>Centro comercial Viva</h2>
                      <p className={styles.estacionDireccion}>📍 Avenida Universitaria</p>
                      <p className={styles.estacionEstado}>6 bicicletas · 4 anclajes libres</p>
                    </div>
                    <span>›</span>
                  </article>
                </div>

                <button
                  type="button"
                  className="boton boton--primario boton--bloque"
                  onClick={() => setVista('detalle')}
                >
                  🔒 DESBLOQUEAR BICICLETA
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section>
            <div className={styles.saludo}>
              <p className={styles.estacionDireccion}>
                Usuario / Inicio y estaciones / Detalle de estación
              </p>
              <h1 className="titulo-pagina">Estación Centro</h1>
              <p className={styles.subtitulo}>📍 Cra. 10 #20-15 · Barrio Centro, Tunja</p>
            </div>

            <div className={styles.metricasGrid}>
              <article className="tarjeta">
                <p className={styles.metricaValor}>12</p>
                <p className={styles.subtitulo}>Anclajes totales</p>
              </article>
              <article className="tarjeta">
                <p className={styles.metricaValor}>7</p>
                <p className={styles.subtitulo}>Bicicletas disponibles</p>
              </article>
              <article className="tarjeta">
                <p className={styles.metricaValor}>5</p>
                <p className={styles.subtitulo}>Anclajes libres</p>
              </article>
            </div>

            <div className={styles.principalGrid}>
              <div className={styles.mapaContenedor}>
                <p className={styles.metricaValor}>Mapa Estación Seleccionada</p>
              </div>

              <article className="tarjeta">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 className={styles.estacionNombre}>Anclajes de la estación</h2>
                  <span className="insignia insignia--activa">
                    Anclaje Activo: {anclajeSeleccionado < 10 ? `0${anclajeSeleccionado}` : anclajeSeleccionado}
                  </span>
                </div>
                <p className={styles.estacionDireccion}>Selecciona una bicicleta disponible para iniciar tu viaje.</p>

                <div className={styles.anclajesGrid}>
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <div
                      key={num}
                      className={`${styles.anclajeItem} ${styles.anclajeOcupado} ${
                        anclajeSeleccionado === num ? styles.anclajeSeleccionado : ''
                      }`}
                      onClick={() => setAnclajeSeleccionado(num)}
                    >
                      {num < 10 ? `0${num}` : num}<br />Bici
                    </div>
                  ))}
                  {[8, 9, 10, 11, 12].map((num) => (
                    <div
                      key={num}
                      className={`${styles.anclajeItem} ${styles.anclajeLibre} ${
                        anclajeSeleccionado === num ? styles.anclajeSeleccionado : ''
                      }`}
                      onClick={() => setAnclajeSeleccionado(num)}
                    >
                      {num < 10 ? `0${num}` : num}<br />Libre
                    </div>
                  ))}
                </div>

                <div className={styles.estadoBanner}>
                  <span>
                    ✅ Bicicleta <strong>#SB-0104</strong> lista para desanclaje en el Anclaje {anclajeSeleccionado < 10 ? `0${anclajeSeleccionado}` : anclajeSeleccionado}.
                  </span>
                  <span className="insignia insignia--activa">Batería: 98%</span>
                </div>
              </article>
            </div>

            <div className={styles.accionesGrupo}>
              <button type="button" className="boton boton--primario boton--bloque">
                🔒 DESBLOQUEAR BICICLETA
              </button>
              <button
                type="button"
                className="boton boton--secundario boton--bloque"
                onClick={() => setVista('inicio')}
              >
                ← VOLVER AL MAPA
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className={styles.piePagina}>
        <span>StationBike</span>
        <span>Tunja</span>
      </footer>
    </div>
  );
}

export default EstacionesPage;