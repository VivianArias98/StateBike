// Planes del catálogo "Sin plan" tal como aparecen en el mockup de Mi Plan (sin suscripción).
export const CATALOGO_SIN_PLAN = [
  {
    id: 'diario',
    encabezado: 'Plan diario',
    vigencia: '1 día vigencia',
    precio: 4000,
    detallePrecio: 'Pago único por jornada',
    caracteristicas: ['2 viajes por día', '30 min por viaje', 'Acceso a toda la red'],
  },
  {
    id: 'mensual',
    encabezado: 'Plan mensual',
    vigencia: '30 días vigencia',
    precio: 32000,
    detallePrecio: 'Equivale a ~$1.066 COP / día',
    caracteristicas: ['4 viajes por día', '45 min por viaje', 'Renovación bajo demanda'],
    recomendado: true,
  },
  {
    id: 'semestral',
    encabezado: 'Plan semestral',
    vigencia: '180 días vigencia',
    precio: 150000,
    detallePrecio: 'Ahorro del 22% frente a mes a mes',
    caracteristicas: ['4 viajes por día', '45 min por viaje', 'Seguro contra daños inc.'],
  },
  {
    id: 'anual',
    encabezado: 'Plan anual',
    vigencia: '365 días vigencia',
    precio: 240000,
    detallePrecio: 'Máximo ahorro global',
    caracteristicas: ['4 viajes por día', '60 min por viaje', 'Máximo ahorro global'],
  },
];
