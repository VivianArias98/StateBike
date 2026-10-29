import { estaDentroDeTunja } from '../../../components/MapaTunja/limitesTunja.js';

export const MENSAJES = {
  vacios: 'Campos obligatorios vacíos',
  descripcion: 'Descripción inválida (nombre máx. 70, dirección máx. 70)',
  capacidad: 'Capacidad inválida',
  ubicacion: 'Ubicación inválida',
  repetido: 'El nombre de la estación ya se encuentra registrado',
};

export function validarEstacion(
  { nombre, direccion, capacidad, punto },
  { validarCapacidad = true } = {}
) {
  if (
    !nombre.trim() ||
    !direccion.trim() ||
    (validarCapacidad && String(capacidad).trim() === '')
  ) {
    return MENSAJES.vacios;
  }

  if (nombre.trim().length > 70 || direccion.trim().length > 70) {
    return MENSAJES.descripcion;
  }

  if (validarCapacidad) {
    const numero = Number(capacidad);
    if (!Number.isInteger(numero) || numero <= 0) return MENSAJES.capacidad;
  }

  if (!punto || !estaDentroDeTunja(punto.lat, punto.lng)) {
    return MENSAJES.ubicacion;
  }

  return '';
}

// idIgnorado: al editar, la propia estación no cuenta como repetida
export function nombreRepetido(nombre, estaciones, idIgnorado = null) {
  const buscado = nombre.trim().toLowerCase();
  return estaciones.some(
    (estacion) =>
      estacion.id !== idIgnorado && estacion.nombre.trim().toLowerCase() === buscado
  );
}