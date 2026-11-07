import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import PanelNfc from './components/PanelNfc.jsx';
import PasosDesbloqueo from './components/PasosDesbloqueo.jsx';
import DatosBicicleta from './components/DatosBicicleta.jsx';
import styles from './DesbloquearBicicletaPage.module.css';

// Datos de ejemplo (solo maquetación). Después llegarán del backend.
const ANCLAJE = '03';
const TARJETA_ULTIMOS = '4821';
const BICICLETA = [
  { etiqueta: 'Bicicleta', valor: 'BIC-003' },
  { etiqueta: 'Estación', valor: 'Estación Centro' },
  { etiqueta: 'Dirección', valor: 'Cra. 10 #20-15' },
  { etiqueta: 'Anclaje', valor: ANCLAJE },
  { etiqueta: 'Plan', valor: 'Plan mensual • 45 min por viaje' },
];

const PASOS = [
  { titulo: 'Acerca tu tarjeta NFC' },
  { titulo: 'Verifica la bicicleta' },
  { titulo: 'Confirma el desbloqueo' },
];

// Flujo para retirar una bicicleta de una estación
function DesbloquearBicicletaPage() {
  // Pendiente: confirmar el desbloqueo en el backend y abrir el anclaje
  const confirmarDesbloqueo = () => {};
  // Pendiente: volver a la estación (React Router)
  const cancelar = () => {};

  return (
    <UsuarioLayout itemActivo="Viajes">
      <div className={styles.raiz}>
        <EncabezadoPagina
          titulo="Desbloquear bicicleta"
          subtitulo="Sigue los pasos para retirar tu bicicleta de Estación Centro."
        />

        <PasosDesbloqueo pasos={PASOS} pasoActual={0} />

        <div className={styles.contenido}>
          <PanelNfc ultimos={TARJETA_ULTIMOS} anclaje={ANCLAJE} />

          <div className={styles.derecha}>
            <DatosBicicleta titulo="2 Verifica la bicicleta" datos={BICICLETA} />

            <section className={styles.confirmacion} aria-labelledby="confirma-titulo">
              <h2 id="confirma-titulo" className={styles.titulo}>
                3 Confirma el desbloqueo
              </h2>
              <p className={styles.texto}>Al confirmar, el anclaje se abrirá y comenzará el tiempo de tu viaje.</p>
              <button type="button" className={`boton boton--acento boton--bloque ${styles.confirmar}`} onClick={confirmarDesbloqueo}>
                Confirmar desbloqueo
              </button>
              <button type="button" className={`enlace ${styles.cancelar}`} onClick={cancelar}>
                Cancelar
              </button>
            </section>
          </div>
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default DesbloquearBicicletaPage;
