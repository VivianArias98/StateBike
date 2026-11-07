import TarjetaSaldo from './components/TarjetaSaldo.jsx';
import TarjetaCobroPendiente from './components/TarjetaCobroPendiente.jsx';
import TablaMovimientos from './components/TablaMovimientos.jsx';
import styles from './MiBilletera.module.css';

// Vista principal: saldo, cobro pendiente, datos de la cuenta y movimientos.
// No guarda estado: todo llega por props desde BilleteraPage.
function MiBilletera({ billetera, hayMasMovimientos, onRecargar, onPagarCobro, onVerMasMovimientos }) {
  const { saldo, cobroPendiente, plan, ultimaEstacion, tarjeta, movimientos } = billetera;

  return (
    <div className={styles.raiz}>
      <header className={styles.encabezado}>
        <h1 className={styles.titulo}>Mi Billetera</h1>
        <p className={styles.subtitulo}>
          Consulta tu saldo disponible, cobros pendientes y registro de movimientos de tu cuenta.
        </p>
      </header>

      <div className={styles.principal}>
        <TarjetaSaldo saldo={saldo} onRecargar={onRecargar} />
        <TarjetaCobroPendiente cobro={cobroPendiente} onPagar={onPagarCobro} />
      </div>

      <div className={styles.datos}>
        <section className={`tarjeta ${styles.dato}`}>
          <span className={styles.datoEtiqueta}>Plan vigente</span>
          <strong>{plan.nombre} {plan.estado}</strong>
          <span className={styles.datoNota}>{plan.diasRestantes} días restantes</span>
        </section>
        <section className={`tarjeta ${styles.dato}`}>
          <span className={styles.datoEtiqueta}>Última estación</span>
          <strong>{ultimaEstacion.nombre}</strong>
          <span className={styles.datoNota}>{ultimaEstacion.detalle}</span>
        </section>
        <section className={`tarjeta ${styles.dato}`}>
          <span className={styles.datoEtiqueta}>Tarjeta NFC</span>
          <strong>#{tarjeta.codigo}</strong>
          <span className={styles.datoNota}>
            {tarjeta.estado === 'ACTIVA' ? '✓ Tarjeta activa' : 'Tarjeta bloqueada'}
          </span>
        </section>
      </div>

      <TablaMovimientos movimientos={movimientos} hayMas={hayMasMovimientos} onVerMas={onVerMasMovimientos} />
    </div>
  );
}

export default MiBilletera;
