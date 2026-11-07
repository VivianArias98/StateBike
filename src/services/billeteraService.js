import { BILLETERA_INICIAL, CUENTA_ACTIVA } from '../pages/usuario/billetera/billeteraMock.js';
import { formatearCOP } from '../utils/formatoMoneda.js';

// Servicio de la billetera. HOY devuelve datos de ejemplo con una pequeña espera
// para simular la red y aplica las reglas del requisito. Cuando el backend esté listo,
// cada función hace fetch al endpoint y el backend responde con estos mismos errores
// (las páginas no se tocan).
// TODO: reemplazar por los endpoints reales de billetera, recargas y cobros.

const ESPERA_MS = 300;
const esperar = () => new Promise((resolver) => setTimeout(resolver, ESPERA_MS));

// GET billetera: saldo, cobro pendiente, movimientos y datos de la cuenta
export async function obtenerBilletera() {
  await esperar();
  return structuredClone(BILLETERA_INICIAL);
}

// POST recarga: acredita el monto de inmediato (no hay pasarela de pagos) y devuelve el comprobante
export async function recargarSaldo(monto, saldoActual) {
  await esperar();
  if (!CUENTA_ACTIVA) throw new Error('La cuenta se encuentra inactiva. Contacte al administrador');
  return {
    mensaje: 'RECARGA EXITOSA',
    referencia: `TRX-${Date.now().toString().slice(-6)}`,
    saldoAnterior: saldoActual,
    monto,
    saldoNuevo: saldoActual + monto,
    fecha: new Date().toISOString(),
  };
}

// POST pago del cobro pendiente: devuelve el comprobante
export async function pagarCobroPendiente(cobro, saldoActual) {
  await esperar();
  if (!cobro) throw new Error('No tiene cobros pendientes');
  if (saldoActual < cobro.total) {
    throw new Error(`Saldo insuficiente. Le faltan ${formatearCOP(cobro.total - saldoActual)}. Recargue su saldo`);
  }
  return {
    mensaje: 'COBRO PENDIENTE PAGADO CORRECTAMENTE',
    referencia: `CP-PAGADO-${Date.now().toString().slice(-4)}`,
    cobro,
    saldoAnterior: saldoActual,
    saldoNuevo: saldoActual - cobro.total,
    metodo: 'Saldo de billetera',
    fecha: new Date().toISOString(),
  };
}
