import { db } from "../config/db.js";

// Aplica el vencimiento automático: si fecha_fin ya pasó, pasa a VENCIDO
function aplicarVencimiento(usuarioId) {
  db.prepare(
    `UPDATE suscripciones
     SET estado = 'VENCIDO'
     WHERE usuario_id = ? AND estado = 'ACTIVO' AND datetime('now') >= datetime(fecha_fin)`
  ).run(usuarioId);
}

// Obtiene la suscripción ACTIVA vigente del usuario (si expiró, la marca VENCIDO y no la devuelve)
export function obtenerActiva(usuarioId) {
  aplicarVencimiento(usuarioId);

  return db.prepare(
    `SELECT * FROM suscripciones
     WHERE usuario_id = ? AND estado = 'ACTIVO'
     ORDER BY id DESC LIMIT 1`
  ).get(usuarioId);
}

// Obtiene la última suscripción del usuario, sin importar su estado
export function obtenerUltima(usuarioId) {
  aplicarVencimiento(usuarioId);

  return db.prepare(
    `SELECT * FROM suscripciones
     WHERE usuario_id = ?
     ORDER BY id DESC LIMIT 1`
  ).get(usuarioId);
}

// Verifica si el usuario tiene un plan activo y vigente
export function tienePlanActivo(usuarioId) {
  return Boolean(obtenerActiva(usuarioId));
}

// Crea una nueva suscripción asociada al usuario
export function crear({
  usuarioId,
  planId,
  nombrePlan,
  costoBase,
  vigenciaDias,
  viajesPorDia,
  tiempoViajeMin,
  valorMinutoExceso,
  fechaFin,
}) {
  const resultado = db.prepare(
    `INSERT INTO suscripciones
     (usuario_id, plan_id, nombre_plan, costo_base, vigencia_dias, viajes_por_dia, tiempo_viaje_min, valor_minuto_exceso, fecha_fin)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    usuarioId,
    planId,
    nombrePlan,
    costoBase,
    vigenciaDias,
    viajesPorDia,
    tiempoViajeMin,
    valorMinutoExceso,
    fechaFin
  );

  return db.prepare(`SELECT * FROM suscripciones WHERE id = ?`).get(resultado.lastInsertRowid);
}

// Cancela la suscripción activa (HU_2): pasa a CANCELADO de inmediato
export function cancelar(id) {
  db.prepare(
    `UPDATE suscripciones
     SET estado = 'CANCELADO', fecha_cancelacion = datetime('now')
     WHERE id = ?`
  ).run(id);

  return db.prepare(`SELECT * FROM suscripciones WHERE id = ?`).get(id);
}

