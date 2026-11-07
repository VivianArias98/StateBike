import TarjetaCatalogo from './TarjetaCatalogo.jsx';
import { formatearPesos } from '../formato.js';
import styles from './CatalogoPlanes.module.css';

// Rejilla de planes de Mi Plan.
// modo 'sinPlan': el recomendado va en lima y los demás en verde claro.
// modo 'conPlan': el plan vigente queda bloqueado y los demás van en lima.
function CatalogoPlanes({ planes, modo, planActualId = null, onAdquirir }) {
  return (
    <div className={styles.rejilla}>
      {planes.map((plan) => {
        if (modo === 'conPlan') {
          const esActual = plan.id === planActualId;
          return (
            <TarjetaCatalogo
              key={plan.id}
              encabezado={plan.codigo}
              vigencia={plan.vigencia}
              nombre={plan.nombre}
              descripcion={plan.descripcion}
              precio={formatearPesos(plan.precio)}
              unidad={plan.unidad}
              caracteristicas={plan.caracteristicas}
              etiqueta={esActual ? 'Tu plan actual' : null}
              destacada={esActual}
              variante={esActual ? 'actual' : 'primario'}
              accion={esActual ? 'Plan activo - En uso' : 'Adquirir plan'}
              onAccion={() => onAdquirir(plan.id)}
            />
          );
        }

        const recomendado = Boolean(plan.recomendado);
        return (
          <TarjetaCatalogo
            key={plan.id}
            encabezado={plan.encabezado}
            vigencia={plan.vigencia}
            precio={formatearPesos(plan.precio)}
            unidad="COP"
            detallePrecio={plan.detallePrecio}
            caracteristicas={plan.caracteristicas}
            etiqueta={recomendado ? 'Recomendado' : null}
            destacada={recomendado}
            variante={recomendado ? 'primario' : 'suave'}
            accion="Adquirir plan"
            onAccion={() => onAdquirir(plan.id)}
          />
        );
      })}
    </div>
  );
}

export default CatalogoPlanes;
