import { useEffect, useState } from 'react';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import MapaTunja from '../../../components/MapaTunja/MapaTunja.jsx';
import { IconoAlerta } from '../../../components/Iconos/Iconos.jsx';
import ViajeBanner from './components/ViajeBanner.jsx';
import FranjaViaje from './components/FranjaViaje.jsx';
import TiempoTranscurrido from './components/TiempoTranscurrido.jsx';
import DatosViaje from './components/DatosViaje.jsx';
import styles from './ViajeEnCursoPage.module.css';

// Datos de ejemplo (solo maquetación). Después llegarán del backend.
const VIAJE = {
  id: '#VJ-2026-88392',
  bicicleta: 'BIC-003',
  estacionInicio: 'Estación Centro',
  anclaje: '03',
  direccion: 'Cra. 10 #20-15',
  horaInicio: '14:32:00',
  usuario: '#TUN-8831',
  plan: 'Plan mensual',
  minutosIncluidos: 40,
  segundosIniciales: 1785, // 29:45 ya transcurridos
};

// Coordenadas aproximadas (ilustrativas)
const ESTACIONES = [
  { id: 1, nombre: 'Centro / Plaza de Bolívar', lat: 5.5353, lng: -73.3678, bicicletas: 4 },
  { id: 2, nombre: 'UPTC Central', lat: 5.5528, lng: -73.3562, bicicletas: 11 },
  { id: 3, nombre: 'Viva Tunja', lat: 5.5455, lng: -73.3505, bicicletas: 6 },
  { id: 4, nombre: 'Terminal', lat: 5.5412, lng: -73.3590, bicicletas: 3 },
];

// Recorrido: lista de coordenadas [latitud, longitud]. El backend enviará esta lista.
const RUTA = [
  [5.5353, -73.3678],
  [5.5380, -73.3650],
  [5.5410, -73.3615],
  [5.5440, -73.3585],
  [5.5470, -73.3560],
];

// Convierte segundos totales a "mm:ss"
function formatearTiempo(totalSegundos) {
  const minutos = Math.floor(totalSegundos / 60);
  const segundos = totalSegundos % 60;
  return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
}

function ViajeEnCursoPage() {
  const [viaje] = useState(VIAJE);
  const [segundos, setSegundos] = useState(VIAJE.segundosIniciales);

  // Cronómetro en vivo: suma un segundo cada segundo
  useEffect(() => {
    const intervalo = setInterval(() => setSegundos((actual) => actual + 1), 1000);
    return () => clearInterval(intervalo);
  }, []);

  // Valores derivados del tiempo transcurrido
  const segundosIncluidos = viaje.minutosIncluidos * 60;
  const segundosRestantes = Math.max(0, segundosIncluidos - segundos);
  const porcentajeUsado = Math.min(100, Math.round((segundos / segundosIncluidos) * 100));

  // La ubicación actual es el último punto del recorrido
  const ultimoPunto = RUTA[RUTA.length - 1];
  const ubicacionActual = { lat: ultimoPunto[0], lng: ultimoPunto[1] };

  const leyendas = [
    {
      id: 'numero',
      contenido: (
        <>
          <span className="punto-vivo" aria-hidden="true" />
          El número en cada estación indica bicicletas disponibles
        </>
      ),
    },
    {
      id: 'recorrido',
      contenido: (
        <>
          — Recorrido activo desde <strong>{viaje.estacionInicio}</strong>
        </>
      ),
    },
  ];

  // Pendiente: lógica para devolver la bicicleta y reportar desde este viaje
  const devolverBicicleta = () => {};
  const reportarIncidencia = () => {};

  return (
    <UsuarioLayout itemActivo="Viajes">
      <div className={styles.raiz}>
        <ViajeBanner usuario={viaje.usuario} />

        <FranjaViaje
          idBicicleta={viaje.bicicleta}
          estacionOrigen={`${viaje.estacionInicio} (Anclaje ${viaje.anclaje})`}
          nfc={viaje.usuario}
        />

        <div className={styles.contenido}>
          <div className={styles.mapa}>
            <MapaTunja
              titulo={null}
              estaciones={ESTACIONES}
              ruta={RUTA}
              ubicacionActual={ubicacionActual}
              leyendas={leyendas}
            />
          </div>

          <div className={styles.lateral}>
            <TiempoTranscurrido
              tiempo={formatearTiempo(segundos)}
              plan={viaje.plan}
              minutosIncluidos={viaje.minutosIncluidos}
              restante={formatearTiempo(segundosRestantes)}
              porcentajeUsado={porcentajeUsado}
            />

            <DatosViaje
              idViaje={viaje.id}
              filas={[
                { etiqueta: 'ID_VIAJE', valor: viaje.id },
                { etiqueta: 'ID_BICICLETA', valor: viaje.bicicleta, tipo: 'chip' },
                { etiqueta: 'ESTACIÓN DE ORIGEN', valor: `${viaje.estacionInicio} (Anclaje ${viaje.anclaje})` },
                { etiqueta: 'DIRECCIÓN', valor: viaje.direccion },
                { etiqueta: 'HORA DE INICIO', valor: viaje.horaInicio },
                { etiqueta: 'ID_USUARIO', valor: viaje.usuario },
                { etiqueta: 'ESTADO', valor: 'EN CURSO', tipo: 'oscuro' },
              ]}
            />

            <div className={styles.devolver}>
              <button
                type="button"
                className={`boton boton--acento boton--bloque ${styles.accion}`}
                onClick={devolverBicicleta}
              >
                DEVOLVER BICICLETA
              </button>
              <button
                type="button"
                className={`boton boton--bloque ${styles.accion} ${styles.reportar}`}
                onClick={reportarIncidencia}
              >
                <span className={styles.iconoReportar} aria-hidden="true">
                  <IconoAlerta />
                </span>
                REPORTAR INCIDENCIA
              </button>
              <p className={styles.ayuda}>
                Acérquese al tótem de una estación libre e inserte la bicicleta para finalizar el servicio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default ViajeEnCursoPage;
