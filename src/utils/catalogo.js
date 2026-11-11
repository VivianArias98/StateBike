// Consultas públicas del catálogo: estaciones y planes. No requieren sesión.
// El backend ya filtra: solo llegan estaciones y planes activos.
import { pedir } from './apiClient.js';

export async function obtenerEstaciones(q = '') {
  const texto = q.trim();
  const ruta = texto ? `/estaciones?q=${encodeURIComponent(texto)}` : '/estaciones';
  const datos = await pedir(ruta);
  return { estaciones: datos.estaciones ?? [], mensaje: datos.mensaje };
}

export async function obtenerPlanes() {
  const datos = await pedir('/planes');
  return { planes: datos.planes ?? [], mensaje: datos.mensaje };
}
