import TarjetaPlan from '../../components/TarjetaPlan.jsx';
import { formatearPesos } from '../../formato.js';
import styles from './PasoElegirPlan.module.css';

// Paso 2: elegir el plan y confirmar el pago con el saldo de la billetera
function PasoElegirPlan({ planes, planElegido, saldo, onElegir, onVolver, onContinuar }) {
  const plan = planes.find((item) => item.id === planElegido);
  const costo = plan.precio;
  const saldoProyectado = saldo - costo;
  const alcanza = saldoProyectado >= 0;

  return (
    <div className={styles.contenido}>
      <section className={styles.planes} aria-labelledby="selecciona-titulo">
        <div className={styles.cabeceraPlanes}>
          <h2 id="selecciona-titulo" className={styles.tituloSeccion}>
            1. Selecciona tu plan
          </h2>
          <span className={styles.etiquetaTarifa}>Tarifas en COP</span>
        </div>
        <p className={styles.textoPlanes}>Desbloqueo ilimitado en todas las estaciones</p>

        <div className={styles.rejilla}>
          {planes.map((item) => (
            <TarjetaPlan
              key={item.id}
              vigencia={item.vigencia}
              nombre={item.nombre}
              descripcion={item.descripcion}
              precio={formatearPesos(item.precio)}
              unidad={item.unidad}
              caracteristicas={item.caracteristicas}
              insignia={item.recomendado ? 'Recomendado' : null}
              destacada={item.id === planElegido}
              accion={item.id === planElegido ? 'Seleccionado' : 'Seleccionar'}
              onAccion={() => onElegir(item.id)}
            />
          ))}
        </div>

        <div className={styles.banda}>
          <div className={styles.textoBanda}>
            <p className={styles.tituloBanda}>¿Necesitas cambiar entre bicicletas mecánicas y eléctricas?</p>
            <p className={styles.descripcionBanda}>
              Todos los planes cubren la flota mixta en las 14 estaciones activas de Tunja sin recargos.
            </p>
          </div>
          <span className={styles.cubierto}>100% cubierto</span>
        </div>

        <button type="button" className={`boton ${styles.volver}`} onClick={onVolver}>
          Volver al paso 1
        </button>
      </section>

      <section className={`tarjeta ${styles.pago}`} aria-labelledby="pago-titulo">
        <div className={styles.cabeceraPlanes}>
          <h2 id="pago-titulo" className={styles.tituloSeccion}>
            2. Método de pago
          </h2>
          <span className={styles.etiquetaTarifa}>Paso 2/2</span>
        </div>

        <div className={styles.metodo}>
          <p className={styles.tituloMetodo}>Saldo en Mi Billetera</p>
          <p className={styles.descripcionMetodo}>Débito directo del saldo disponible en tu cuenta StationBike Tunja.</p>

          <dl className={styles.cuentas}>
            <div className={styles.filaCuenta}>
              <dt>Saldo disponible actual:</dt>
              <dd>{formatearPesos(saldo)} COP</dd>
            </div>
            <div className={styles.filaCuenta}>
              <dt>Costo del plan:</dt>
              <dd className={styles.costo}>- {formatearPesos(costo)} COP</dd>
            </div>
            <div className={styles.filaCuenta}>
              <dt>Saldo proyectado:</dt>
              <dd className={alcanza ? styles.positivo : styles.negativo}>{formatearPesos(saldoProyectado)} COP</dd>
            </div>
          </dl>

          {alcanza ? (
            <span className="insignia insignia--activa">Fondos suficientes</span>
          ) : (
            <p className="mensaje-error" role="alert">
              Saldo insuficiente para este plan.
            </p>
          )}
        </div>

        <div className={styles.otros}>
          <p className={styles.etiqueta}>Otros métodos</p>
          <div className={styles.noDisponible}>
            <span>Tarjeta Crédito / Débito</span>
            <span>(No disponible)</span>
          </div>
          <div className={styles.noDisponible}>
            <span>PSE - Débito en Línea</span>
            <span>(No disponible)</span>
          </div>
        </div>

        <div className={styles.total}>
          <p className={styles.etiqueta}>Resumen total</p>
          <div className={styles.totalFila}>
            <span>Total a debitar:</span>
            <span className={styles.totalCifra}>{formatearPesos(costo)} COP</span>
          </div>
          <p className={styles.descripcionMetodo}>Activación inmediata en tu tarjeta NFC al confirmar.</p>
        </div>

        <button
          type="button"
          className="boton boton--acento boton--bloque"
          disabled={!alcanza}
          onClick={onContinuar}
        >
          Continuar al resumen ({formatearPesos(costo)} COP) →
        </button>
      </section>
    </div>
  );
}

export default PasoElegirPlan;
