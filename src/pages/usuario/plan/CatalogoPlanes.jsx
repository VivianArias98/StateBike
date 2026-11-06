import { formatearCOP } from '../../../utils/formatoMoneda.js';
import styles from './CatalogoPlanes.module.css';

// El usuario elige un plan del catálogo. El método de pago es el saldo de la billetera.
function CatalogoPlanes({ catalogo, onElegir, onVolver }) {
  return (
    <div className={styles.raiz}>
      <header className={styles.encabezado}>
        <h1 className={styles.titulo}>Adquirir plan</h1>
        <p className={styles.subtitulo}>
          Elige un plan. El método de pago es el saldo de tu billetera.
        </p>
      </header>

      <div className={styles.rejilla}>
        {catalogo.map((plan) => (
          <section key={plan.id} className={`tarjeta ${styles.plan}`}>
            <h2 className={styles.nombre}>{plan.nombre}</h2>
            <p className={styles.precio}>
              {formatearCOP(plan.costo)} <span className={styles.moneda}>COP</span>
            </p>
            <ul className={styles.lista}>
              <li>Vigencia: <strong>{plan.vigenciaDias} {plan.vigenciaDias === 1 ? 'día' : 'días'}</strong></li>
              <li><strong>{plan.viajesPorDia} viajes</strong> al día</li>
              <li><strong>{plan.minutosPorViaje} min</strong> por viaje</li>
            </ul>
            <button type="button" className="boton boton--secundario boton--bloque" onClick={() => onElegir(plan)}>
              Elegir plan
            </button>
          </section>
        ))}
      </div>

      <div>
        <button type="button" className="boton" onClick={onVolver}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default CatalogoPlanes;
