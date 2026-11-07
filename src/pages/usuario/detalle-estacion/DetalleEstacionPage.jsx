import { useState } from 'react';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import MapaTunja from '../../../components/MapaTunja/MapaTunja.jsx';
import { IconoAnclaje, IconoBicicleta, IconoCandado, IconoMapa, IconoUbicacion } from '../../../components/Iconos/Iconos.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import MetricaUsuario from '../components/MetricaUsuario.jsx';
import { ESTACIONES } from '../datos.js';
import RejillaAnclajes from './components/RejillaAnclajes.jsx';
import BicicletaLista from './components/BicicletaLista.jsx';
import DatosDock from './components/DatosDock.jsx';
import styles from './DetalleEstacionPage.module.css';

// Datos de ejemplo (solo maquetación). Después llegarán del backend.
const ESTACION = {
  nombre: 'Estación Centro',
  direccion: 'Cra. 10 #20-15 · Barrio Centro, Tunja',
  totalAnclajes: 12,
  bicicletasDisponibles: 7,
};

// Los primeros 7 anclajes tienen bicicleta; el resto está libre
const ANCLAJES = Array.from({ length: ESTACION.totalAnclajes }, (_, indice) => ({
  numero: indice + 1,
  tieneBicicleta: indice < ESTACION.bicicletasDisponibles,
}));

const DATOS_DOCK = [
  { etiqueta: 'Horario de dock', valor: '05:00 - 22:00' },
  { etiqueta: 'Tecnología', valor: 'NFC 13.56 MHz' },
  { etiqueta: 'Mantenimiento', valor: 'Al día (Hoy)', destacado: true },
  { etiqueta: 'Asistencia rápida', valor: '#TUN-SOS', destacado: true },
];

// Detalle de una estación: anclajes, bicicletas disponibles y mapa de ubicación
function DetalleEstacionPage() {
  const [numeroSeleccionado, setNumeroSeleccionado] = useState(1);

  const anclajeActual = ANCLAJES.find((anclaje) => anclaje.numero === numeroSeleccionado);
  const libres = ESTACION.totalAnclajes - ESTACION.bicicletasDisponibles;
  const cupo = Math.round((ESTACION.bicicletasDisponibles / ESTACION.totalAnclajes) * 100);
  const numeroTexto = String(numeroSeleccionado).padStart(2, '0');

  // Pendiente: desbloquear la bicicleta del anclaje elegido (React Router)
  const desbloquear = () => {};
  // Pendiente: volver al mapa de estaciones (React Router)
  const volverAlMapa = () => {};

  return (
    <UsuarioLayout itemActivo="Viajes">
      <div className={styles.raiz}>
        <EncabezadoPagina
          etiqueta="Usuario / Inicio y estaciones / Detalle de estación"
          titulo={ESTACION.nombre}
          subtitulo={
            <span className={styles.direccion}>
              <IconoUbicacion /> {ESTACION.direccion}
            </span>
          }
          acciones={<span className={styles.estadoActiva}>● Activa</span>}
        />

        <div className={styles.metricas}>
          <MetricaUsuario
            etiqueta="Anclajes totales"
            valor={ESTACION.totalAnclajes}
            detalle="bahías instaladas"
            icono={<span className={styles.fondoIcono}><IconoAnclaje /></span>}
          />
          <MetricaUsuario
            etiqueta="Bicicletas disponibles"
            valor={ESTACION.bicicletasDisponibles}
            detalle={`${cupo}% cupo`}
            icono={<span className={styles.fondoIcono}><IconoBicicleta /></span>}
          />
          <MetricaUsuario
            etiqueta="Anclajes libres"
            valor={libres}
            detalle="listas para retorno"
            icono={<span className={styles.fondoIcono}><IconoCandado /></span>}
          />
        </div>

        <div className={styles.contenido}>
          <div className={styles.columnaMapa}>
            <section className={`tarjeta ${styles.tarjetaMapa}`} aria-label="Mapa de la estación">
              <header className={styles.cabeceraMapa}>
                <span>Tunja · Red norte-centro</span>
              </header>
              <div className={styles.mapa}>
                <MapaTunja titulo={null} estaciones={ESTACIONES} />
              </div>
              <footer className={styles.piePlano}>
                <span>El número indica las bicicletas disponibles</span>
              </footer>
            </section>

            <div className={styles.acciones}>
              <button
                type="button"
                className={`boton boton--acento boton--bloque ${styles.accion}`}
                disabled={!anclajeActual?.tieneBicicleta}
                onClick={desbloquear}
              >
                <IconoCandado /> DESBLOQUEAR BICICLETA
              </button>
              <button type="button" className={`boton boton--bloque ${styles.accion} ${styles.volver}`} onClick={volverAlMapa}>
                <IconoMapa /> VOLVER AL MAPA
              </button>
            </div>
          </div>

          <section className={`tarjeta ${styles.panel}`} aria-labelledby="anclajes-titulo">
            <div className={styles.cabeceraPanel}>
              <div className={styles.textoCabecera}>
                <h2 id="anclajes-titulo" className={styles.tituloPanel}>
                  Anclajes de la estación
                </h2>
                <p className={styles.textoPanel}>Selecciona una bicicleta disponible para iniciar tu viaje.</p>
              </div>
              <span className={styles.anclajeActivo}>
                <span className="punto-vivo" aria-hidden="true" />
                Anclaje activo: {numeroTexto}
              </span>
            </div>

            <RejillaAnclajes
              anclajes={ANCLAJES}
              seleccionado={numeroSeleccionado}
              onSeleccionar={setNumeroSeleccionado}
            />

            <div className={styles.leyendaAnclajes}>
              <span className={styles.leyenda}>
                <span className={styles.puntoDisponible} aria-hidden="true" />
                {ESTACION.bicicletasDisponibles} bicicletas disponibles
              </span>
              <span className={styles.leyenda}>
                <span className={styles.puntoLibre} aria-hidden="true" />
                {libres} libres
              </span>
            </div>

            {anclajeActual?.tieneBicicleta && <BicicletaLista numeroAnclaje={numeroTexto} />}

            <DatosDock datos={DATOS_DOCK} />
          </section>
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default DetalleEstacionPage;
