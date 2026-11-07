import {
  IconoAyuda,
  IconoBicicleta,
  IconoBilletera,
  IconoCheck,
  IconoDescarga,
  IconoFlecha,
  IconoMedalla,
  IconoRecibo,
} from '../../../../components/Iconos/Iconos.jsx';
import { formatearPesos } from '../../formato.js';
import { SALDO } from '../../datos-adquirir.js';
import styles from './PasoActivacion.module.css';

// Pasos para retirar la bicicleta después de activar el plan
const PASOS_RETIRO = [
  { titulo: 'Acércate a cualquier estación del sistema.', detalle: 'Módulos de anclaje habilitados en Tunja Eco-Red.' },
  {
    titulo: 'Acerca tu tarjeta NFC (#TUN-8831) al lector del anclaje.',
    detalle: 'Sostén la tarjeta a 2 cm del lector frontal.',
  },
  {
    titulo: 'Retira la bicicleta al escuchar el clic y desbloqueo de la luz verde.',
    detalle: 'Hala suavemente hacia atrás el manillar para iniciar el recorrido.',
  },
];

// Paso 4: plan activado, comprobante de la suscripción y pasos para retirar la bicicleta
function PasoActivacion({ plan, nfc, onVerMapa }) {
  const saldoRestante = SALDO - plan.precio;

  return (
    <div className={styles.raiz}>
      <section className={`tarjeta ${styles.exito}`} aria-labelledby="activado-titulo">
        <span className={styles.marca} aria-hidden="true">
          <IconoCheck />
        </span>
        <div className={styles.textoExito}>
          <div className={styles.filaTitulo}>
            <h2 id="activado-titulo" className={styles.titulo}>
              ¡Plan Activado con Éxito!
            </h2>
            <span className={styles.insignia}>Paso 4: Plan activado</span>
          </div>
          <p className={styles.texto}>
            Tu suscripción está lista y vinculada a tu tarjeta NFC <strong>#{nfc}</strong>. Ya puedes retirar bicicletas en
            cualquier estación del sistema.
          </p>
        </div>
        <div className={styles.estadoToken}>
          <span className={styles.etiqueta}>Estado token</span>
          <span className={styles.emision}>
            <span className="punto-vivo" aria-hidden="true" />
            Emisión válida
          </span>
        </div>
      </section>

      <div className={styles.columnas}>
        <section className={`tarjeta ${styles.resumen}`} aria-labelledby="suscripcion-titulo">
          <header className={styles.cabecera}>
            <span className={styles.icono} aria-hidden="true">
              <IconoRecibo />
            </span>
            <div className={styles.cabeceraTexto}>
              <h2 id="suscripcion-titulo" className={styles.tituloSeccion}>
                Resumen de suscripción
              </h2>
              <p className={styles.subtitulo}>Comprobante oficial de cobro municipal</p>
            </div>
            <span className={styles.codigo}>#TX-2026-09420</span>
          </header>

          <dl className={styles.lista}>
            <div className={styles.fila}>
              <dt>Plan activo</dt>
              <dd className={styles.conIcono}>
                <IconoMedalla /> {plan.nombre}
              </dd>
            </div>
            <div className={styles.fila}>
              <dt>Tarjeta NFC vinculada</dt>
              <dd className={styles.chip}>#{nfc}</dd>
            </div>
            <div className={styles.fila}>
              <dt>Vigencia</dt>
              <dd className={styles.vigencia}>
                <span>{plan.vigenciaTexto}</span>
                <span className={styles.fechas}>01 Nov – 01 Dic 2026</span>
              </dd>
            </div>
          </dl>

          <div className={styles.condiciones}>
            <p className={styles.etiqueta}>Condiciones adquiridas</p>
            <p>{plan.condiciones}</p>
          </div>

          <dl className={styles.lista}>
            <div className={styles.fila}>
              <dt>Método de cobro</dt>
              <dd className={styles.conIcono}>
                <IconoBilletera /> Saldo Mi Billetera
              </dd>
            </div>
            <div className={styles.fila}>
              <dt>Saldo restante en billetera</dt>
              <dd className={styles.mono}>{formatearPesos(saldoRestante)} COP</dd>
            </div>
          </dl>

          <div className={styles.valorPagado}>
            <div>
              <p className={styles.etiqueta}>Valor pagado</p>
              <p className={styles.impuestos}>Impuestos municipales incluidos</p>
            </div>
            <p className={styles.totalCifra}>{formatearPesos(plan.precio)} COP</p>
          </div>

          <button type="button" className={`boton boton--bloque ${styles.descargar}`}>
            <IconoDescarga /> Descargar comprobante en PDF
          </button>
        </section>

        <section className={`tarjeta ${styles.retiro}`} aria-labelledby="retiro-titulo">
          <header className={styles.cabecera}>
            <span className={styles.icono} aria-hidden="true">
              <IconoBicicleta />
            </span>
            <div className={styles.cabeceraTexto}>
              <h2 id="retiro-titulo" className={styles.tituloSeccion}>
                ¿Cómo retirar tu bicicleta?
              </h2>
              <p className={styles.subtitulo}>Instrucciones de desanclaje en 3 pasos</p>
            </div>
          </header>

          <ol className={styles.pasos}>
            {PASOS_RETIRO.map((paso, indice) => (
              <li key={paso.titulo} className={styles.paso}>
                <span className={styles.numero} aria-hidden="true">
                  {indice + 1}
                </span>
                <div>
                  <p className={styles.pasoTitulo}>{paso.titulo}</p>
                  <p className={styles.subtitulo}>{paso.detalle}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className={styles.tip}>
            <span className={styles.iconoTip} aria-hidden="true">
              <IconoAyuda />
            </span>
            <div>
              <p className={styles.etiqueta}>[ Tip ]</p>
              <p>
                Puedes verificar el estado de tus viajes activos directamente en la pestaña <u>"Viajes"</u> en tiempo real.
              </p>
            </div>
          </div>

          <button type="button" className="boton boton--acento boton--bloque" onClick={onVerMapa}>
            Ver mapa de estaciones <IconoFlecha />
          </button>
        </section>
      </div>
    </div>
  );
}

export default PasoActivacion;
