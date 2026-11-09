import { IconoBilletera, IconoCheck, IconoFlecha } from '../../../../../components/Iconos/Iconos.jsx';
import { formatearPesos } from '../../../formato.js';
import { caracteristicasPlan } from '../../planVista.js';
import styles from './PasoElegirPlan.module.css';

// Tarjeta de un plan del catálogo. El botón se pinta según esté seleccionado o no.
function TarjetaPlanFlujo({ plan, seleccionado, onElegir }) {
  return (
    <article className={`tarjeta ${styles.plan} ${seleccionado ? styles.planSeleccionado : ''}`}>
      <header className={styles.cabeceraPlan}>
        <h3 className={styles.nombrePlan}>{plan.nombre}</h3>
      </header>

      <p className={styles.precio}>
        <span className={styles.cifra}>{formatearPesos(plan.costoBase)}</span>{' '}
        <span className={styles.moneda}>COP</span>
      </p>

      <ul className={styles.caracteristicas}>
        {caracteristicasPlan(plan).map((texto) => (
          <li key={texto}>{texto}</li>
        ))}
      </ul>

      <button
        type="button"
        className={seleccionado ? 'boton boton--acento' : `boton ${styles.botonSuave}`}
        onClick={() => onElegir(plan.id)}
        aria-pressed={seleccionado}
      >
        {seleccionado ? (
          <>
            Seleccionado <IconoCheck />
          </>
        ) : (
          'Seleccionar'
        )}
      </button>
    </article>
  );
}

// Paso 2: elegir el plan (izquierda) y ver el débito del saldo de la billetera (derecha).
// Si el saldo no alcanza, muestra el mensaje de la HU_2 y no deja continuar.
function PasoElegirPlan({ planes, planElegido, saldo, onElegir, onVolver, onContinuar }) {
  const plan = planes.find((item) => item.id === planElegido);
  const saldoProyectado = plan ? saldo - plan.costoBase : saldo;
  const alcanza = Boolean(plan) && saldoProyectado >= 0;

  return (
    <div className={styles.raiz}>
      <div className={styles.columnas}>
        <section className={styles.catalogo} aria-labelledby="selecciona-titulo">
          <div className={styles.cabeceraSeccion}>
            <div className={styles.tituloFila}>
              <h2 id="selecciona-titulo" className={styles.tituloSeccion}>
                1. Selecciona tu plan
              </h2>
              <span className={styles.tarifa}>Tarifas en COP</span>
            </div>
          </div>

          <div className={styles.rejilla}>
            {planes.map((item) => (
              <TarjetaPlanFlujo key={item.id} plan={item} seleccionado={item.id === planElegido} onElegir={onElegir} />
            ))}
          </div>

          <button type="button" className={`boton ${styles.volver}`} onClick={onVolver}>
            &lt; Volver al paso 1
          </button>
        </section>

        <section className={`tarjeta ${styles.pago}`} aria-labelledby="metodo-titulo">
          <header className={styles.cabeceraPago}>
            <h2 id="metodo-titulo" className={styles.tituloSeccion}>
              2. Método de pago
            </h2>
          </header>

          <div className={styles.saldoBox}>
            <div className={styles.saldoTitulo}>
              <span className={styles.iconoSaldo} aria-hidden="true">
                <IconoBilletera />
              </span>
              <p>Saldo en Mi Billetera</p>
            </div>
            <p className={styles.saldoTexto}>Débito directo del saldo disponible en tu cuenta.</p>

            {plan && (
              <dl className={styles.cuentas}>
                <div>
                  <dt>Saldo disponible actual:</dt>
                  <dd>{formatearPesos(saldo)} COP</dd>
                </div>
                <div>
                  <dt>Costo del plan:</dt>
                  <dd className={styles.costo}>- {formatearPesos(plan.costoBase)} COP</dd>
                </div>
                <div className={styles.proyectado}>
                  <dt>Saldo proyectado:</dt>
                  <dd className={alcanza ? styles.exito : styles.costo}>{formatearPesos(saldoProyectado)} COP</dd>
                </div>
              </dl>
            )}

            {alcanza && (
              <span className={styles.fondos}>
                <IconoCheck /> Fondos suficientes
              </span>
            )}
          </div>

          {plan && !alcanza && (
            <p className="mensaje-error" role="alert">
              Saldo insuficiente para adquirir el plan. Le faltan {formatearPesos(-saldoProyectado)}. Recargue su saldo
              en MI BILLETERA
            </p>
          )}

          {plan && (
            <div className={styles.resumenTotal}>
              <p className={styles.etiquetaTotal}>Resumen total</p>
              <div className={styles.filaTotal}>
                <span>Total a debitar:</span>
                <span className={styles.totalCifra}>{formatearPesos(plan.costoBase)} COP</span>
              </div>
              <p className={styles.textoTotal}>El plan se activa de inmediato al confirmar el pago.</p>
            </div>
          )}

          <button
            type="button"
            className={`boton boton--acento boton--bloque ${styles.continuar}`}
            onClick={onContinuar}
            disabled={!alcanza}
          >
            Continuar al resumen <IconoFlecha />
          </button>
        </section>
      </div>
    </div>
  );
}

export default PasoElegirPlan;
