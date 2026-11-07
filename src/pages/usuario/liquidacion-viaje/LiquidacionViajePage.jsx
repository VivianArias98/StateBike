import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import BannerExito from './components/BannerExito.jsx';
import RegistroViaje from './components/RegistroViaje.jsx';
import LiquidacionCobro from './components/LiquidacionCobro.jsx';
import styles from './LiquidacionViajePage.module.css';

// Datos de ejemplo (solo maquetación). Después llegarán del backend.
const VIAJE = {
  origen: { estacion: 'Estación Centro (Anclaje 02)', hora: '14:10' },
  destino: { estacion: 'Estación Terminal (Anclaje 05)', hora: '14:38' },
  bicicleta: 'BIC-002',
  estadoBicicleta: 'DISPONIBLE',
  anclajeDestino: 'Anclaje 05',
  estadoAnclaje: 'OCUPADO',
  duracionMin: 28,
  incluidoMin: 40,
  excesoMin: 0,
  tarjeta: '#TUN-8831',
  tarifaExceso: '$100 COP/min',
  cobroTiempo: '$0 COP',
  total: '$0 COP',
  saldo: '$16.000 COP',
  plan: 'Plan Mensual',
};

function LiquidacionViajePage() {
  // Pendiente: navegación a historial, mapa y reporte sobre este viaje
  const irAHistorial = () => {};
  const irAlMapa = () => {};
  const reportarSobreViaje = () => {};

  return (
    <UsuarioLayout itemActivo="Viajes">
      <div className={styles.raiz}>
        <header className={styles.encabezado}>
          <p className={styles.modulo}>Operación Tunja Bici / Liquidación y telemetría</p>
          <h1 className={styles.titulo}>Liquidación y Detalle del Viaje</h1>
        </header>

        <BannerExito />

        <div className={styles.contenido}>
          <RegistroViaje viaje={VIAJE} />

          <LiquidacionCobro
            viaje={VIAJE}
            onVerHistorial={irAHistorial}
            onIrAlMapa={irAlMapa}
            onReportar={reportarSobreViaje}
          />
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default LiquidacionViajePage;
