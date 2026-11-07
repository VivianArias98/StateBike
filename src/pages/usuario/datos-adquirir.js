// Datos de ejemplo del flujo Adquirir Plan (solo maquetación). Después llegarán del backend.
export const SALDO = 65000;
export const NFC = 'TUN-8831';

// Planes que muestra el flujo (el plan anual no aparece en este diseño)
export const PLANES_FLUJO = [
  {
    id: 'diario',
    nombre: 'Plan Diario',
    etiqueta: 'Ocasional',
    icono: 'rayo',
    precio: 4000,
    descripcion: 'Ideal para trayectos rápidos, diligencias o visitas ocasionales a la ciudad.',
    caracteristicas: ['Vigencia: 24 Horas', '2 viajes incluidos', 'Hasta 30 min por viaje', 'Exceso: $100 COP/min'],
    vigenciaTexto: '1 día',
    viajesDiaTexto: '2 viajes al día',
    tiempoTexto: '30 minutos',
    fechaFinTexto: '1 día a partir del pago',
    condiciones: '2 viajes al día · hasta 30 min por viaje · exceso $100 COP/min',
  },
  {
    id: 'mensual',
    nombre: 'Plan Mensual',
    etiqueta: 'Recomendado',
    icono: 'bicicleta',
    precio: 32000,
    descripcion: 'Uso habitual para estudiantes, trabajadores y residentes de Tunja.',
    caracteristicas: ['Vigencia: 30 Días', '4 viajes por día', 'Hasta 40 min por viaje', 'Exceso: $100 COP/min'],
    vigenciaTexto: '30 días',
    viajesDiaTexto: '4 viajes al día',
    tiempoTexto: '40 minutos',
    fechaFinTexto: '30 días a partir del pago',
    condiciones: '4 viajes al día · hasta 40 min por viaje · exceso $100 COP/min',
  },
  {
    id: 'semestral',
    nombre: 'Plan Semestral',
    etiqueta: 'Largo plazo',
    icono: 'medalla',
    precio: 150000,
    descripcion: 'Máximo ahorro para periodos académicos continuos y commuting regular.',
    caracteristicas: ['Vigencia: 180 Días', '4 viajes por día', 'Hasta 45 min por viaje', 'Exceso: $100 COP/min'],
    vigenciaTexto: '180 días',
    viajesDiaTexto: '4 viajes al día',
    tiempoTexto: '45 minutos',
    fechaFinTexto: '180 días a partir del pago',
    condiciones: '4 viajes al día · hasta 45 min por viaje · exceso $100 COP/min',
  },
];
