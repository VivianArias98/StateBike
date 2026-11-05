// Datos de ejemplo (solo maquetación). Los reemplaza planesService.js cuando exista la API.
// Catálogo igual al de la pantalla pública "Planes y tarifas".

export const CATALOGO_PLANES = [
  { id: 'CAT_01', nombre: 'Plan Diario', costo: 4000, vigenciaDias: 1, viajesPorDia: 2, minutosPorViaje: 30, tarifaMinutoExceso: 100 },
  { id: 'CAT_02', nombre: 'Plan Mensual', costo: 32000, vigenciaDias: 30, viajesPorDia: 4, minutosPorViaje: 40, tarifaMinutoExceso: 100 },
  { id: 'CAT_03', nombre: 'Plan Semestral', costo: 150000, vigenciaDias: 180, viajesPorDia: 4, minutosPorViaje: 45, tarifaMinutoExceso: 100 },
  { id: 'CAT_04', nombre: 'Plan Anual', costo: 240000, vigenciaDias: 365, viajesPorDia: 4, minutosPorViaje: 60, tarifaMinutoExceso: 100 },
];

// Escenario inicial. Para probar los mensajes de error cambia estos valores:
//  - tarjetaActiva: false      -> «Debe tener una tarjeta NFC activa para adquirir un plan»
//  - saldo bajo (p. ej. 35000) -> «Saldo insuficiente...» al elegir Semestral o Anual
//  - viajeEnCurso: true        -> «No puede cancelar con un viaje en curso»
export const ESTADO_INICIAL = {
  tarjetaActiva: true,
  saldo: 35000,
  viajeEnCurso: false,
  plan: null, // { ...plan, estado: 'ACTIVO' | 'CANCELADO' | 'VENCIDO', fechaInicio, fechaFin, fechaCancelacion }
};
