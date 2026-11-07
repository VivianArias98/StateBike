import {
  IconoBicicleta,
  IconoBilletera,
  IconoCheck,
  IconoFlecha,
  IconoMedalla,
  IconoRayo,
} from '../../../../components/Iconos/Iconos.jsx';
import { formatearPesos } from '../../formato.js';
import styles from './PasoElegirPlan.module.css';

const ICONOS = {
  rayo: IconoRayo,
  bicicleta: IconoBicicleta,
  medalla: IconoMedalla,
};

// Tarjeta de un plan del catálogo. El botón se pinta según esté seleccionado o no.
function TarjetaPlanFlujo({ plan, seleccionado, recomendado, onElegir }) {
  const Icono = ICONOS[plan.icono];
  return (
    <article className={`tarjeta ${styles.plan} ${seleccionado ? styles.planSeleccionado : ''}`}>
      {recomendado && <span className={styles.recomendado}>Recomendado</span>}

      <header className={styles.cabeceraPlan}>
        <div>
          <p className={styles.etiquetaPlan}>{plan.etiqueta}</p>
          <h3 className={styles.nombrePlan}>{plan.nombre}</h3>
        </div>
        <span className={styles.iconoPlan} aria-hidden="true">
          <Icono />
        </span>
      </header>

      <p className={styles.precio}>
        <span className={styles.cifra}>{formatearPesos(plan.precio)}</span> <span className={styles.moneda}>COP</span>
      </p>
      <p className={styles.descripcion}>{plan.descripcion}</p>

      <ul className={styles.caracteristicas}>
        {plan.caracteristicas.map((texto) => (
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

// Paso 2: elegir el plan (izquierda) y confirmar el pago con el saldo de la billetera (derecha)
function PasoElegirPlan({ planes, planElegido, saldo, onElegir, onVolver, onContinuar }) {
  const plan = planes.find((item) => item.id === planElegido);
  const saldoProyectado = saldo - plan.precio;
  const alcanza = saldoProyectado >= 0;

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
            <p className={styles.textoSeccion}>Desbloqueo ilimitado en todas las estaciones</p>
          </div>

          <div className={styles.rejilla}>
            {planes.map((item) => (
              <TarjetaPlanFlujo
                key={item.id}
                plan={item}
                seleccionado={item.id === planElegido}
                recomendado={item.id === 'mensual'}
                onElegir={onElegir}
              />
            ))}
          </div>

          <div className={styles.bannerMixto}>
            <div className={styles.textoBannerBloque}>
              <p className={styles.tituloBanner}>¿Necesitas cambiar entre bicicletas mecánicas y eléctricas?</p>
              <p className={styles.textoBanner}>
                Todos los planes cubren la flota mixta en las 14 estaciones activas de Tunja sin recargos.
              </p>
            </div>
            <span className={styles.cubierto}>100% cubierto</span>
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
            <span className={styles.pasoPago}>Paso 2/2</span>
          </header>

          <div className={styles.saldoBox}>
            <div className={styles.saldoTitulo}>
              <span className={styles.iconoSaldo} aria-hidden="true">
                <IconoBilletera />
              </span>
              <p>Saldo en Mi Billetera</p>
              <span className={styles.radio} aria-hidden="true" />
            </div>
            <p className={styles.saldoTexto}>Débito directo del saldo disponible en tu cuenta StationBike Tunja.</p>

            <dl className={styles.cuentas}>
              <div>
                <dt>Saldo disponible actual:</dt>
                <dd>{formatearPesos(saldo)} COP</dd>
              </div>
              <div>
                <dt>Costo del plan:</dt>
                <dd className={styles.costo}>- {formatearPesos(plan.precio)} COP</dd>
              </div>
              <div className={styles.proyectado}>
                <dt>Saldo proyectado:</dt>
                <dd className={alcanza ? styles.exito : styles.costo}>{formatearPesos(saldoProyectado)} COP</dd>
              </div>
            </dl>

            {alcanza && (
              <span className={styles.fondos}>
                <IconoCheck /> Fondos suficientes
              </span>
            )}
          </div>

          <p className={styles.subtituloOtros}>Otros métodos</p>
          <div className={styles.otroMetodo}>
            <span>Tarjeta Crédito / Débito</span>
            <span>(No disponible)</span>
          </div>
          <div className={styles.otroMetodo}>
            <span>PSE - Débito en Línea</span>
            <span>(No disponible)</span>
          </div>

          <div className={styles.resumenTotal}>
            <p className={styles.etiquetaTotal}>Resumen total</p>
            <div className={styles.filaTotal}>
              <span>Total a debitar:</span>
              <span className={styles.totalCifra}>{formatearPesos(plan.precio)} COP</span>
            </div>
            <p className={styles.textoTotal}>Activación inmediata en tu tarjeta NFC al confirmar.</p>
          </div>

          <button
            type="button"
            className={`boton boton--acento boton--bloque ${styles.continuar}`}
            onClick={onContinuar}
            disabled={!alcanza}
          >
            Continuar al resumen ({formatearPesos(plan.precio)} COP) <IconoFlecha />
          </button>
        </section>
      </div>
    </div>
  );
}

export default PasoElegirPlan;
