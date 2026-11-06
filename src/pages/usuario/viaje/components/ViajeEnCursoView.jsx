import React from 'react';
import styles from './ViajeEnCursoView.module.css';

function ViajeEnCursoView({ viaje, onDevolver, onReportar }) {
  const estaciones = [
    { id: 1, nombre: 'Centro comercial Viva', cant: 0, top: '42%', left: '55%' },
    { id: 2, nombre: 'Estación Centro / Plaza de Bolívar', cant: 0, top: '68%', left: '46%' },
    { id: 3, nombre: '', cant: 7, top: '45%', left: '32%' },
    { id: 4, nombre: '', cant: 3, top: '30%', left: '42%' },
    { id: 5, nombre: '', cant: 5, top: '52%', left: '58%' }
  ];

  return (
    <div className={styles.raiz}>
      {/* Banner Superior de Estado */}
      <div className={styles.bannerIniciado}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--espacio-2)' }}>
          <span className="punto-vivo" style={{ '--color-punto': 'var(--color-primario)' }}></span>
          <strong>VIAJE INICIADO. ¡BUEN RECORRIDO!</strong>
          <span className="insignia insignia--activa">{viaje.estado}</span>
        </div>
        <p className={styles.textoBanner}>
          Tiene {viaje.minutosIncluidos} minutos incluidos en su plan mensual para este trayecto. Devuélvela en una estación con anclajes libres.
        </p>
        <span className={styles.usuarioTag}>Usuario: {viaje.idUsuario}</span>
      </div>

      {/* Meta Info Bar */}
      <div className={styles.metaInfoBar}>
        <span>🟢 Id_Bicicleta: {viaje.idBicicleta} · Viaje activo</span>
        <span>📍 Estación de origen: {viaje.estacionOrigen}</span>
        <span>💳 NFC ID: {viaje.idUsuario}</span>
      </div>

      {/* Layout Principal */}
      <div className={styles.gridPrincipal}>
        {/* Columna Izquierda: Mapa Estático Monocromático */}
        <div className={styles.columnaMapa}>
          <div className={styles.mapaContenedor}>
            {/* Mapa estático embebido */}
            <iframe
              title="Mapa Estático Tunja"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-73.3800%2C5.5180%2C-73.3450%2C5.5480&layer=mapnik"
              className={styles.mapaIframeMonocromo}
              loading="lazy"
            ></iframe>

            {/* Controles Zoom estáticos (visuales) */}
            <div className={styles.controlesZoom}>
              <button type="button" className={styles.btnZoom}>+</button>
              <button type="button" className={styles.btnZoom}>−</button>
            </div>

            {/* Badge de estado */}
            <div className={styles.badgeMapaOverlay}>
              <span className="punto-vivo"></span> Ruta activa · GPS en tiempo real
            </div>

            {/* Capa de Marcadores de Estaciones */}
            <div className={styles.capaEstaciones}>
              {estaciones.map((est) => (
                <div
                  key={est.id}
                  className={styles.contenedorMarcador}
                  style={{ top: est.top, left: est.left }}
                >
                  <div className={styles.circuloNumero}>{est.cant}</div>
                  {est.nombre && <div className={styles.etiquetaEstacion}>{est.nombre}</div>}
                </div>
              ))}
            </div>

            {/* Referencia pequeña exigida abajo a la derecha */}
            <div className={styles.atribucionOpen}>OpenStreetMap</div>
          </div>

          <div className={styles.leyendaMapaFooter}>
            <span>🟢 El número en cada estación indica bicicletas disponibles</span>
            <span>🟢 Recorrido activo desde Estación Centro</span>
          </div>
        </div>

        {/* Columna Derecha: Cronómetro y Datos */}
        <div className={styles.columnaPanel}>
          <article className="tarjeta" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--espacio-2)' }}>
              <span className={styles.etiquetaCard}>TIEMPO TRANSCURRIDO</span>
              <span className="insignia insignia--activa">● Cronómetro en vivo</span>
            </div>

            <div className={styles.cronometroDisplay}>
              {String(viaje.minutosTranscurridos).padStart(2, '0')} : {String(viaje.segundosTranscurridos).padStart(2, '0')}
            </div>
            <p className={styles.subCronometro}>Plan mensual · 40 minutos incluidos en su plan</p>

            <div className={styles.barraProgresoContenedor}>
              <div className={styles.barraProgresoFill} style={{ width: `${viaje.porcentajeUsado}%` }}></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--texto-xs)', marginTop: 'var(--espacio-2)', color: 'var(--color-placeholder)' }}>
              <span>TIEMPO RESTANTE: <strong>{viaje.tiempoRestante}</strong></span>
              <strong style={{ color: 'var(--color-primario-texto)' }}>{viaje.porcentajeUsado}% del tiempo incluido utilizado</strong>
            </div>
          </article>

          <article className="tarjeta">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--espacio-3)', borderBottom: '1px solid var(--color-borde)', paddingBottom: 'var(--espacio-2)' }}>
              <strong>DATOS DEL VIAJE</strong>
              <span className="insignia insignia--neutra">{viaje.idViaje}</span>
            </div>

            <div className={styles.detalleFila}><span>ID_VIAJE</span><strong>{viaje.idViaje}</strong></div>
            <div className={styles.detalleFila}><span>ID_BICICLETA</span><strong>{viaje.idBicicleta}</strong></div>
            <div className={styles.detalleFila}><span>ESTACIÓN DE ORIGEN</span><span>{viaje.estacionOrigen}</span></div>
            <div className={styles.detalleFila}><span>DIRECCIÓN</span><span>{viaje.direccion}</span></div>
            <div className={styles.detalleFila}><span>HORA DE INICIO</span><span>{viaje.horaInicio}</span></div>
            <div className={styles.detalleFila}><span>ID_USUARIO</span><strong>{viaje.idUsuario}</strong></div>
            <div className={styles.detalleFila} style={{ border: 'none' }}><span>ESTADO</span><span className="insignia insignia--activa">{viaje.estado}</span></div>
          </article>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--espacio-3)' }}>
            <button type="button" className="boton boton--primario boton--bloque" onClick={onDevolver}>
              🚲 DEVOLVER BICICLETA
            </button>
            <button type="button" className="enlace" onClick={onReportar} style={{ textAlign: 'center', color: 'var(--color-error-texto)' }}>
              ⚠️ REPORTAR INCIDENCIA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViajeEnCursoView;