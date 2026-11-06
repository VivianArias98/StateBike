// Datos de ejemplo compartidos por las pantallas de usuario (solo maquetación).
// Después llegarán del backend. Los valores siguen los diseños entregados.

export const USUARIO = {
  nombre: 'Camila Rojas',
  subtitulo: 'Usuario verificado',
  nfc: 'TUN-8831',
};

// Catálogo de planes. precio en pesos colombianos (número).
export const PLANES = [
  {
    id: 'diario',
    codigo: 'CAT_01',
    vigencia: '1 día',
    nombre: 'Plan Diario',
    descripcion: 'Ideal para traslados esporádicos o emergencias.',
    precio: 4000,
    unidad: 'COP',
    caracteristicas: ['Vigencia: 24 horas', '2 viajes al día', '30 min por trayecto', 'Exceso: $100 COP/min'],
    dias: 1,
    viajesDia: 2,
    minutosViaje: 30,
  },
  {
    id: 'mensual',
    codigo: 'CAT_02',
    vigencia: '30 días',
    nombre: 'Plan Mensual',
    descripcion: 'El equilibrio óptimo para la rutina universitaria o laboral.',
    precio: 32000,
    unidad: 'COP / mes',
    caracteristicas: ['Vigencia: 30 días continuos', '4 viajes al día', '40 min por trayecto', 'Exceso: $100 COP/min'],
    dias: 30,
    viajesDia: 4,
    minutosViaje: 40,
    recomendado: true,
  },
  {
    id: 'semestral',
    codigo: 'CAT_03',
    vigencia: '180 días',
    nombre: 'Plan Semestral',
    descripcion: 'Ahorro sostenido para periodos académicos y contratos.',
    precio: 150000,
    unidad: 'COP',
    caracteristicas: ['Vigencia: 180 días continuos', '4 viajes al día', '45 min por trayecto', 'Exceso: $100 COP/min'],
    dias: 180,
    viajesDia: 4,
    minutosViaje: 45,
  },
  {
    id: 'anual',
    codigo: 'CAT_04',
    vigencia: '365 días',
    nombre: 'Plan Anual',
    descripcion: 'Máxima autonomía y máxima ventana de trayecto por viaje.',
    precio: 240000,
    unidad: 'COP',
    caracteristicas: ['Vigencia: 365 días continuos', '4 viajes al día', '60 min por trayecto', 'Exceso: $100 COP/min'],
    dias: 365,
    viajesDia: 4,
    minutosViaje: 60,
  },
];

// Estaciones de Tunja (coordenadas aproximadas, solo ilustrativas)
export const ESTACIONES = [
  { id: 1, nombre: 'Estación Centro / Plaza de Bolívar', direccion: 'Cra. 10 #20-15', lat: 5.5353, lng: -73.3678, bicicletas: 7, anclajesLibres: 5 },
  { id: 2, nombre: 'Universidad de Boyacá', direccion: 'Carrera 2ª Este #64-169', lat: 5.5528, lng: -73.3562, bicicletas: 2, anclajesLibres: 8 },
  { id: 3, nombre: 'Centro comercial Viva', direccion: 'Avenida Universitaria', lat: 5.5455, lng: -73.3505, bicicletas: 6, anclajesLibres: 4 },
  { id: 4, nombre: 'Estación Terminal', direccion: 'Transversal 19 Bis', lat: 5.5412, lng: -73.359, bicicletas: 3, anclajesLibres: 9 },
];
