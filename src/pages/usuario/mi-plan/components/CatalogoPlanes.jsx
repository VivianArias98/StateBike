import TarjetaPlan from '../../components/TarjetaPlan.jsx';
import { formatearPesos } from '../../formato.js';
import styles from './CatalogoPlanes.module.css';

// Rejilla de planes. planActualId marca el plan vigente: no se puede volver a adquirir.
function CatalogoPlanes({ planes, planActualId = null, onAdquirir }) {
  return (
    <div className={styles.rejilla}>
      {planes.map((plan) => {
        const esActual = plan.id === planActualId;
        let insignia = null;
        if (esActual) insignia = 'Tu plan actual';
        else if (plan.recomendado) insignia = 'Recomendado';

        return (
          <TarjetaPlan
            key={plan.id}
            codigo={plan.codigo}
            vigencia={plan.vigencia}
            nombre={plan.nombre}
            descripcion={plan.descripcion}
            precio={formatearPesos(plan.precio)}
            unidad={plan.unidad}
            caracteristicas={plan.caracteristicas}
            insignia={insignia}
            destacada={esActual || plan.recomendado}
            accion={esActual ? 'Plan activo - En uso' : 'Adquirir plan'}
            accionDeshabilitada={esActual}
            onAccion={() => onAdquirir(plan.id)}
          />
        );
      })}
    </div>
  );
}

export default CatalogoPlanes;
