// Catálogo de avatares ejecutivos oficiales para el Administrador de StationBike
// Diseñados con vestimenta elegante y formal para el panel de control y supervisión

export const AVATARES_ADMIN = [
  {
    id: 'admin-mujer-1',
    nombre: 'Valentina',
    rol: 'Directora de Operaciones',
    genero: 'Mujer',
    descripcion: 'Blazer azul marino, blusa blanca de cuello en V y peinado formal',
    estilo: 'Traje ejecutivo clásico',
  },
  {
    id: 'admin-mujer-2',
    nombre: 'Carolina',
    rol: 'Gerente de Red y Tecnología',
    genero: 'Mujer',
    descripcion: 'Blazer carbón grafito, blusa esmeralda y gafas ejecutivas',
    estilo: 'Ejecutiva contemporánea con gafas',
  },
  {
    id: 'admin-mujer-3',
    nombre: 'Mariana',
    rol: 'Coordinadora de Estaciones',
    genero: 'Mujer',
    descripcion: 'Traje sastre negro con solapa fina y cabello ondulado elegante',
    estilo: 'Alta dirección formal',
  },
  {
    id: 'admin-hombre-1',
    nombre: 'Alejandro',
    rol: 'Director General',
    genero: 'Hombre',
    descripcion: 'Traje azul marino, camisa blanca y corbata ejecutiva esmeralda',
    estilo: 'Traje formal con corbata',
  },
  {
    id: 'admin-hombre-2',
    nombre: 'Gabriel',
    rol: 'Gerente de Flota y Logística',
    genero: 'Hombre',
    descripcion: 'Traje carbón con camisa celeste, corbata grafito y gafas ejecutivas',
    estilo: 'Formal ejecutivo con montura fina',
  },
  {
    id: 'admin-hombre-3',
    nombre: 'Camilo',
    rol: 'Auditor y Supervisor Central',
    genero: 'Hombre',
    descripcion: 'Blazer negro de corte italiano, pañuelo de bolsillo y barba pulcra',
    estilo: 'Sastrería italiana con barba prolija',
  },
];

export const AVATAR_ADMIN_POR_DEFECTO = 'admin-mujer-1';

export function obtenerAvatarAdmin(id) {
  return AVATARES_ADMIN.find((a) => a.id === id) || AVATARES_ADMIN[0];
}

