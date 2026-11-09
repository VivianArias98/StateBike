import { pedirAutenticado } from '../../../services/authService.js';

// Llamadas al backend del módulo Mi plan (HU_2, HU_10, HU_17).
// Las usan Mi plan y los flujos Adquirir plan (pasos 1 a 4) y Cancelar plan (pasos 1 y 2).

// GET /api/planes/mi-plan
// Con plan:  { tienePlan: true, plan: { id, nombre, costoBase, vigenciaDias, viajesPorDia, tiempoViajeMin,
//              valorMinutoExceso, fechaInicio, fechaFin, diasUsados, diasRestantes, porcentajeConsumo,
//              viajesHoy, viajesRestantesHoy, tieneCobroPendiente, tarjeta }, catalogo: [...] }
// Sin plan:  { tienePlan: false, mensaje, planVencido, ultimoPlan, tarjeta, tieneCobroPendiente, catalogo: [...] }
export function obtenerMiPlan() {
  return pedirAutenticado('/planes/mi-plan');
}

// GET /api/billetera -> se usa solo el saldo para mostrar el débito
export function obtenerBilletera() {
  return pedirAutenticado('/billetera');
}

// POST /api/planes/adquirir con { planId } -> { mensaje, suscripcion: { id, planId, nombre, vigenciaDias,
//                                               fechaInicio, fechaFin, estado } }
export function adquirirPlan(planId) {
  return pedirAutenticado('/planes/adquirir', { metodo: 'POST', cuerpo: { planId } });
}

// POST /api/planes/cancelar -> { mensaje, suscripcion: { id, planId, nombre, estado, fechaCancelacion } }
export function cancelarPlan() {
  return pedirAutenticado('/planes/cancelar', { metodo: 'POST' });
}

// Datos que necesitan los pasos de Adquirir plan: mi plan (tarjeta, plan vigente, catálogo) y el saldo
export async function obtenerDatosCompra() {
  const [miPlan, billetera] = await Promise.all([obtenerMiPlan(), obtenerBilletera()]);
  return { miPlan, saldo: billetera.saldo };
}
