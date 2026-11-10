const SALDO_INICIAL = 20000;
const ESTACIONES_DEVOLUCION = [
  { id: 1, nombre: 'Plaza de Bolívar - Tunja', anclajesLibres: 8 },
  { id: 2, nombre: 'Universidad Santo Tomás', anclajesLibres: 4 },
  { id: 3, nombre: 'Terminal de Transportes', anclajesLibres: 0 },
];
import { calcularCobroExceso } from '../utils/calculoViaje.js';
import { formatearCOP } from '../utils/formatoMoneda.js';

// Servicio de viajes. HOY simula el backend con datos de ejemplo. Cuando exista la API,
// finalizarViaje hace un POST con { idViaje, idEstacionDestino } y el backend calcula
// el exceso, aplica el tope y responde con este mismo resumen.
// TODO: conectar con los endpoints de viajes y billetera.

const ESPERA_MS = 300;
const esperar = () => new Promise((resolver) => setTimeout(resolver, ESPERA_MS));

let saldo = SALDO_INICIAL;

export async function obtenerEstacionesDestino() {
  await esperar();
  return structuredClone(ESTACIONES_DEVOLUCION);
}

export async function obtenerSaldo() {
  await esperar();
  return saldo;
}

// Finaliza el viaje: calcula el exceso y genera el cobro.
//  - Sin exceso: no hay cobro.
//  - Con exceso y saldo suficiente: se descuenta de la billetera (PAGADO).
//  - Con exceso y saldo insuficiente: queda un COBRO PENDIENTE (el saldo no cambia).
export async function finalizarViaje({ viaje, segundos, estacionDestino }) {
  await esperar();
  if (estacionDestino.anclajesLibres === 0) {
    throw new Error('La estación no tiene anclajes libres, busque otra estación');
  }
  const calculo = calcularCobroExceso({
    segundosUsados: segundos,
    minutosIncluidos: viaje.minutosIncluidos,
  });

  let estadoCobro = 'SIN_COBRO';
  if (calculo.cobro > 0) {
    if (saldo >= calculo.cobro) {
      saldo -= calculo.cobro;
      estadoCobro = 'PAGADO';
    } else {
      estadoCobro = 'PENDIENTE';
    }
  }

  // Mensajes de confirmación del requisito «Devolver bicicleta y finalizar viaje»
  let mensaje = 'VIAJE FINALIZADO CON ÉXITO';
  if (calculo.minutosExceso > 0) {
    mensaje += `. Tiempo excedido: ${calculo.minutosExceso} min. Cobro: ${formatearCOP(calculo.cobro)}`;
  }
  const mensajeCobro =
    estadoCobro === 'PENDIENTE'
      ? 'El cobro por exceso quedó pendiente. Recargue su saldo para volver a usar el servicio'
      : '';

  return {
    mensaje,
    mensajeCobro,
    referencia: `TJA-${viaje.id}`,
    origen: viaje.estacionInicio,
    destino: estacionDestino.nombre,
    horaFin: new Date().toISOString(),
    ...calculo,
    estadoCobro,
    saldoNuevo: saldo,
  };
}
