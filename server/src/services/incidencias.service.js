import { AppError } from "../utils/AppError.js";
import { MENSAJES } from "../utils/mensajes.js";
import * as incidenciasRepo from "../repositories/incidencias.repository.js";
import * as bicicletasRepo from "../repositories/bicicletas.repository.js";
import * as estacionesRepo from "../repositories/estaciones.repository.js";

const LARGO_MAX_DESCRIPCION = 500;

function normalizarTipo(tipo) {
  const t = String(tipo ?? "").toUpperCase().trim();
  if (t.includes("BICI")) return "BICICLETA";
  if (t.includes("ANCLAJE") || t.includes("ESTACION") || t.includes("ESTACIÓN")) return "ANCLAJE";
  if (t.includes("TARJETA") || t.includes("NFC")) return "TARJETA";
  if (t.includes("OTRO")) return "OTRO";
  if (["BICICLETA", "ANCLAJE", "TARJETA", "OTRO"].includes(t)) return t;
  throw new AppError(400, "campos_obligatorios_vacios");
}

/**
 * Reportar una nueva incidencia o daño (HU_6).
 * Valida descripción (máx 500 caracteres).
 * Exige bicicleta o estación salvo cuando el tipo sea TARJETA.
 * Registra la incidencia con estado inicial ABIERTA.
 */
export function reportar(usuarioId, datos = {}) {
  const { tipo, bicicletaId, codigoBicicleta, estacionId, descripcion } = datos;

  const tipoNormalizado = normalizarTipo(tipo);

  // Descripción obligatoria, máx 500 caracteres (HU_6)
  if (!descripcion || typeof descripcion !== "string" || descripcion.trim() === "") {
    throw new AppError(400, "descripcion_invalida");
  }
  const descripcionLimpia = descripcion.trim();
  if (descripcionLimpia.length > LARGO_MAX_DESCRIPCION) {
    throw new AppError(400, "descripcion_invalida");
  }

  let finalBicicletaId = null;
  if (bicicletaId) {
    const b = bicicletasRepo.buscarPorId(Number(bicicletaId));
    if (b) finalBicicletaId = b.id;
  } else if (codigoBicicleta) {
    const b = bicicletasRepo.buscarPorCodigo(codigoBicicleta);
    if (b) finalBicicletaId = b.id;
  }

  let finalEstacionId = null;
  if (estacionId) {
    const e = estacionesRepo.buscarPorId(Number(estacionId));
    if (e) finalEstacionId = e.id;
  }

  // Precondición HU_6: Indicar bicicleta o estación salvo para tarjeta NFC
  if (tipoNormalizado !== "TARJETA" && !finalBicicletaId && !finalEstacionId) {
    throw new AppError(400, "indique_recurso");
  }

  const incidencia = incidenciasRepo.crear({
    usuarioId,
    tipo: tipoNormalizado,
    bicicletaId: finalBicicletaId,
    estacionId: finalEstacionId,
    descripcion: descripcionLimpia,
  });

  return {
    mensaje: MENSAJES.reporte_enviado,
    incidencia,
  };
}

/**
 * Consulta las incidencias reportadas por el usuario en sesión (HU_6).
 */
export function listarMisIncidencias(usuarioId) {
  const incidencias = incidenciasRepo.listarPorUsuario(usuarioId);
  return incidencias.length > 0
    ? { incidencias }
    : { incidencias: [], mensaje: MENSAJES.sin_incidencias };
}

/**
 * Listado para el administrador (HU_19).
 * Ordenadas con ABIERTA primero, luego ATENDIDA y CERRADA.
 */
export function listarAdmin({ estado } = {}) {
  const incidencias = incidenciasRepo.listarTodas({ estado });
  return incidencias.length > 0
    ? { incidencias }
    : { incidencias: [], mensaje: MENSAJES.sin_incidencias };
}

/**
 * Atender incidencia (HU_19).
 * Requiere observación obligatoria y pasa a estado ATENDIDA.
 */
export function atender(id, datos = {}) {
  const incidencia = incidenciasRepo.buscarPorId(Number(id));
  if (!incidencia) {
    throw new AppError(404, "incidencia_no_encontrada");
  }

  const observacion = String(datos.observacion ?? "").trim();
  if (!observacion) {
    throw new AppError(400, "campos_obligatorios_vacios");
  }

  const actualizada = incidenciasRepo.atender(incidencia.id, observacion);

  return {
    mensaje: MENSAJES.incidencia_atendida,
    incidencia: actualizada,
  };
}

/**
 * Cerrar incidencia (HU_19).
 * Regla mandataria: Debe haberse atendido primero antes de poder cerrarse.
 * Las incidencias nunca se borran.
 */
export function cerrar(id) {
  const incidencia = incidenciasRepo.buscarPorId(Number(id));
  if (!incidencia) {
    throw new AppError(404, "incidencia_no_encontrada");
  }

  if (incidencia.estado !== "ATENDIDA") {
    throw new AppError(400, "debe_atender_primero");
  }

  const cerrada = incidenciasRepo.cerrar(incidencia.id);

  return {
    mensaje: MENSAJES.incidencia_cerrada,
    incidencia: cerrada,
  };
}

