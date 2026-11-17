// Consultas públicas del catálogo: estaciones y planes. No requieren sesión.
// Si el backend no está disponible (ej. despliegue estático en Vercel o modo Offline PWA),
// se utiliza el catálogo base de Tunja como respaldo de alta disponibilidad.
import { pedir } from './apiClient.js';

export const ESTACIONES_DEFECTO = [
  {
    id: 92,
    nombre: 'Los Muiscas',
    direccion: 'Avenida Norte con Calle 66',
    capacidad: 20,
    anclajesLibres: 18,
    bicicletas: 2,
    lat: 5.569815180732708,
    lng: -73.33962207709948,
    estado: 'ACTIVE',
  },
  {
    id: 93,
    nombre: 'Uniboyacá',
    direccion: 'Avenida Universitaria',
    capacidad: 30,
    anclajesLibres: 26,
    bicicletas: 4,
    lat: 5.539274788807716,
    lng: -73.3576011657715,
    estado: 'ACTIVE',
  },
  {
    id: 94,
    nombre: 'Plaza de Bolívar',
    direccion: 'Plaza de Bolívar Centro Histórico',
    capacidad: 10,
    anclajesLibres: 7,
    bicicletas: 3,
    lat: 5.532312212424458,
    lng: -73.36108803749086,
    estado: 'ACTIVE',
  },
  {
    id: 95,
    nombre: 'Avenida Maldonado',
    direccion: 'Carrera 10',
    capacidad: 20,
    anclajesLibres: 15,
    bicicletas: 5,
    lat: 5.540855239508358,
    lng: -73.35978515623655,
    estado: 'ACTIVE',
  },
  {
    id: 96,
    nombre: 'Simón Bolívar',
    direccion: 'Calle 17 N° 10 - 47',
    capacidad: 15,
    anclajesLibres: 12,
    bicicletas: 3,
    lat: 5.533956754733228,
    lng: -73.34923267364503,
    estado: 'ACTIVE',
  },
  {
    id: 97,
    nombre: 'Sur',
    direccion: 'Calle Sur',
    capacidad: 15,
    anclajesLibres: 13,
    bicicletas: 2,
    lat: 5.541581391115115,
    lng: -73.37107658386232,
    estado: 'ACTIVE',
  },
];

export const PLANES_DEFECTO = [
  { id: 1, nombre: 'Plan Diario', costoBase: 4000, vigenciaDias: 1, viajesPorDia: 2, tiempoViajeMin: 30 },
  { id: 2, nombre: 'Plan Mensual', costoBase: 32000, vigenciaDias: 30, viajesPorDia: 4, tiempoViajeMin: 45 },
  { id: 3, nombre: 'Plan Semestral', costoBase: 150000, vigenciaDias: 180, viajesPorDia: 4, tiempoViajeMin: 45 },
  { id: 4, nombre: 'Plan Anual', costoBase: 240000, vigenciaDias: 365, viajesPorDia: 4, tiempoViajeMin: 60 },
];

export async function obtenerEstaciones(q = '') {
  const texto = q.trim().toLowerCase();
  try {
    const ruta = texto ? `/estaciones?q=${encodeURIComponent(texto)}` : '/estaciones';
    const datos = await pedir(ruta);
    if (datos && Array.isArray(datos.estaciones)) {
      return { estaciones: datos.estaciones, mensaje: datos.mensaje };
    }
  } catch (_) {
    // Si la API falla o no está conectada, pasamos al fallback seguro
  }

  // Fallback offline / catálogo base en la nube
  const filtradas = texto
    ? ESTACIONES_DEFECTO.filter(
        (e) =>
          e.nombre.toLowerCase().includes(texto) ||
          e.direccion.toLowerCase().includes(texto)
      )
    : ESTACIONES_DEFECTO;

  return { estaciones: filtradas, mensaje: null };
}

export async function obtenerPlanes() {
  try {
    const datos = await pedir('/planes');
    if (datos && Array.isArray(datos.planes)) {
      return { planes: datos.planes, mensaje: datos.mensaje };
    }
  } catch (_) {
    // Si la API falla o no está conectada, pasamos al fallback seguro
  }

  return { planes: PLANES_DEFECTO, mensaje: null };
}
