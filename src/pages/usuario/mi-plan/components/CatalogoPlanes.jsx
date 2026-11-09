import TarjetaCatalogo from './TarjetaCatalogo.jsx';
import { formatearPesos } from '../../formato.js';
import { caracteristicasPlan, textoVigencia } from '../planVista.js';
import styles from './CatalogoPlanes.module.css';

// Rejilla del catálogo de planes de Mi plan (HU_17).
// planes: lista del backend; el que trae tuPlanActual=true se muestra como "Tu plan actual" y sin botón activo.
// puedeAdquirir=false deshabilita la compra (por ejemplo, si ya tiene un plan vigente).
function CatalogoPlanes({ planes, puedeAdquirir, onAdquirir }) {
  return (
    <div className={styles.rejilla}>
      {planes.map((plan) => {
        const esActual = Boolean(plan.tuPlanActual);
        let accion = 'Adquirir plan';
        if (esActual) accion = 'Plan activo - En uso';

        return (
          <TarjetaCatalogo
            key={plan.id}
            encabezado={plan.nombre}
            vigencia={textoVigencia(plan.vigenciaDias)}
            precio={formatearPesos(plan.costoBase)}
            unidad="COP"
            caracteristicas={caracteristicasPlan(plan)}
            etiqueta={esActual ? 'TU PLAN ACTUAL' : null}
            destacada={esActual}
            variante={esActual ? 'actual' : 'primario'}
            deshabilitada={esActual || !puedeAdquirir}
            accion={accion}
            onAccion={() => onAdquirir(plan.id)}
          />
        );
      })}
    </div>
  );
}

export default CatalogoPlanes;
