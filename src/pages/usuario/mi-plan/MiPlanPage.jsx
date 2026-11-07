import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import CatalogoPlanes from '../components/CatalogoPlanes.jsx';
import { formatearPesos } from '../formato.js';
import { USUARIO } from '../datos.js';
import { CATALOGO_SIN_PLAN } from './catalogo.js';
import BannerSinPlan from './components/BannerSinPlan.jsx';
import FlujoActivacion from './components/FlujoActivacion.jsx';
import styles from './MiPlanPage.module.css';

const SALDO_BILLETERA = 65000;

// Flujo de activación: los pasos 1 y 2 están en curso o hechos; 3 y 4 pendientes
const PASOS_ACTIVACION = [
  { titulo: 'Verificación NFC', detalle: `(#${USUARIO.nfc})`, estado: 'hecho' },
  { titulo: 'Elegir plan', detalle: 'En proceso', estado: 'activo' },
  { titulo: 'Resumen compra', detalle: 'Débito saldo billetera', estado: 'pendiente' },
  { titulo: 'Activación inmediata', detalle: 'Habilitación en docks', estado: 'pendiente' },
];

// Pantalla 02: Mi Plan sin suscripción vigente
function MiPlanPage() {
  // Pendiente: navegar al flujo Adquirir plan (React Router)
  const adquirirPlan = () => {};

  return (
    <UsuarioLayout itemActivo="Mi plan">
      <div className={styles.raiz}>
        <EncabezadoPagina
          titulo="Mi Plan"
          subtitulo="Gestión de suscripciones, condiciones de uso y acceso a bicicletas del sistema integrado."
          acciones={
            <span className={styles.registro}>
              Registro de ciclo: <strong>sin suscripción vigente</strong>
            </span>
          }
        />

        <BannerSinPlan nfc={USUARIO.nfc} onAdquirir={adquirirPlan} />

        <FlujoActivacion pasos={PASOS_ACTIVACION} />

        <section className={styles.seccion} aria-labelledby="planes-titulo">
          <div className={styles.cabeceraSeccion}>
            <div className={styles.textoSeccion}>
              <h2 id="planes-titulo" className={styles.tituloSeccion}>
                Planes Disponibles
              </h2>
              <p className={styles.descripcionSeccion}>
                Selecciona la modalidad de suscripción que mejor se adapte a tus necesidades. La activación se
                reflejará de inmediato en tu tarjeta NFC vinculada.
              </p>
            </div>
            <div className={styles.pastillas}>
              <span className={styles.pastilla}>COP / 2026</span>
              <span className={styles.pastilla}>Débito billetera</span>
            </div>
          </div>

          <CatalogoPlanes planes={CATALOGO_SIN_PLAN} modo="sinPlan" onAdquirir={adquirirPlan} />
        </section>

        <div className={`tarjeta ${styles.nota}`}>
          <p>
            * El valor de la suscripción se debita automáticamente del saldo de tu billetera al confirmar la compra.
          </p>
          <button type="button" className="enlace">
            Ver saldo en Mi Billetera ({formatearPesos(SALDO_BILLETERA)} COP) →
          </button>
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default MiPlanPage;
