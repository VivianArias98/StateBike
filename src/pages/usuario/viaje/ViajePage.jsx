import React, { useState, useEffect, useRef } from 'react';
import styles from './ViajePage.module.css';

const ESTACIONES = [
  { id: 'centro', nombre: 'Estación Centro / Plaza de Bolívar', direccion: 'Cra. 10 #20-15', bicis: 7, libres: 5, lat: 5.5353, lng: -73.3678 },
  { id: 'uniboyaca', nombre: 'Universidad de Boyacá', direccion: 'Carrera 2ª Este #64-169', bicis: 2, libres: 8, lat: 5.5450, lng: -73.3550 },
  { id: 'viva', nombre: 'Centro comercial Viva', direccion: 'Avenida Universitaria', bicis: 6, libres: 4, lat: 5.5520, lng: -73.3500 },
];

const ANCLAJES = [
  { id: 1, estado: 'bici', bici: 'BIC-003', bateria: '98%' },
  { id: 2, estado: 'bici', bici: 'BIC-014', bateria: '85%' },
  { id: 3, estado: 'bici', bici: 'BIC-021', bateria: '92%' },
  { id: 4, estado: 'bici', bici: 'BIC-009', bateria: '74%' },
  { id: 5, estado: 'bici', bici: 'BIC-042', bateria: '90%' },
  { id: 6, estado: 'bici', bici: 'BIC-011', bateria: '88%' },
  { id: 7, estado: 'bici', bici: 'BIC-055', bateria: '95%' },
  { id: 8, estado: 'libre', bici: null },
  { id: 9, estado: 'libre', bici: null },
  { id: 10, estado: 'libre', bici: null },
  { id: 11, estado: 'libre', bici: null },
  { id: 12, estado: 'libre', bici: null },
];

function ComponenteMapaOpenStreet({ alSeleccionarEstacion }) {
  const mapaRef = useRef(null);
  const instMapa = useRef(null);

  useEffect(() => {
    // Carga dinámica de estilos y script de Leaflet por CDN sin dependencias npm
    const cargarLeaflet = () => {
      if (window.L) {
        inicializarMapa();
        return;
      }
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => inicializarMapa();
        document.head.appendChild(script);
      }
    };

    const inicializarMapa = () => {
      if (!mapaRef.current || instMapa.current) return;
      const L = window.L;
      
      const map = L.map(mapaRef.current, { zoomControl: false }).setView([5.5353, -73.3678], 14);
      instMapa.current = map;

      L.control.zoom({ position: 'topleft' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      // Iconos circulares con contador igual a las fotos de Figma
      ESTACIONES.forEach((est) => {
        const customIcon = L.divIcon({
          className: styles.markerOpenStreet,
          html: `<div class="${styles.circlePin} ${est.id === 'centro' ? styles.circlePinActivo : ''}">${String(est.bicis).padStart(2, '0')}</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        const marker = L.marker([est.lat, est.lng], { icon: customIcon }).addTo(map);
        marker.on('click', () => alSeleccionarEstacion && alSeleccionarEstacion(est));
      });
    };

    cargarLeaflet();

    return () => {
      if (instMapa.current) {
        instMapa.current.remove();
        instMapa.current = null;
      }
    };
  }, [alSeleccionarEstacion]);

  return <div ref={mapaRef} className={styles.contenedorLeaflet} />;
}

function ViajePage() {
  const [paso, setPaso] = useState('mapa'); // 'mapa' | 'detalle' | 'desbloquear'
  const [estacionSel, setEstacionSel] = useState(ESTACIONES[0]);
  const [anclajeSel, setAnclajeSel] = useState(ANCLAJES[0]);

  // VISTA 1: PRINCIPAL Y MAPA (Captura IMG_3859)
  if (paso === 'mapa') {
    return (
      <div className={styles.raiz}>
        <div className={styles.migas}>
          USUARIO / INICIO Y ESTACIONES / <strong>PANTALLA PRINCIPAL</strong>
        </div>

        <div className={styles.encabezadoSeccion}>
          <div>
            <h1 className={styles.titulo}>Hola, Camila</h1>
            <p className={styles.subtitulo}>Consulta las estaciones de Tunja y encuentra una bicicleta para tu próximo viaje.</p>
          </div>
          <span className="insignia insignia--activa">● RED OPERATIVA TUNJA</span>
        </div>

        <div className={styles.tarjetasMetricas}>
          <div className="tarjeta">
            <span className={styles.metricaEtiqueta}>MI PLAN</span>
            <h3 className={styles.metricaTitulo}>Plan mensual</h3>
            <p className={styles.metricaDetalle}>45 min incluidos por viaje</p>
          </div>
          <div className="tarjeta">
            <span className={styles.metricaEtiqueta}>TIEMPO DISPONIBLE</span>
            <h3 className={styles.metricaTitulo}>45 minutos</h3>
            <p className={styles.metricaDetalle}>Disponibles para tu próximo viaje</p>
          </div>
          <div className="tarjeta">
            <span className={styles.metricaEtiqueta}>TARJETA NFC</span>
            <h3 className={styles.metricaTitulo}>••••4821</h3>
            <p className={styles.textoActivo}>● ACTIVA · Lista para usar</p>
          </div>
        </div>

        <div className={styles.gridContenido}>
          <div className={`tarjeta ${styles.panelMapa}`}>
            <ComponenteMapaOpenStreet alSeleccionarEstacion={(est) => { setEstacionSel(est); setPaso('detalle'); }} />
            <div className={styles.pieMapa}>
              <span>🟢 El número indica la cantidad de bicicletas disponibles</span>
            </div>
          </div>

          <div className={styles.panelLateral}>
            <div className={`tarjeta ${styles.listaEstaciones}`}>
              <div className={styles.headerLista}>
                <h3>Estaciones cercanas</h3>
                <span className={styles.contadorBadge}>3 ESTACIONES</span>
              </div>
              
              {ESTACIONES.map((est) => (
                <div 
                  key={est.id} 
                  className={styles.itemEstacion} 
                  onClick={() => { setEstacionSel(est); setPaso('detalle'); }}
                >
                  <div>
                    <h4>{est.nombre}</h4>
                    <p className={styles.direccionTxt}>📍 {est.direccion}</p>
                    <p className={styles.dispoTxt}>
                      <strong className={styles.textoVerde}>{est.bicis} bicicletas</strong> · {est.libres} anclajes libres
                    </p>
                  </div>
                  <span className={styles.flecha}>›</span>
                </div>
              ))}
            </div>

            <button 
              type="button" 
              className="boton boton--primario boton--bloque"
              onClick={() => setPaso('detalle')}
            >
              🔓 DESBLOQUEAR BICICLETA
            </button>
            <p className={styles.notaInferior}>
              📶 También puedes acercar tu tarjeta física #TUN-8831 directamente al tótem del anclaje.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // VISTA 2: DETALLE DE ESTACIÓN Y ANCLAJES (Captura IMG_3860)
  if (paso === 'detalle') {
    return (
      <div className={styles.raiz}>
        <div className={styles.migas}>
          USUARIO / INICIO Y ESTACIONES / <strong>DETALLE DE ESTACIÓN</strong>
        </div>

        <div className={styles.encabezadoSeccion}>
          <div>
            <h1 className={styles.titulo}>{estacionSel.nombre}</h1>
            <p className={styles.subtitulo}>📍 {estacionSel.direccion} · Barrio Centro, Tunja</p>
          </div>
          <span className="insignia insignia--activa">● ACTIVA</span>
        </div>

        <div className={styles.tarjetasMetricas}>
          <div className="tarjeta">
            <span className={styles.metricaEtiqueta}>Anclajes totales</span>
            <h3 className={styles.metricaTitulo}>12 <small className={styles.smallTexto}>bahías instaladas</small></h3>
          </div>
          <div className="tarjeta">
            <span className={styles.metricaEtiqueta}>Bicicletas disponibles</span>
            <h3 className={`${styles.metricaTitulo} ${styles.textoVerde}`}>{estacionSel.bicis} <small className={styles.smallTexto}>58% CUPO</small></h3>
          </div>
          <div className="tarjeta">
            <span className={styles.metricaEtiqueta}>Anclajes libres</span>
            <h3 className={styles.metricaTitulo}>{estacionSel.libres} <small className={styles.smallTexto}>listas para retorno</small></h3>
          </div>
        </div>

        <div className={styles.gridContenido}>
          <div className={`tarjeta ${styles.panelMapa}`}>
            <ComponenteMapaOpenStreet alSeleccionarEstacion={() => {}} />
            <div className={styles.pieMapa}>
              <span>● TUNJA · RED NORTE-CENTRO</span>
              <span>⚡ GPS: SYNC OK</span>
            </div>
          </div>

          <div className={`tarjeta ${styles.panelDocks}`}>
            <h2>Anclajes de la estación</h2>
            <p className={styles.subtituloDocks}>Selecciona una bicicleta disponible para iniciar tu viaje.</p>

            <div className={styles.badgeAnclajeActivo}>
              ANCLAJE ACTIVO: {String(anclajeSel.id).padStart(2, '0')}
            </div>

            <div className={styles.grillaDocks}>
              {ANCLAJES.map((dock) => {
                const esSel = anclajeSel.id === dock.id;
                return (
                  <button
                    key={dock.id}
                    type="button"
                    className={`${styles.dockItem} ${dock.estado === 'bici' ? styles.dockBici : styles.dockLibre} ${esSel ? styles.dockSeleccionado : ''}`}
                    onClick={() => dock.estado === 'bici' && setAnclajeSel(dock)}
                  >
                    <span className={styles.dockNum}>{String(dock.id).padStart(2, '0')}</span>
                    <span className={styles.dockTipo}>{dock.estado === 'bici' ? 'BICI' : 'LIBRE'}</span>
                  </button>
                );
              })}
            </div>

            {anclajeSel.estado === 'bici' && (
              <div className={styles.boxDetalleBici}>
                <p>✅ Bicicleta <strong>#{anclajeSel.bici}</strong> lista para desanclaje en el Anclaje {String(anclajeSel.id).padStart(2, '0')}.</p>
                <p className={styles.bateriaInfo}>⚡ BATERÍA: {anclajeSel.bateria}</p>
              </div>
            )}

            <div className={styles.accionesFlex}>
              <button type="button" className="boton boton--primario" onClick={() => setPaso('desbloquear')}>
                🔓 DESBLOQUEAR BICICLETA
              </button>
              <button type="button" className="boton boton--secundario" onClick={() => setPaso('mapa')}>
                🗺️ VOLVER AL MAPA
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VISTA 3: PANTALLA DE DESBLOQUEO NFC (Captura IMG_3858)
  return (
    <div className={styles.raiz}>
      <h1 className={styles.titulo}>Desbloquear bicicleta</h1>
      <p className={styles.subtitulo}>Sigue los pasos para retirar tu bicicleta de Estación Centro.</p>

      <div className={styles.pasosContenedor}>
        <div className={styles.pasoItemActivo}>1. Acerca tu tarjeta NFC</div>
        <div className={styles.pasoItemActivo}>2. Verifica la bicicleta</div>
        <div className={styles.pasoItemPendiente}>3. Confirma el desbloqueo</div>
      </div>

      <div className={styles.gridDesbloqueo}>
        <div className={`tarjeta ${styles.tarjetaNfc}`}>
          <h2>1 Acerca tu tarjeta NFC</h2>
          <div className={styles.iconoNfc}>📶</div>
          <h3>Tarjeta ••••4821</h3>
          <span className="insignia insignia--activa">ACTIVA · Tarjeta reconocida</span>
          <p className={styles.notaPaso}>Acerca tu tarjeta al lector del anclaje 03. Mantén la bicicleta en el rack hasta confirmar el desbloqueo.</p>
        </div>

        <div className={`tarjeta ${styles.tarjetaConfirmacion}`}>
          <h2>2 Verifica la bicicleta</h2>
          <div className={styles.listaValores}>
            <div className={styles.filaValor}><span>Bicicleta</span> <strong>BIC-003</strong></div>
            <div className={styles.filaValor}><span>Estación</span> <strong>Estación Centro</strong></div>
            <div className={styles.filaValor}><span>Dirección</span> <strong>Cra. 10 #20-15</strong></div>
            <div className={styles.filaValor}><span>Anclaje</span> <strong>03</strong></div>
            <div className={styles.filaValor}><span>Plan</span> <strong>Plan mensual • 45 min por viaje</strong></div>
          </div>

          <h3 className={styles.subtituloPaso3}>3 Confirma el desbloqueo</h3>
          <p className={styles.subtituloDocks}>Al confirmar, el anclaje se abrirá y comenzará el tiempo de tu viaje.</p>

          <button type="button" className="boton boton--primario boton--bloque" onClick={() => alert('¡Bicicleta desanclada exitosamente!')}>
            CONFIRMAR DESBLOQUEO
          </button>
          <button type="button" className="enlace" style={{ textAlign: 'center', marginTop: 'var(--espacio-2)' }} onClick={() => setPaso('detalle')}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViajePage;