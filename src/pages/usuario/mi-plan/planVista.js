import { formatearPesos } from '../formato.js';

// Convierte un plan del backend en los textos que muestran las tarjetas de Mi plan y Adquirir plan.
// Los textos salen de los 6 parámetros oficiales del plan (HU_10, HU_15); no se agregan datos.

export const SIN_PLANES = 'No hay planes disponibles por el momento';

export function textoVigencia(dias) {
  return dias === 1 ? '1 día' : `${dias} días`;
}

export function caracteristicasPlan(plan) {
  return [
    `Vigencia: ${textoVigencia(plan.vigenciaDias)}`,
    `${plan.viajesPorDia} ${plan.viajesPorDia === 1 ? 'viaje' : 'viajes'} por día`,
    `Hasta ${plan.tiempoViajeMin} min por viaje`,
    `Exceso: ${formatearPesos(plan.valorMinutoExceso)} COP/min`,
  ];
}
