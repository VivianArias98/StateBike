import {
  IconoAyuda,
  IconoBicicleta,
  IconoBilletera,
  IconoCheck,
  IconoFlecha,
  IconoMedalla,
  IconoRecibo,
} from '../../../../components/Iconos/Iconos.jsx';
import { formatearPesos } from '../../formato.js';
import { formatearFechaBogota } from '../../../../utils/formatoMoneda.js';
import { caracteristicasPlan } from '../../mi-plan/planVista.js';
import styles from './PasoActivacion.module.css';

// Paso 4: plan activado (respuesta del backend), resumen de la suscripción y pasos para retirar la bicicleta.
// Solo dibuja lo que recibe.
function PasoActivacion({ mensaje, suscripcion, plan, ultimosDigitos, saldoRestante, onVerMapa }) {
  const pasosRetiro = [
    { titulo: 'Acércate a cualquier estación del sistema.', detalle: 'Busca un anclaje con bicicleta disponible.' },
    {
      titulo: `Acerca tu tarjeta NFC${ultimosDigitos ? ` (•••• ${ultimosDigitos})` : ''} al lector del anclaje.`,
      detalle: 'Sostén la tarjeta cerca del lector.',
    },
    { titulo: 'Retira la bicicleta cuando el anclaje se desbloquee.', detalle: 'El viaje inicia al retirarla.' },
  ];

  return (
    <div className={styles.raiz}>
      <section className={`tarjeta ${styles.exito}`} aria-labelledby="activado-titulo">
        <span className={styles.marca} aria-hidden="true">
          <IconoCheck />
        </span>
        <div className={styles.textoExito}>
          <div className={styles.filaTitulo}>
            <h2 id="activado-titulo" className={styles.titulo}>
              {mensaje}
            </h2>
            <span className={styles.insignia}>{suscripcion.estado}</span>
          </div>
          <p className={styles.texto}>Tu suscripción está activa. Ya puedes retirar bicicletas en cualquier estación.</p>
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
            </div>
          </header>

          <dl className={styles.lista}>
            <div className={styles.fila}>
              <dt>Plan activo</dt>
              <dd className={styles.conIcono}>
                <IconoMedalla /> {suscripcion.nombre}
              </dd>
            </div>
            {ultimosDigitos && (
              <div className={styles.fila}>
                <dt>Tarjeta NFC</dt>
                <dd className={styles.chip}>•••• {ultimosDigitos}</dd>
              </div>
            )}
            <div className={styles.fila}>
              <dt>Vigencia</dt>
              <dd className={styles.vigencia}>
                <span>{suscripcion.vigenciaDias} días</span>
                <span className={styles.fechas}>
                  {formatearFechaBogota(suscripcion.fechaInicio)} – {formatearFechaBogota(suscripcion.fechaFin)}
                </span>
              </dd>
            </div>
          </dl>

          <div className={styles.condiciones}>
            <p className={styles.etiqueta}>Condiciones adquiridas</p>
            <p>{caracteristicasPlan(plan).join(' · ')}</p>
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
            <p className={styles.etiqueta}>Valor pagado</p>
            <p className={styles.totalCifra}>{formatearPesos(plan.costoBase)} COP</p>
          </div>
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
            </div>
          </header>

          <ol className={styles.pasos}>
            {pasosRetiro.map((paso, indice) => (
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
            <p>Puedes consultar el estado de tu plan en cualquier momento desde Mi plan.</p>
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
