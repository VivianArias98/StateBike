import { IconoBicicleta, IconoCheck, IconoFlecha, IconoBilletera } from '../../../../components/Iconos/Iconos.jsx';
import ListaDatos from '../../components/ListaDatos.jsx';
import { formatearPesos } from '../../formato.js';
import styles from './PasoActivacion.module.css';

const INSTRUCCIONES = [
  {
    titulo: 'Acércate a cualquier estación del sistema.',
    detalle: 'Módulos de anclaje habilitados en Tunja Eco-Red.',
  },
  {
    titulo: 'Acerca tu tarjeta NFC al lector del anclaje.',
    detalle: 'Sostén la tarjeta a 2 cm del lector frontal.',
  },
  {
    titulo: 'Retira la bicicleta al escuchar el clic y desbloqueo de la luz verde.',
    detalle: 'Hala suavemente hacia atrás el manillar para iniciar el recorrido.',
  },
];

// Paso 4: plan activado, comprobante de la suscripción y pasos para retirar la bicicleta
function PasoActivacion({ plan, nfc, saldo, onVerMapa }) {
  const costo = plan.precio;

  const resumen = [
    { etiqueta: 'Plan activo', valor: plan.nombre },
    { etiqueta: 'Tarjeta NFC vinculada', valor: `#${nfc}` },
    { etiqueta: 'Vigencia', valor: `${plan.dias} días` },
    { etiqueta: 'Condiciones adquiridas', valor: `${plan.viajesDia} viajes al día · hasta ${plan.minutosViaje} min por viaje · exceso $100 COP/min` },
    { etiqueta: 'Método de cobro', valor: 'Saldo Mi Billetera' },
    { etiqueta: 'Saldo restante en billetera', valor: `${formatearPesos(saldo - costo)} COP` },
  ];

  return (
    <div className={styles.contenido}>
      <section className={`tarjeta ${styles.exito}`} aria-labelledby="activado-titulo">
        <span className={styles.iconoExito} aria-hidden="true">
          <IconoCheck />
        </span>
        <div className={styles.textoExito}>
          <h2 id="activado-titulo" className={styles.titulo}>
            ¡Plan Activado con Éxito!
          </h2>
          <p className={styles.texto}>
            Tu suscripción está lista y vinculada a tu tarjeta NFC #{nfc}. Ya puedes retirar bicicletas en cualquier
            estación del sistema.
          </p>
        </div>
        <span className="insignia insignia--activa">Emisión válida</span>
      </section>

      <div className={styles.columnas}>
        <section className={`tarjeta ${styles.bloque}`} aria-labelledby="comprobante-titulo">
          <div className={styles.cabecera}>
            <div>
              <h2 id="comprobante-titulo" className={styles.tituloSeccion}>
                Resumen de suscripción
              </h2>
              <p className={styles.texto}>Comprobante oficial de cobro municipal</p>
            </div>
            <span className={styles.referencia}>#TX-2026-09420</span>
          </div>

          <ListaDatos datos={resumen} />

          <div className={styles.valorPagado}>
            <div>
              <p className={styles.etiqueta}>Valor pagado</p>
              <p className={styles.texto}>Impuestos municipales incluidos</p>
            </div>
            <p className={styles.cifra}>{formatearPesos(costo)} COP</p>
          </div>

          <button type="button" className="boton boton--bloque">
            <IconoBilletera /> Descargar comprobante en PDF
          </button>
        </section>

        <section className={`tarjeta ${styles.bloque}`} aria-labelledby="retirar-titulo">
          <div className={styles.cabecera}>
            <span className={styles.iconoBici} aria-hidden="true">
              <IconoBicicleta />
            </span>
            <div>
              <h2 id="retirar-titulo" className={styles.tituloSeccion}>
                ¿Cómo retirar tu bicicleta?
              </h2>
              <p className={styles.texto}>Instrucciones de desanclaje en 3 pasos</p>
            </div>
          </div>

          <ol className={styles.pasos}>
            {INSTRUCCIONES.map((paso, indice) => (
              <li key={paso.titulo} className={styles.paso}>
                <span className={styles.numero} aria-hidden="true">
                  {indice + 1}
                </span>
                <div>
                  <p className={styles.pasoTitulo}>{paso.titulo}</p>
                  <p className={styles.texto}>{paso.detalle}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className={styles.consejo}>
            <p className={styles.etiqueta}>[ Tip ]</p>
            <p className={styles.texto}>
              Puedes verificar el estado de tus viajes activos directamente en la pestaña <strong>&quot;Viajes&quot;</strong>{' '}
              en tiempo real.
            </p>
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
