import { db } from "../config/db.js";

// Revisa si el usuario tiene un viaje en estado EN_CURSO (HU_1, HU_2, HU_18, HU_21)
export function tieneViajeEnCurso(usuarioId) {
  const fila = db.prepare(
    `SELECT 1 FROM viajes WHERE usuario_id = ? AND estado = 'EN_CURSO' LIMIT 1`
  ).get(usuarioId);
  return Boolean(fila);
}

// Revisa si el usuario tiene un cobro por exceso pendiente de pago
export function tieneCobroPendiente(usuarioId) {
  const fila = db.prepare(
    `SELECT 1 FROM viajes WHERE usuario_id = ? AND estado_cobro = 'PENDIENTE' LIMIT 1`
  ).get(usuarioId);
  return Boolean(fila);
}

// Obtiene el detalle del cobro pendiente actual (si existe)
export function obtenerCobroPendiente(usuarioId) {
  return db.prepare(
    `SELECT v.*, eo.nombre AS origen, ed.nombre AS destino
     FROM viajes v
     JOIN estaciones eo ON v.estacion_origen_id = eo.id
     LEFT JOIN estaciones ed ON v.estacion_destino_id = ed.id
     WHERE v.usuario_id = ? AND v.estado_cobro = 'PENDIENTE'
     ORDER BY v.id DESC LIMIT 1`
  ).get(usuarioId);
}

// Actualiza el cobro pendiente de un viaje a PAGADO (HU_25)
export function pagarCobroPendiente(viajeId) {
  db.prepare(
    `UPDATE viajes
     SET estado_cobro = 'PAGADO'
     WHERE id = ? AND estado_cobro = 'PENDIENTE'`
  ).run(viajeId);

  return db.prepare(`SELECT * FROM viajes WHERE id = ?`).get(viajeId);
}

// Cuenta cuántos viajes ha hecho el usuario hoy en Colombia (UTC-5)
export function contarViajesHoy(usuarioId) {
  const fila = db.prepare(
    `SELECT COUNT(*) AS total
     FROM viajes
     WHERE usuario_id = ?
       AND date(fecha_inicio, '-5 hours') = date('now', '-5 hours')`
  ).get(usuarioId);
  return fila?.total ?? 0;
}

// Listado de viajes del usuario para el módulo de HISTORIAL (HU_5)
export function listarPorUsuario(usuarioId, { desde, hasta } = {}) {
  let sql = `
    SELECT
      v.id,
      v.fecha_inicio AS fechaInicio,
      v.fecha_fin AS fechaFin,
      v.duracion_min AS duracion,
      v.minutos_exceso AS minutosExceso,
      v.valor_cobrado AS valorCobrado,
      v.estado,
      v.estado_cobro AS estadoCobro,
      eo.nombre AS origen,
      COALESCE(ed.nombre, 'En trayecto') AS destino
    FROM viajes v
    JOIN estaciones eo ON v.estacion_origen_id = eo.id
    LEFT JOIN estaciones ed ON v.estacion_destino_id = ed.id
    WHERE v.usuario_id = ?
  `;
  const params = [usuarioId];

  if (desde) {
    sql += ` AND date(v.fecha_inicio) >= date(?)`;
    params.push(desde);
  }
  if (hasta) {
    sql += ` AND date(v.fecha_inicio) <= date(?)`;
    params.push(hasta);
  }

  sql += ` ORDER BY v.fecha_inicio DESC`;

  return db.prepare(sql).all(...params);
}
