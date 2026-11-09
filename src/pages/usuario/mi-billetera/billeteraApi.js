import { pedirAutenticado } from '../../../services/authService.js';

// Llamadas al backend del módulo Mi billetera (HU_23, HU_24, HU_25).
// Las usan también las pantallas de recarga y de pago de cobro (pasos 1 y 2).

// Límites de la HU_24 (los vuelve a validar el backend)
export const RECARGA_MINIMA = 100;
export const RECARGA_MAXIMA = 500000;
export const SALDO_MAXIMO = 2000000;

// GET /api/billetera
// -> { saldo, tieneCobroPendiente, cobroPendiente: { id, fecha, origen, destino, minutosExceso, monto } | null,
//      movimientos: [{ id, fecha, tipo, concepto, monto, saldoResultante, estado }] }
export function obtenerBilletera() {
  return pedirAutenticado('/billetera');
}

// POST /api/billetera/recargar con { monto } -> { mensaje, saldoAnterior, montoRecargado, nuevoSaldo }
export function recargarSaldo(monto) {
  return pedirAutenticado('/billetera/recargar', { metodo: 'POST', cuerpo: { monto } });
}

// POST /api/billetera/pagar-cobro
// -> { mensaje, cobro: { viajeId, montoPagado, minutosExceso, estadoCobro, saldoRestante } }
export function pagarCobroPendiente() {
  return pedirAutenticado('/billetera/pagar-cobro', { metodo: 'POST' });
}
