// Catálogo de avatares ciclistas oficiales de StationBike (HU_1)
// Incluye opciones de mujeres y hombres con cascos de bicicleta y equipamiento ciclista

export const AVATARES_CICLISTAS = [
  {
    id: 'mujer-casco-1',
    nombre: 'Elena',
    genero: 'Mujer',
    descripcion: 'Casco lima urbano y coleta deportiva',
    tipoCasco: 'Urbano aerodinámico',
  },
  {
    id: 'mujer-casco-2',
    nombre: 'Sofía',
    genero: 'Mujer',
    descripcion: 'Casco menta ruta con gafas deportivas',
    tipoCasco: 'Ruta pro con gafas',
  },
  {
    id: 'mujer-casco-3',
    nombre: 'Camila',
    genero: 'Mujer',
    descripcion: 'Casco turquesa y cabello ondulado',
    tipoCasco: 'Commuter ventilado',
  },
  {
    id: 'hombre-casco-1',
    nombre: 'Mateo',
    genero: 'Hombre',
    descripcion: 'Casco verde lima con visera urbana',
    tipoCasco: 'Urbano con visera',
  },
  {
    id: 'hombre-casco-2',
    nombre: 'Sebastián',
    genero: 'Hombre',
    descripcion: 'Casco aerodinámico y gafas de ciclismo',
    tipoCasco: 'Ruta de alta velocidad',
  },
  {
    id: 'hombre-casco-3',
    nombre: 'Lucas',
    genero: 'Hombre',
    descripcion: 'Casco carbón commuter con barba corta',
    tipoCasco: 'Montaña / Urbano oscuro',
  },
];

export const AVATAR_POR_DEFECTO = 'mujer-casco-1';

export function obtenerAvatar(id) {
  return AVATARES_CICLISTAS.find((a) => a.id === id) || AVATARES_CICLISTAS[0];
}

