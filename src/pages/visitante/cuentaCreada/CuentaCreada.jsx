import VisitanteLayout from '../../../layouts/VisitanteLayout/VisitanteLayout.jsx';
import PanelPasos from '../components/PanelPasos.jsx';
import { Icono } from '../components/IconosVisitante.jsx';
import styles from './CuentaCreada.module.css';

const PASOS = [
  { titulo: 'Crea tu cuenta', nota: 'Datos personales registrados con éxito', estado: 'hecho' },
  { titulo: 'Un administrador vincula tu tarjeta NFC', nota: 'Paso en espera de verificación física', estado: 'hecho' },
  { titulo: 'Compra un plan y empieza a pedalear', nota: 'Disponible una vez tu tarjeta esté activa', estado: 'pendiente' },
];

function CuentaCreada() {
  return (
    <VisitanteLayout>
      <section className={styles.panel} aria-label="Cuenta creada">
        <div className={styles.contenido}>
          <div className={`contexto-oscuro ${styles.izquierda}`}>
            <div>
              <h1 className={styles.titulo}>
                Muévete por Tunja en bicicleta<span className={styles.punto}>.</span>
              </h1>
              <p className={styles.descripcion}>
                Crea tu cuenta, compra un plan y desbloquea una bicicleta con tu tarjeta NFC.
              </p>
            </div>

            <PanelPasos pasos={PASOS} />

            <p className={styles.pie}>Transporte limpio, rápido y accesible para todos.</p>
          </div>

          <section className={styles.tarjeta} aria-labelledby="titulo-cuenta">
            <header className={styles.encabezado}>
              <span className={styles.marca}>
                Station<span className={styles.marcaVerde}>Bike</span>
              </span>
              <span className={styles.pendiente}>PENDIENTE</span>
            </header>

            <div className={styles.centro}>
              <span className={styles.iconoOk} aria-hidden="true">
                <Icono nombre="check" />
              </span>

              <h2 id="titulo-cuenta" className={styles.tituloTarjeta}>Cuenta creada</h2>
              <p className={styles.texto}>
                Acércate al administrador con tu cédula para activar tu tarjeta.
              </p>
            </div>

            <dl className={styles.estado}>
              <div className={styles.fila}>
                <dt className={styles.etiqueta}>Estado</dt>
                <dd className={styles.chip}>Pendiente</dd>
              </div>
              <div className={styles.fila}>
                <dt className={styles.etiqueta}>Tarjeta</dt>
                <dd className={styles.valor}>Sin activar</dd>
              </div>
            </dl>

            <button type="button" className={styles.puntos}>
              Ver puntos de atención
            </button>

            <p className={styles.ayuda}>
              <a href="#" className="enlace">¿Necesitas ayuda? Revisa los horarios de atención</a>
            </p>
          </section>
        </div>
      </section>
    </VisitanteLayout>
  );
}

export default CuentaCreada;
