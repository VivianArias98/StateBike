import { useState } from 'react';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import MapaTunja from '../../../components/MapaTunja/MapaTunja.jsx';
import { IconoBicicleta, IconoCandado, IconoUbicacion } from '../../../components/Iconos/Iconos.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import MetricaUsuario from '../components/MetricaUsuario.jsx';
import ListaDatos from '../components/ListaDatos.jsx';
import { ESTACIONES } from '../datos.js';
import RejillaAnclajes from './components/RejillaAnclajes.jsx';
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

const DATOS_ESTACION = [
  { etiqueta: 'Horario de dock', valor: '05:00 - 22:00' },
  { etiqueta: 'Tecnología', valor: 'NFC 13.56 MHz' },
  { etiqueta: 'Mantenimiento', valor: 'Al día (Hoy)' },
  { etiqueta: 'Asistencia rápida', valor: '#TUN-SOS' },
];

// Detalle de una estación: anclajes, bicicletas disponibles y mapa de ubicación
function DetalleEstacionPage() {
  const [numeroSeleccionado, setNumeroSeleccionado] = useState(1);

  const anclajeActual = ANCLAJES.find((anclaje) => anclaje.numero === numeroSeleccionado);
  const libres = ESTACION.totalAnclajes - ESTACION.bicicletasDisponibles;
  const cupo = Math.round((ESTACION.bicicletasDisponibles / ESTACION.totalAnclajes) * 100);

  // Pendiente: desbloquear la bicicleta del anclaje elegido (React Router)
  const desbloquear = () => {};

  return (
    <UsuarioLayout itemActivo="Viajes">
      <div className={styles.raiz}>
        <EncabezadoPagina
          etiqueta="Inicio y estaciones / Detalle de estación"
          titulo={ESTACION.nombre}
          subtitulo={
            <span className={styles.direccion}>
              <IconoUbicacion /> {ESTACION.direccion}
            </span>
          }
          acciones={<span className="insignia insignia--activa">Activa</span>}
        />

        <div className={styles.metricas}>
          <MetricaUsuario
            etiqueta="Anclajes totales"
            valor={ESTACION.totalAnclajes}
            detalle="bahías instaladas"
            icono={<IconoCandado />}
          />
          <MetricaUsuario
            etiqueta="Bicicletas disponibles"
            valor={ESTACION.bicicletasDisponibles}
            detalle={`${cupo}% cupo`}
            icono={<IconoBicicleta />}
          />
          <MetricaUsuario
            etiqueta="Anclajes libres"
            valor={libres}
            detalle="listas para retorno"
            icono={<IconoCandado />}
          />
        </div>

        <div className={styles.contenido}>
          <div className={styles.columnaMapa}>
            <div className={styles.mapa}>
              <MapaTunja titulo="Tunja · Red norte-centro" estaciones={ESTACIONES} />
            </div>

            <div className={styles.acciones}>
              <button
                type="button"
                className="boton boton--acento boton--bloque"
                disabled={!anclajeActual?.tieneBicicleta}
                onClick={desbloquear}
              >
                <IconoCandado /> Desbloquear bicicleta
              </button>
              <button type="button" className="boton boton--bloque">
                Volver al mapa
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
              <span className="insignia insignia--activa">
                Anclaje activo: {String(numeroSeleccionado).padStart(2, '0')}
              </span>
            </div>

            <RejillaAnclajes
              anclajes={ANCLAJES}
              seleccionado={numeroSeleccionado}
              onSeleccionar={setNumeroSeleccionado}
            />

            {anclajeActual?.tieneBicicleta && (
              <p className={styles.resumenBicicleta}>
                Bicicleta <strong>#SB-0104</strong> lista para desanclaje en el{' '}
                <strong>Anclaje {String(numeroSeleccionado).padStart(2, '0')}</strong>.
              </p>
            )}

            <ListaDatos datos={DATOS_ESTACION} enTarjetas />
          </section>
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default DetalleEstacionPage;
