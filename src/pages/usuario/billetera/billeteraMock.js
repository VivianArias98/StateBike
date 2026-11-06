// Datos de ejemplo (solo maquetación). Cuando exista el backend, el servicio
// billeteraService.js los reemplaza por la respuesta de la API.

// Cantidad de movimientos que carga cada vez («Ver más»)
export const MOVIMIENTOS_POR_PAGINA = 4;

// Para probar el error «La cuenta se encuentra inactiva. Contacte al administrador» pon false
export const CUENTA_ACTIVA = true;

export const LIMITES_RECARGA = {
  minimo: 100,
  maximo: 500000,
  saldoMaximo: 2000000,
  sugeridos: [
    { valor: 10000, nota: 'Recarga básica' },
    { valor: 20000, nota: 'Frecuente' },
    { valor: 32000, nota: 'Plan mensual' },
    { valor: 50000, nota: 'Larga duración' },
  ],
};

export const BILLETERA_INICIAL = {
  saldo: 15000,
  tarjeta: { codigo: 'TUN-8831', estado: 'ACTIVA' },
  plan: { nombre: 'Plan Mensual', estado: 'Activo', diasRestantes: 24 },
  ultimaEstacion: { nombre: 'Terminal de Pasajeros', detalle: 'Dock #04 · Anclada' },
  cobroPendiente: {
    id: 'CP-2026-084',
    viaje: 'VIAJE-8831',
    ruta: 'Estación Plaza → Estación Terminal',
    fechaViaje: '2026-11-01T17:45:00',
    minutosUsados: 55,
    minutosLimite: 30,
    tarifaMinuto: 100,
  },
  // Del más reciente al más antiguo. El saldo resultante del primero es el saldo actual.
  movimientos: [
    { id: 6, tipo: 'COBRO', concepto: 'Adquisición de Plan Mensual', detalle: 'Suscripción Plan Mensual', fecha: '2026-10-20T09:30:00', monto: -32000, saldoResultante: 15000 },
    { id: 5, tipo: 'RECARGA', concepto: 'Recarga de saldo', detalle: 'Ref. TRX-994021 · Aprobado', fecha: '2026-10-20T09:10:00', monto: 30000, saldoResultante: 47000 },
    { id: 4, tipo: 'COBRO', concepto: 'Exceso de tiempo', detalle: 'Viaje #VIA-0871', fecha: '2026-10-12T18:45:00', monto: -1500, saldoResultante: 17000 },
    { id: 3, tipo: 'RECARGA', concepto: 'Recarga de saldo', detalle: 'Ref. TRX-993107 · Aprobado', fecha: '2026-10-05T08:00:00', monto: 10000, saldoResultante: 18500 },
    { id: 2, tipo: 'COBRO', concepto: 'Exceso de tiempo', detalle: 'Viaje #VIA-0790', fecha: '2026-10-03T17:20:00', monto: -1500, saldoResultante: 8500 },
    { id: 1, tipo: 'RECARGA', concepto: 'Recarga de saldo', detalle: 'Ref. TRX-992456 · Aprobado', fecha: '2026-10-01T09:10:00', monto: 10000, saldoResultante: 10000 },
  ],
};
