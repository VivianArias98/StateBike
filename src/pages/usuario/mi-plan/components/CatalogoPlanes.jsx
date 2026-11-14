import TarjetaCatalogo from './TarjetaCatalogo.jsx';
import { formatearPesos } from '../../formato.js';
import { caracteristicasPlan, textoVigencia } from '../planVista.js';
import styles from './CatalogoPlanes.module.css';

// Rejilla del catálogo de planes de Mi plan (HU_17).
function CatalogoPlanes({ planes = [], puedeAdquirir, onAdquirir }) {
  // Identificar el plan recomendado: preferir "Plan Mensual" o 30 días, o el segundo del catálogo
  const idRecomendado = (() => {
    const mensual = planes.find(
      (p) => p.nombre?.toLowerCase().includes('mensual') || p.vigenciaDias === 30
    );
    if (mensual) return mensual.id;
    return planes.length > 1 ? planes[1].id : planes[0]?.id;
  })();

  return (
    <div className={styles.rejilla}>
      {planes.map((plan) => {
        const esActual = Boolean(plan.tuPlanActual);
        const esRecomendado = !esActual && plan.id === idRecomendado;

        let etiqueta = null;
        if (esActual) {
          etiqueta = 'TU PLAN ACTUAL';
        } else if (esRecomendado) {
          etiqueta = 'RECOMENDADO';
        }

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
            etiqueta={etiqueta}
            destacada={esActual || esRecomendado}
            esRecomendado={esRecomendado}
            variante={esActual ? 'actual' : esRecomendado ? 'primario' : 'suave'}
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
