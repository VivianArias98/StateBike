import { AppError } from "../utils/AppError.js";
import { MENSAJES } from "../utils/mensajes.js";
import * as repositorio from "../repositories/bicicletas.repository.js";
import * as estaciones from "../repositories/estaciones.repository.js";

const LARGO_MAX_CODIGO = 20; // Bicicleta.idBicicleta VARCHAR(20) en el diccionario
const ESTADOS_EDITABLES = ["DISPONIBLE", "MANTENIMIENTO"]; // HU_20

const vacio = (valor) => typeof valor !== "string" || valor.trim() === "";

function obtener(id) {
  const bicicleta = Number.isInteger(id) ? repositorio.buscarPorId(id) : undefined;
  if (!bicicleta) throw new AppError(404, "bicicleta_no_encontrada");
  return bicicleta;
}

// HU_20: consulta con buscador por código
export function listar(busqueda = "") {
  return { bicicletas: repositorio.listar({ busqueda: String(busqueda).trim() }) };
}

// HU_14: el estado y el anclaje se asignan solos
export function registrar(datos = {}) {
  const { codigo, estacionId } = datos;
  const sinEstacion = estacionId == null || String(estacionId).trim() === "";
  if (vacio(codigo) || sinEstacion) throw new AppError(400, "campos_obligatorios_vacios");

  const codigoLimpio = codigo.trim();
  if (codigoLimpio.length > LARGO_MAX_CODIGO) throw new AppError(400, "codigo_invalido");
  if (repositorio.existeCodigo(codigoLimpio)) {
    throw new AppError(409, "codigo_bicicleta_duplicado");
  }

  const estacion = estaciones.buscarPorId(Number(estacionId));
  if (!estacion) throw new AppError(404, "estacion_no_encontrada");
  if (estacion.estado !== "ACTIVE") throw new AppError(409, "estacion_inactiva");

  const anclaje = repositorio.primerAnclajeLibre(estacion.id);
  if (!anclaje) throw new AppError(409, "estacion_sin_anclajes_libres");

  const id = repositorio.crear(codigoLimpio, anclaje.id);
  return { mensaje: MENSAJES.bicicleta_registrada, bicicleta: repositorio.buscarPorId(id) };
}

// HU_20: solo se cambia el estado entre DISPONIBLE y MANTENIMIENTO; el código no se edita
export function modificar(id, datos = {}) {
  const bicicleta = obtener(id);
  if (bicicleta.estado === "EN_USO") throw new AppError(409, "bicicleta_en_uso");
  if (bicicleta.estado === "INACTIVA") throw new AppError(409, "bicicleta_inactiva");

  if (vacio(datos.estado)) throw new AppError(400, "campos_obligatorios_vacios");
  if (!ESTADOS_EDITABLES.includes(datos.estado)) throw new AppError(400, "estado_invalido");

  repositorio.cambiarEstado(id, datos.estado);
  return { mensaje: MENSAJES.bicicleta_actualizada, bicicleta: repositorio.buscarPorId(id) };
}

// HU_20: la confirmación la pide el front; aquí se valida y se inactiva
export function inactivar(id) {
  const bicicleta = obtener(id);
  if (bicicleta.estado === "EN_USO") throw new AppError(409, "bicicleta_en_uso");
  if (bicicleta.estado === "INACTIVA") throw new AppError(409, "bicicleta_inactiva");

  repositorio.inactivar(id);
  return { mensaje: MENSAJES.bicicleta_inactivada, bicicleta: repositorio.buscarPorId(id) };
}

// Reactivar bicicleta inactiva asignándole un anclaje libre en una estación activa
export function activar(id, datos = {}) {
  const bicicleta = obtener(id);
  if (bicicleta.estado !== "INACTIVA") throw new AppError(409, "bicicleta_ya_activa");

  let anclaje;
  const estacionId = datos?.estacionId ? Number(datos.estacionId) : null;

  if (estacionId) {
    const estacion = estaciones.buscarPorId(estacionId);
    if (!estacion) throw new AppError(404, "estacion_no_encontrada");
    if (estacion.estado !== "ACTIVE") throw new AppError(409, "estacion_inactiva");
    anclaje = repositorio.primerAnclajeLibre(estacion.id);
    if (!anclaje) throw new AppError(409, "estacion_sin_anclajes_libres");
  } else {
    anclaje = repositorio.primerAnclajeLibreCualquierEstacion();
    if (!anclaje) throw new AppError(409, "sin_anclajes_disponibles");
  }

  repositorio.activar(id, anclaje.id);
  return { mensaje: MENSAJES.bicicleta_activada, bicicleta: repositorio.buscarPorId(id) };
}