import MapaTunja from '../../../../components/MapaTunja/MapaTunja.jsx';
import BarraProgreso from '../../../../components/BarraProgreso/BarraProgreso.jsx';
import ListaDatos from '../../components/ListaDatos.jsx';
import {
  IconoBicicleta,
  IconoUbicacion,
  IconoReloj,
  IconoAlerta,
  IconoNfc,
} from '../../../../components/Iconos/Iconos.jsx';
import { formatearPesos } from '../../formato.js';
import styles from './ViajeEnCurso.module.css';

const dosDigitos = (n) => String(n).padStart(2, '0');

// Viaje en curso: cronómetro, tiempo incluido y mapa con la estación de salida marcada
function ViajeEnCurso({ viaje, segundos, estaciones, onReportar }) {
  const minutosIncluidos = viaje.minutosIncluidos;

  // Igual que en la devolución (HU_4): se cuenta el minuto iniciado
  const duracionMin = Math.max(1, Math.ceil(segundos / 60));
  const minutosExceso = Math.max(0, duracionMin - minutosIncluidos);
  const valorExceso = Math.min(minutosExceso * viaje.valorMinutoExceso, viaje.topeExceso);

  const horaInicio = new Date(viaje.fechaInicio).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Bogota',
  });

  const datos = [
    {
      etiqueta: 'Estación de salida',
      valor: (
        <span className={styles.valorConIcono}>
          <IconoUbicacion />
          <span>{viaje.estacionOrigen}</span>
        </span>
      ),
    },
    {
      etiqueta: 'Hora de inicio',
      valor: (
        <span className={styles.valorConIcono}>
          <IconoReloj />
          <span>{horaInicio}</span>
        </span>
      ),
    },
    { etiqueta: 'Tiempo incluido', valor: `${minutosIncluidos} min` },
    {
      etiqueta: 'Tarifa de exceso',
      valor: `${formatearPesos(viaje.valorMinutoExceso)}/min (tope ${formatearPesos(viaje.topeExceso)})`,
    },
    {
      etiqueta: 'Exceso acumulado',
      valor: (
        <span className={minutosExceso > 0 ? styles.excedidoBadge : styles.sinExcesoBadge}>
          {minutosExceso > 0 ? `+${minutosExceso} min · ${formatearPesos(valorExceso)}` : '$0 COP (0 min)'}
        </span>
      ),
    },
  ];

  const hayOrigen = Number.isFinite(viaje.origenLat) && Number.isFinite(viaje.origenLng);
  const leyendas = [
    { id: 'salida', contenido: `Salida: ${viaje.estacionOrigen}` },
    { id: 'numero', contenido: 'El número indica la cantidad de bicicletas disponibles' },
  ];

  return (
    <div className={styles.raiz}>
      <section className={`tarjeta ${styles.panel}`}>
        <div className={styles.cabecera}>
          <span className="insignia insignia--activa">
            <span className="punto-vivo" aria-hidden="true" /> VIAJE EN CURSO
          </span>
          <h2 className={styles.bicicleta}>
            <span className={styles.bicicletaIcono} aria-hidden="true">
              <IconoBicicleta />
            </span>
            <span>Bicicleta #{viaje.bicicleta}</span>
          </h2>
        </div>

        <div className={`contexto-oscuro ${styles.cronometro} ${minutosExceso > 0 ? styles.cronometroExceso : ''}`}>
          <span className={styles.cronometroEtiqueta}>Tiempo transcurrido</span>
          <span className={styles.digitos} role="timer">
            {dosDigitos(Math.floor(segundos / 60))}:{dosDigitos(segundos % 60)}
          </span>
          {minutosExceso > 0 && (
            <span className={styles.alertaExceso}>
              Exceso: +{minutosExceso} min ({formatearPesos(valorExceso)})
            </span>
          )}
        </div>

        <BarraProgreso
          valor={Math.min(segundos, minutosIncluidos * 60)}
          maximo={minutosIncluidos * 60}
          etiqueta="Progreso del tiempo incluido en el viaje"
        />

        <div className={styles.datosWrapper}>
          <ListaDatos datos={datos} />
        </div>

        <div className={styles.instruccionCard}>
          <span className={styles.instruccionIcono} aria-hidden="true">
            <IconoNfc />
          </span>
          <p className={styles.instruccionTexto}>
            Para finalizar el viaje, encaje la bicicleta en un anclaje libre de cualquier estación física y acerque su tarjeta NFC al lector del tótem.
          </p>
        </div>

        <button
          type="button"
          className={`boton boton--secundario ${styles.botonReportar}`}
          onClick={onReportar}
        >
          <IconoAlerta /> REPORTAR INCIDENCIA
        </button>
      </section>

      <div className={styles.mapa}>
        <MapaTunja
          titulo={null}
          estaciones={estaciones}
          punto={hayOrigen ? { lat: viaje.origenLat, lng: viaje.origenLng } : null}
          leyendas={leyendas}
        />
      </div>
    </div>
  );
}

export default ViajeEnCurso;
