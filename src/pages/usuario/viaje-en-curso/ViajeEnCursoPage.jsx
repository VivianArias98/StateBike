import { useEffect, useState } from 'react';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import Etiqueta from '../../../components/Etiqueta/Etiqueta.jsx';
import MapaTunja from '../../../components/MapaTunja/MapaTunja.jsx';
import ViajeBanner from './components/ViajeBanner.jsx';
import TiempoTranscurrido from './components/TiempoTranscurrido.jsx';
import DatosViaje from './components/DatosViaje.jsx';
import styles from './ViajeEnCursoPage.module.css';

// Datos de ejemplo (solo maquetación). Después llegarán del backend.
const VIAJE = {
  id: 88392,
  bicicleta: 'BIC-003',
  estacionInicio: 'Estación Centro',
  anclaje: '03',
  direccion: 'Cra. 10 #20-15',
  nfc: '4821',
  plan: 'Plan mensual',
  minutosIncluidos: 45,
  segundosIniciales: 754, // 12:34
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
  const [estaciones] = useState(ESTACIONES);
  const [ruta] = useState(RUTA);
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
  const ultimoPunto = ruta[ruta.length - 1];
  const ubicacionActual = ultimoPunto ? { lat: ultimoPunto[0], lng: ultimoPunto[1] } : null;

  const leyendas = [
    {
      id: 'numero',
      contenido: (
        <>
          <span className="punto-vivo" aria-hidden="true" />
          El número es la cantidad de bicicletas disponibles
        </>
      ),
    },
    {
      id: 'recorrido',
      contenido: (
        <>
          → Recorrido desde <strong>{viaje.estacionInicio}</strong> · ubicación actual
        </>
      ),
    },
  ];

  //Pendiente: lógica para devolver la bicicleta
  const devolverBicicleta = () => {};

  return (
    <UsuarioLayout itemActivo="Mapa">
      <div className={styles.raiz}>
        <header>
          <div className={styles.tituloFila}>
            <h1 className={styles.titulo}>Viaje en curso</h1>
            <Etiqueta texto="En trayecto" color="menta" />
          </div>
          <p className={styles.subtitulo}>
            Tu bicicleta está desbloqueada. Devuélvela en una estación con anclajes libres.
          </p>
        </header>

        <ViajeBanner
          codigoBicicleta={viaje.bicicleta}
          estacionInicio={viaje.estacionInicio}
          anclaje={viaje.anclaje}
          nfc={viaje.nfc}
        />

        <div className={styles.contenido}>
          <div className={styles.mapa}>
            <MapaTunja
              titulo={null}
              estaciones={estaciones}
              ruta={ruta}
              ubicacionActual={ubicacionActual}
              leyendas={leyendas}
            />
          </div>

          <div className={styles.lateral}>
            <TiempoTranscurrido
              tiempo={formatearTiempo(segundos)}
              plan={viaje.plan}
              minutosIncluidos={viaje.minutosIncluidos}
              segundosTranscurridos={segundos}
              restante={formatearTiempo(segundosRestantes)}
              porcentajeUsado={porcentajeUsado}
            />

            <DatosViaje
              idViaje={viaje.id}
              filas={[
                { etiqueta: 'Bicicleta', valor: viaje.bicicleta },
                { etiqueta: 'Origen', valor: viaje.estacionInicio },
                { etiqueta: 'Dirección', valor: viaje.direccion },
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
              <p className={styles.ayuda}>
                Acérquese al tótem de una estación libre e inserte la bicicleta para finalizar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default ViajeEnCursoPage;