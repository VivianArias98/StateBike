import MapaTunja from '../../../../components/MapaTunja/MapaTunja.jsx';
import styles from './RecorridoCobro.module.css';

// Columna derecha: tarjeta NFC, estaciones del recorrido y transparencia tarifaria
function RecorridoCobro({ titular, nfc, monto }) {
  return (
    <div className={styles.raiz}>
      <section className={styles.tarjetaNfc}>
        <div className={styles.nfcCabecera}>
          <span className={styles.marca}>StationBike</span>
          <span className={styles.nfcEtiqueta}>NFC PASS</span>
        </div>
        <p className={styles.nfcRotulo}>ESTADO OPERATIVO</p>
        <span className={styles.bloqueado}>Desbloqueo Pausado</span>
        <div className={styles.titularFila}>
          <div>
            <p className={styles.nfcRotulo}>TITULAR</p>
            <p className={styles.titular}>{titular}</p>
          </div>
          <p className={styles.nfcId}>{nfc}</p>
        </div>
        <div className={styles.nfcPie}>
          <span>Cobro pendiente bloquea anclaje</span>
          <span className={styles.nfcMonto}>{monto}</span>
        </div>
      </section>

      <section className={`tarjeta ${styles.estaciones}`}>
        <header className={styles.cabeceraEstaciones}>
          <h2 className={styles.tituloEstaciones}>Estaciones del Recorrido</h2>
          <span className={styles.zona}>Tunja Centro</span>
        </header>

        <ol className={styles.lista}>
          <li className={styles.parada}>
            <span className={`${styles.punto} ${styles.puntoSalida}`} aria-hidden="true" />
            <p className={styles.nombre}>Estación Plaza de Bolívar</p>
            <p className={styles.hora}>Salida: 01 Nov 2026 • 17:45</p>
            <span className={styles.exceso}>Exceso registrado: +25 min</span>
          </li>
          <li className={styles.parada}>
            <span className={`${styles.punto} ${styles.puntoLlegada}`} aria-hidden="true" />
            <p className={styles.nombre}>Estación Terminal de Transportes</p>
            <p className={styles.hora}>Llegada: 01 Nov 2026 • 18:40</p>
          </li>
        </ol>

        <div className={styles.mapa}>
          <MapaTunja titulo={null} />
        </div>
      </section>

      <section className={`tarjeta ${styles.transparencia}`}>
        <h2 className={styles.tituloTransparencia}>Transparencia Tarifaria</h2>
        <p className={styles.decreto}>
          Decreto Municipal No. 042-2024 de Movilidad Sostenible de Tunja.
        </p>
      </section>
    </div>
  );
}

export default RecorridoCobro;
