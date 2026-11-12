import MapaTunja from '../../../../components/MapaTunja/MapaTunja.jsx';
import BarraProgreso from '../../../../components/BarraProgreso/BarraProgreso.jsx';
import ListaDatos from '../../components/ListaDatos.jsx';
import { formatearPesos } from '../../formato.js';
import styles from './ViajeEnCurso.module.css';

const dosDigitos = (n) => String(n).padStart(2, '0');

// Viaje en curso: cronómetro, tiempo incluido y mapa con la estación de salida marcada
// segundos: tiempo transcurrido (lo calcula la página con useCronometro)
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
    { etiqueta: 'Estación de salida', valor: viaje.estacionOrigen },
    { etiqueta: 'Hora de inicio', valor: horaInicio },
    { etiqueta: 'Tiempo incluido', valor: `${minutosIncluidos} min` },
    {
      etiqueta: 'Exceso por minuto',
      valor: `${formatearPesos(viaje.valorMinutoExceso)} (tope ${formatearPesos(viaje.topeExceso)})`,
    },
    {
      etiqueta: 'Exceso actual',
      valor: (
        <span className={minutosExceso > 0 ? styles.excedido : undefined}>
          {minutosExceso} min · {formatearPesos(valorExceso)}
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
          <h2 className={styles.bicicleta}>Bicicleta {viaje.bicicleta}</h2>
        </div>

        <div className={`contexto-oscuro ${styles.cronometro}`}>
          <span className={styles.cronometroEtiqueta}>Tiempo transcurrido</span>
          <span className={styles.digitos} role="timer">
            {dosDigitos(Math.floor(segundos / 60))}:{dosDigitos(segundos % 60)}
          </span>
        </div>

        <BarraProgreso
          valor={Math.min(segundos, minutosIncluidos * 60)}
          maximo={minutosIncluidos * 60}
          etiqueta="Progreso del tiempo incluido en el viaje"
        />

        <ListaDatos datos={datos} />

        <p className={styles.instruccion}>
          Para finalizar el viaje, encaje la bicicleta en un anclaje libre y acerque su tarjeta NFC al lector.
        </p>

        <button type="button" className="boton boton--secundario" onClick={onReportar}>
          REPORTAR INCIDENCIA
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