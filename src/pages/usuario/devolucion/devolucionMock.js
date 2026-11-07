// Datos de ejemplo (solo maquetación). Los reemplaza viajesService.js cuando exista la API.

// Para probar el cobro pendiente baja el saldo (p. ej. 1000) y deja el viaje con exceso.
export const SALDO_INICIAL = 20000;

export const ESTACIONES_DEVOLUCION = [
  { id: 1, nombre: 'Centro / Plaza de Bolívar', anclajesLibres: 8 },
  { id: 2, nombre: 'UPTC Central', anclajesLibres: 3 },
  { id: 3, nombre: 'Viva Tunja', anclajesLibres: 6 },
  { id: 4, nombre: 'Terminal', anclajesLibres: 5 },
  { id: 5, nombre: 'Parque Central', anclajesLibres: 2 },
  { id: 6, nombre: 'Mercado', anclajesLibres: 0 }, // sin anclajes: aparece deshabilitada
];
