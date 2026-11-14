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

// Obtiene el viaje en curso activo del usuario (HU_3, HU_4)
export function obtenerViajeEnCursoPorUsuario(usuarioId) {
  return db
    .prepare(
      `SELECT
         v.id,
         v.usuario_id AS usuarioId,
         v.bicicleta_id AS bicicletaId,
         b.codigo AS bicicletaCodigo,
         v.estacion_origen_id AS estacionOrigenId,
         eo.nombre AS estacionOrigenNombre,
         eo.lat AS estacionOrigenLat,
         eo.lng AS estacionOrigenLng,
         v.fecha_inicio AS fechaInicio,
         v.estado,
         v.estado_cobro AS estadoCobro
       FROM viajes v
       JOIN bicicletas b ON v.bicicleta_id = b.id
       JOIN estaciones eo ON v.estacion_origen_id = eo.id
       WHERE v.usuario_id = ? AND v.estado = 'EN_CURSO'
       LIMIT 1`
    )
    .get(usuarioId);
}

export function buscarPorId(id) {
  return db
    .prepare(
      `SELECT
         v.id,
         v.usuario_id AS usuarioId,
         v.bicicleta_id AS bicicletaId,
         b.codigo AS bicicletaCodigo,
         v.estacion_origen_id AS estacionOrigenId,
         eo.nombre AS estacionOrigenNombre,
         v.estacion_destino_id AS estacionDestinoId,
         ed.nombre AS estacionDestinoNombre,
         v.fecha_inicio AS fechaInicio,
         v.fecha_fin AS fechaFin,
         v.duracion_min AS duracionMin,
         v.minutos_exceso AS minutosExceso,
         v.valor_cobrado AS valorCobrado,
         v.estado,
         v.estado_cobro AS estadoCobro
       FROM viajes v
       JOIN bicicletas b ON v.bicicleta_id = b.id
       JOIN estaciones eo ON v.estacion_origen_id = eo.id
       LEFT JOIN estaciones ed ON v.estacion_destino_id = ed.id
       WHERE v.id = ?`
    )
    .get(id);
}

// Inicia un viaje atómicamente: inserta viaje, libera anclaje y pasa bicicleta a EN_USO (HU_3)
export function iniciarViaje({ usuarioId, bicicletaId, estacionOrigenId, anclajeOrigenId }) {
  const transaccion = db.transaction(() => {
    // 1. Insertar viaje
    const resViaje = db
      .prepare(
        `INSERT INTO viajes (usuario_id, bicicleta_id, estacion_origen_id, estado)
         VALUES (?, ?, ?, 'EN_CURSO')`
      )
      .run(usuarioId, bicicletaId, estacionOrigenId);

    // 2. Liberar anclaje de la estación
    if (anclajeOrigenId) {
      db.prepare(`UPDATE anclajes SET estado = 'LIBRE' WHERE id = ?`).run(anclajeOrigenId);
    }

    // 3. Poner bicicleta en uso y desvincular de su anclaje
    db.prepare(`UPDATE bicicletas SET estado = 'EN_USO', anclaje_id = NULL WHERE id = ?`).run(
      bicicletaId
    );

    return resViaje.lastInsertRowid;
  });

  const nuevoId = transaccion();
  return buscarPorId(nuevoId);
}

// Finaliza un viaje atómicamente: liquida viaje, ocupa anclaje y deja bicicleta DISPONIBLE (HU_4)
export function finalizarViaje({
  viajeId,
  bicicletaId,
  estacionDestinoId,
  anclajeDestinoId,
  duracionMin,
  minutosExceso,
  valorCobrado,
  estadoCobro,
}) {
  const transaccion = db.transaction(() => {
    // 1. Actualizar viaje a FINALIZADO
    db.prepare(
      `UPDATE viajes
       SET estacion_destino_id = ?,
           fecha_fin = datetime('now'),
           duracion_min = ?,
           minutos_exceso = ?,
           valor_cobrado = ?,
           estado = 'FINALIZADO',
           estado_cobro = ?
       WHERE id = ?`
    ).run(estacionDestinoId, duracionMin, minutosExceso, valorCobrado, estadoCobro, viajeId);

    // 2. Ocupar el nuevo anclaje en la estación de destino
    if (anclajeDestinoId) {
      db.prepare(`UPDATE anclajes SET estado = 'OCUPADO' WHERE id = ?`).run(anclajeDestinoId);
    }

    // 3. Dejar bicicleta disponible y asignada al anclaje
    db.prepare(`UPDATE bicicletas SET estado = 'DISPONIBLE', anclaje_id = ? WHERE id = ?`).run(
      anclajeDestinoId ?? null,
      bicicletaId
    );
  });

  transaccion();
  return buscarPorId(viajeId);
}

// Cuenta viajes en curso actuales (HU_22)
export function contarEnCurso() {
  const fila = db.prepare(`SELECT COUNT(*) AS total FROM viajes WHERE estado = 'EN_CURSO'`).get();
  return fila?.total ?? 0;
}

// Último viaje FINALIZADO del usuario (para mostrar el resumen en el front)
export function obtenerUltimoFinalizado(usuarioId) {
  const fila = db
    .prepare(
      `SELECT id FROM viajes WHERE usuario_id = ? AND estado = 'FINALIZADO' ORDER BY id DESC LIMIT 1`
    )
    .get(usuarioId);
  return fila ? buscarPorId(fila.id) : null;
}