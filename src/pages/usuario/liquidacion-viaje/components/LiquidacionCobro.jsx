import Etiqueta from '../../../../components/Etiqueta/Etiqueta.jsx';
import styles from './LiquidacionCobro.module.css';

// Tarjeta "Liquidación de cobro": totales del viaje y acciones.
function LiquidacionCobro({ viaje, onVerHistorial, onIrAlMapa, onReportar }) {
  return (
    <section className={`tarjeta ${styles.raiz}`} aria-labelledby="titulo-cobro">
      <header className={styles.cabecera}>
        <h2 id="titulo-cobro" className={styles.titulo}>LIQUIDACIÓN DE COBRO</h2>
        <Etiqueta texto="PAGADO / EXENTO" color="menta" />
      </header>

      <dl className={styles.lista}>
        <div className={styles.fila}>
          <dt className={styles.etiqueta}>Tarifa por minuto de exceso:</dt>
          <dd className={styles.valorMono}>{viaje.tarifaExceso}</dd>
        </div>
        <div className={styles.fila}>
          <dt className={styles.etiqueta}>Minutos de exceso:</dt>
          <dd className={styles.valorMono}>{viaje.excesoMin} min</dd>
        </div>
        <div className={styles.fila}>
          <dt className={styles.etiqueta}>Cobro adicional por tiempo:</dt>
          <dd className={styles.valorMono}>{viaje.cobroTiempo}</dd>
        </div>
      </dl>

      <div className={styles.total}>
        <p className={styles.totalEtiqueta}>TOTAL COBRO</p>
        <p className={styles.totalValor}>{viaje.total}</p>
        <p className={styles.estadoCobro}>ESTADO DEL COBRO: SIN COBROS ADICIONALES</p>
      </div>

      <div className={styles.mensaje}>
        <p>
          Su viaje duró <strong>{viaje.duracionMin} minutos</strong>, dentro del límite de {viaje.incluidoMin} minutos incluido en su <strong>{viaje.plan}</strong>. No se generaron cobros adicionales en su billetera.
        </p>
      </div>

      <p className={styles.saldo}>
        <span>Saldo disponible en Mi Billetera:</span>
        <strong className={styles.saldoValor}>{viaje.saldo}</strong>
      </p>

      <div className={styles.acciones}>
        <button type="button" className={`boton boton--secundario boton--bloque ${styles.accion}`} onClick={onVerHistorial}>
          VER HISTORIAL DE VIAJES
        </button>
        <button type="button" className={`boton boton--bloque ${styles.accion}`} onClick={onIrAlMapa}>
          IR AL MAPA DE ESTACIONES
        </button>
        <button type="button" className={styles.enlace} onClick={onReportar}>
          Reportar incidencia sobre este viaje
        </button>
      </div>
    </section>
  );
}

export default LiquidacionCobro;
