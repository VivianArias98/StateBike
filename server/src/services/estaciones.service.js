import { AppError } from "../utils/AppError.js";
import { MENSAJES } from "../utils/mensajes.js";
import { estaDentroDeTunja } from "../config/limitesTunja.js";
import * as repositorio from "../repositories/estaciones.repository.js";

const LARGO_MAX = 70; // nombre y dirección (diccionario de clases)
//Límite técnico para no generar miles de anclajes por error.
const CAPACIDAD_TECNICA_MAX = 50;

const vacio = (valor) => typeof valor !== "string" || valor.trim() === "";

function ubicacionValida(lat, lng) {
  if (lat == null || lng == null || lat === "" || lng === "") return null;
  const latitud = Number(lat);
  const longitud = Number(lng);
  if (!Number.isFinite(latitud) || !Number.isFinite(longitud)) return null;
  return estaDentroDeTunja(latitud, longitud) ? { lat: latitud, lng: longitud } : null;
}

function obtener(id) {
  const estacion = Number.isInteger(id) ? repositorio.buscarPorId(id) : undefined;
  if (!estacion) throw new AppError(404, "estacion_no_encontrada");
  return estacion;
}

// Si la lista llega vacía, se explica por qué (HU_9, HU_12)
function respuestaLista(estaciones, busqueda, mensajeSinDatos) {
  if (estaciones.length > 0) return { estaciones };
  return { estaciones, mensaje: busqueda ? MENSAJES.estaciones_sin_coincidencias : mensajeSinDatos };
}

// HU_9: el visitante solo ve las ACTIVE
export function listarPublicas(busqueda = "") {
  const texto = String(busqueda).trim();
  const estaciones = repositorio.listar({ soloActivas: true, busqueda: texto });
  return respuestaLista(estaciones, texto, MENSAJES.sin_estaciones_disponibles);
}

// HU_12: el administrador ve todas (las INACTIVE con Editar deshabilitado en el front)
export function listarTodas(busqueda = "") {
  const texto = String(busqueda).trim();
  const estaciones = repositorio.listar({ busqueda: texto });
  return respuestaLista(estaciones, texto, MENSAJES.sin_estaciones_registradas);
}

// HU_11
export function registrar(datos = {}) {
  const { nombre, direccion, capacidad, lat, lng } = datos;
  const capacidadVacia = capacidad == null || String(capacidad).trim() === "";

  if (vacio(nombre) || vacio(direccion) || capacidadVacia) {
    throw new AppError(400, "campos_obligatorios_vacios");
  }

  const nombreLimpio = nombre.trim();
  const direccionLimpia = direccion.trim();
  if (nombreLimpio.length > LARGO_MAX || direccionLimpia.length > LARGO_MAX) {
    throw new AppError(400, "descripcion_invalida");
  }

  const numero = Number(capacidad);
  if (!Number.isInteger(numero) || numero <= 0 || numero > CAPACIDAD_TECNICA_MAX) {
    throw new AppError(400, "numero_invalido");
  }

  const punto = ubicacionValida(lat, lng);
  if (!punto) throw new AppError(400, "ubicacion_invalida");

  if (repositorio.existeNombre(nombreLimpio)) throw new AppError(409, "nombre_estacion_duplicado");

  const id = repositorio.crear({
    nombre: nombreLimpio,
    direccion: direccionLimpia,
    capacidad: numero,
    ...punto,
  });

  return { mensaje: MENSAJES.estacion_registrada, estacion: repositorio.buscarPorId(id) };
}

// HU_12: id y anclajes no se tocan; solo nombre, dirección y ubicación
export function modificar(id, datos = {}) {
  const actual = obtener(id);
  if (actual.estado !== "ACTIVE") throw new AppError(409, "estacion_inactiva");

  const { nombre, direccion, lat, lng } = datos;
  if (vacio(nombre) || vacio(direccion)) throw new AppError(400, "campos_obligatorios_vacios");

  const nombreLimpio = nombre.trim();
  const direccionLimpia = direccion.trim();
  if (nombreLimpio.length > LARGO_MAX || direccionLimpia.length > LARGO_MAX) {
    throw new AppError(400, "descripcion_invalida");
  }

  const punto = ubicacionValida(lat, lng);
  if (!punto) throw new AppError(400, "ubicacion_invalida");

  if (repositorio.existeNombre(nombreLimpio, id)) {
    throw new AppError(409, "nombre_estacion_duplicado");
  }

  repositorio.actualizar(id, { nombre: nombreLimpio, direccion: direccionLimpia, ...punto });
  return { mensaje: MENSAJES.estacion_modificada, estacion: repositorio.buscarPorId(id) };
}

// HU_13: la confirmación la pide el front; aquí solo se valida y se cambia el estado
export function inactivar(id) {
  const estacion = obtener(id);
  if (estacion.estado === "INACTIVE") throw new AppError(409, "estacion_inactiva");
  if (estacion.anclajesOcupados > 0) throw new AppError(409, "estacion_con_bicicletas");

  repositorio.cambiarEstado(id, "INACTIVE");
  return { mensaje: MENSAJES.estacion_inactivada, estacion: repositorio.buscarPorId(id) };
}

export function activar(id) {
  const estacion = obtener(id);
  if (estacion.estado === "ACTIVE") throw new AppError(409, "estacion_activa");

  repositorio.cambiarEstado(id, "ACTIVE");
  return { mensaje: MENSAJES.estacion_activada, estacion: repositorio.buscarPorId(id) };
}