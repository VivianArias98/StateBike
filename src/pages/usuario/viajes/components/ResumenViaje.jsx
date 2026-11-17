import {
  IconoCheck,
  IconoFlecha,
  IconoReloj,
  IconoAlerta,
} from '../../../../components/Iconos/Iconos.jsx';
import { formatearPesos } from '../../formato.js';
import styles from './ResumenViaje.module.css';

// Resumen de HU_4 al devolver la bicicleta en el tótem
function ResumenViaje({ mensaje, aviso, viaje, onCerrar, onHistorial, onPagarCobro }) {
  // RQ-28: No presentar como éxito un viaje con cobro pendiente
  const esCobroPendiente = Boolean(
    aviso ||
    viaje?.estadoCobro === 'PENDIENTE' ||
    (viaje?.valorCobrado > 0 && viaje?.estadoCobro !== 'PAGADO')
  );

  const titulo = esCobroPendiente
    ? 'Viaje finalizado'
    : (mensaje || 'Viaje finalizado con éxito');

  const etiquetaValor = esCobroPendiente
    ? 'Valor pendiente de pago'
    : 'Valor cobrado';

  return (
    <section className={`tarjeta ${styles.raiz}`} aria-labelledby="resumen-viaje-titulo">
      <div className={esCobroPendiente ? styles.cabeceraAlerta : styles.cabeceraExito}>
        <div className={esCobroPendiente ? styles.iconoAlertaCabecera : styles.iconoExito} aria-hidden="true">
          {esCobroPendiente ? <IconoAlerta /> : <IconoCheck />}
        </div>
        <h2 id="resumen-viaje-titulo" className={styles.titulo}>
          {titulo}
        </h2>
      </div>

      {/* Recorrido Origen -> Destino */}
      <div className={styles.rutaCard}>
        <div className={styles.rutaPunto}>
          <span className={styles.puntoSalida} aria-hidden="true" />
          <div className={styles.rutaInfo}>
            <span className={styles.rutaEtiqueta}>Estación de origen</span>
            <strong className={styles.rutaNombre}>{viaje.origen}</strong>
          </div>
        </div>

        <div className={styles.rutaSeparador} aria-hidden="true">
          <IconoFlecha />
        </div>

        <div className={styles.rutaPunto}>
          <span className={styles.puntoLlegada} aria-hidden="true" />
          <div className={styles.rutaInfo}>
            <span className={styles.rutaEtiqueta}>Estación de destino</span>
            <strong className={styles.rutaNombre}>{viaje.destino}</strong>
          </div>
        </div>
      </div>

      {/* Métricas clave del viaje */}
      <div className={styles.metricasGrid}>
        <div className={styles.metricaItem}>
          <span className={styles.metricaEtiqueta}>Duración total</span>
          <span className={styles.metricaValor}>{viaje.duracionMin} min</span>
        </div>

        <div className={styles.metricaItem}>
          <span className={styles.metricaEtiqueta}>Minutos de exceso</span>
          <span className={styles.metricaValor}>
            {viaje.minutosExceso > 0 ? (
              <span className={styles.valorExceso}>+{viaje.minutosExceso} min</span>
            ) : (
              '0 min'
            )}
          </span>
        </div>

        <div className={styles.metricaItem}>
          <span className={styles.metricaEtiqueta}>{etiquetaValor}</span>
          <span className={esCobroPendiente ? styles.metricaValorPendiente : styles.metricaValorDestacado}>
            {formatearPesos(viaje.valorCobrado)}
          </span>
        </div>
      </div>

      {aviso && (
        <div className={styles.avisoCard} role="alert">
          <span className={styles.avisoIcono} aria-hidden="true">
            <IconoAlerta />
          </span>
          <span className={styles.avisoTexto}>{aviso}</span>
        </div>
      )}

      <div className={styles.acciones}>
        {aviso && (
          <button type="button" className="boton boton--primario" onClick={onPagarCobro}>
            PAGAR COBRO PENDIENTE
          </button>
        )}
        <button
          type="button"
          className="boton boton--secundario"
          onClick={onHistorial}
        >
          <IconoReloj /> HISTORIAL
        </button>
        <button type="button" className="enlace" onClick={onCerrar}>
          Cerrar
        </button>
      </div>
    </section>
  );
}

export default ResumenViaje;
