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

// Reubica una bicicleta a otra estación activa con anclajes disponibles
export function reubicar(id, datos = {}) {
  const bicicleta = obtener(id);
  if (bicicleta.estado === "EN_USO") throw new AppError(409, "bicicleta_en_uso");
  if (bicicleta.estado === "INACTIVA") throw new AppError(409, "bicicleta_inactiva");

  const estacionDestinoId = datos?.estacionId ? Number(datos.estacionId) : null;
  if (!estacionDestinoId) throw new AppError(400, "campos_obligatorios_vacios");

  if (bicicleta.estacionId === estacionDestinoId) {
    throw new AppError(400, "misma_estacion_origen_destino", {
      mensaje: "La bicicleta ya se encuentra en esta estación",
    });
  }

  const estacionDestino = estaciones.buscarPorId(estacionDestinoId);
  if (!estacionDestino) throw new AppError(404, "estacion_no_encontrada");
  if (estacionDestino.estado !== "ACTIVE") throw new AppError(409, "estacion_inactiva");

  const anclaje = repositorio.primerAnclajeLibre(estacionDestino.id);
  if (!anclaje) throw new AppError(409, "estacion_sin_anclajes_libres");

  repositorio.reubicar(id, anclaje.id);

  return {
    mensaje: "BICICLETA REUBICADA EXITOSAMENTE",
    bicicleta: repositorio.buscarPorId(id),
  };
}

// Reubica todas las bicicletas de una estación hacia otra estación activa
export function reubicarTodas(estacionOrigenId, datos = {}) {
  const origenId = Number(estacionOrigenId);
  const estacionDestinoId = datos?.estacionDestinoId ? Number(datos.estacionDestinoId) : null;
  if (!estacionDestinoId) throw new AppError(400, "campos_obligatorios_vacios");

  if (origenId === estacionDestinoId) {
    throw new AppError(400, "misma_estacion_origen_destino", {
      mensaje: "La estación de origen y destino no pueden ser la misma",
    });
  }

  const estacionDestino = estaciones.buscarPorId(estacionDestinoId);
  if (!estacionDestino) throw new AppError(404, "estacion_no_encontrada");
  if (estacionDestino.estado !== "ACTIVE") throw new AppError(409, "estacion_inactiva");

  const bicis = repositorio.listarPorEstacion(origenId);
  if (bicis.length === 0) {
    return { mensaje: "La estación no tiene bicicletas para reubicar", reubicadas: 0 };
  }

  const bicisAReubicar = bicis.filter((b) => b.estado !== "EN_USO");
  if (bicisAReubicar.length === 0) {
    throw new AppError(409, "bicicleta_en_uso", {
      mensaje: "Todas las bicicletas de esta estación están actualmente en uso",
    });
  }

  if (estacionDestino.anclajesLibres < bicisAReubicar.length) {
    throw new AppError(409, "estacion_sin_anclajes_suficientes", {
      mensaje: `La estación ${estacionDestino.nombre} solo tiene ${estacionDestino.anclajesLibres} anclaje(s) libre(s) y se requieren ${bicisAReubicar.length}`,
    });
  }

  for (const b of bicisAReubicar) {
    const anclajeLibre = repositorio.primerAnclajeLibre(estacionDestino.id);
    if (anclajeLibre) {
      repositorio.reubicar(b.id, anclajeLibre.id);
    }
  }

  return {
    mensaje: `Se reubicaron ${bicisAReubicar.length} bicicleta(s) a la estación ${estacionDestino.nombre}`,
    reubicadas: bicisAReubicar.length,
  };
}