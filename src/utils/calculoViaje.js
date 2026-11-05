// Cálculo del cobro por exceso de tiempo de un viaje.
// Reglas (según "Cómo usar el servicio"): se cobra cada minuto por encima del tiempo
// incluido en el plan, con un tope máximo por viaje.

export const TARIFA_MINUTO_EXCESO = 100; // COP por minuto (valor de ejemplo, viene del plan)
export const TOPE_COBRO_POR_VIAJE = 5000; // COP máximo por viaje

// Los segundos se redondean hacia arriba: 30 min y 1 s cuenta como 31 min.
export function calcularCobroExceso({
  segundosUsados,
  minutosIncluidos,
  tarifaMinuto = TARIFA_MINUTO_EXCESO,
  tope = TOPE_COBRO_POR_VIAJE,
}) {
  const minutosUsados = Math.ceil(segundosUsados / 60);
  const minutosExceso = Math.max(minutosUsados - minutosIncluidos, 0);
  const cobroSinTope = minutosExceso * tarifaMinuto;
  const cobro = Math.min(cobroSinTope, tope);
  return {
    minutosUsados,
    minutosIncluidos,
    minutosExceso,
    tarifaMinuto,
    tope,
    cobroSinTope,
    cobro,
    topeAplicado: cobroSinTope > tope,
  };
}
