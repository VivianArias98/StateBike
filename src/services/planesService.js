import { CATALOGO_PLANES, ESTADO_INICIAL } from '../pages/usuario/plan/planesMock.js';
import { formatearCOP } from '../utils/formatoMoneda.js';

// Servicio de planes. HOY simula el backend (con sus reglas de negocio) usando datos de
// ejemplo. Cuando exista la API, cada función pasa a hacer fetch y el backend responde
// con estos mismos errores. Las páginas no cambian.
// TODO: conectar con los endpoints de planes, tarjetas y billetera.

const ESPERA_MS = 300;
const esperar = () => new Promise((resolver) => setTimeout(resolver, ESPERA_MS));
const DIA_MS = 24 * 60 * 60 * 1000;

let estado = structuredClone(ESTADO_INICIAL);

// Un plan está vigente si está ACTIVO y su fecha de fin no ha llegado
function planVigente(plan) {
  return Boolean(plan) && plan.estado === 'ACTIVO' && new Date(plan.fechaFin) > new Date();
}

// Vencimiento automático: al llegar la fecha de fin el plan pasa a VENCIDO
function aplicarVencimiento() {
  if (estado.plan && estado.plan.estado === 'ACTIVO' && new Date(estado.plan.fechaFin) <= new Date()) {
    estado.plan = { ...estado.plan, estado: 'VENCIDO' };
  }
}

export async function obtenerEstadoPlan() {
  await esperar();
  aplicarVencimiento();
  return structuredClone(estado);
}

export async function obtenerCatalogo() {
  await esperar();
  return structuredClone(CATALOGO_PLANES);
}

// Precondiciones de "Adquirir plan": tarjeta NFC activa y sin plan vigente
export async function verificarPuedeAdquirir() {
  await esperar();
  aplicarVencimiento();
  if (!estado.tarjetaActiva) throw new Error('Debe tener una tarjeta NFC activa para adquirir un plan');
  if (planVigente(estado.plan)) throw new Error('Ya tiene un plan activo');
}

// Precondición de "Cancelar plan": ningún viaje en curso
export async function verificarPuedeCancelar() {
  await esperar();
  if (estado.viajeEnCurso) throw new Error('No puede cancelar con un viaje en curso');
}

// Compra el plan con el saldo de la billetera (único método de pago)
export async function adquirirPlan(idPlan, confirmacion) {
  await esperar();
  await verificarPuedeAdquirir();
  const plan = CATALOGO_PLANES.find((p) => p.id === idPlan);
  if (!plan || !confirmacion) throw new Error('No se pudo procesar la compra');

  if (estado.saldo < plan.costo) {
    const falta = plan.costo - estado.saldo;
    throw new Error(
      `Saldo insuficiente para adquirir el plan. Le faltan ${formatearCOP(falta)}. Recargue su saldo en MI BILLETERA`,
    );
  }

  const ahora = new Date();
  estado.saldo -= plan.costo;
  estado.plan = {
    ...plan,
    estado: 'ACTIVO',
    fechaInicio: ahora.toISOString(),
    fechaFin: new Date(ahora.getTime() + plan.vigenciaDias * DIA_MS).toISOString(),
  };
  return { mensaje: 'PLAN ADQUIRIDO CON ÉXITO', estado: structuredClone(estado) };
}

// Cancelación inmediata: sin reembolso y sin conservar los días restantes
export async function cancelarPlan(confirmacion) {
  await esperar();
  await verificarPuedeCancelar();
  if (!confirmacion) throw new Error('No se pudo procesar la cancelación');
  estado.plan = { ...estado.plan, estado: 'CANCELADO', fechaCancelacion: new Date().toISOString() };
  return { mensaje: 'PLAN CANCELADO CORRECTAMENTE', estado: structuredClone(estado) };
}
