import VisitanteLayout from '../../../layouts/VisitanteLayout/VisitanteLayout.jsx';
import PanelPasos from '../components/PanelPasos.jsx';
import { Icono } from '../components/IconosVisitante.jsx';
import styles from './VerificarCorreo.module.css';

const PASOS = [
  { titulo: '1. Crea tu cuenta', estado: 'hecho' },
  { titulo: '2. Verifica tu correo', estado: 'activo' },
  { titulo: '3. Un administrador vincula tu tarjeta NFC', estado: 'pendiente' },
  { titulo: '4. Compra un plan y empieza a pedalear', estado: 'pendiente' },
];

const DIGITOS = 6;

function VerificarCorreo() {
  return (
    <VisitanteLayout>
      <section className={styles.panel} aria-label="Verificación de correo">
        <div className={styles.contenido}>
          <div className={`contexto-oscuro ${styles.izquierda}`}>
            <div>
              <h1 className={styles.titulo}>
                Muévete por Tunja en bicicleta<span className={styles.punto}>.</span>
              </h1>
              <p className={styles.descripcion}>
                Crea tu cuenta, compra un plan y desbloquea una bicicleta con tu tarjeta NFC
              </p>
            </div>

            <PanelPasos pasos={PASOS} />

            <p className={styles.pie}>Transporte limpio, rápido y accesible para todos.</p>
          </div>

          <section className={styles.tarjeta} aria-labelledby="titulo-correo">
            <span className={styles.iconoCorreo} aria-hidden="true">
              <Icono nombre="sobre" />
            </span>

            <h2 id="titulo-correo" className={styles.tituloTarjeta}>Revisa tu correo</h2>
            <p className={styles.texto}>Enviamos un código de 6 dígitos a</p>
            <p className={styles.correo}>camila@correo.co</p>

            <div className={styles.codigo} role="group" aria-label="Código de verificación">
              {Array.from({ length: DIGITOS }, (_, indice) => (
                <input
                  key={indice}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={`input ${styles.celda}`}
                  aria-label={`Dígito ${indice + 1}`}
                />
              ))}
            </div>

            <button type="button" className={`boton boton--primario ${styles.verificar}`}>
              Verificar
            </button>

            <button type="button" className={`boton ${styles.reenviar}`}>
              Reenviar código (0:42)
            </button>

            <a href="#" className={`enlace ${styles.cambiar}`}>
              ¿Correo incorrecto? Cambiar dirección
            </a>
          </section>
        </div>
      </section>
    </VisitanteLayout>
  );
}

export default VerificarCorreo;
