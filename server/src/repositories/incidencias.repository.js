import { db } from "../config/db.js";

const SELECCION = `
  SELECT
    i.id,
    i.usuario_id AS usuarioId,
    p.nombre AS reportadoPor,
    p.correo AS correoUsuario,
    i.tipo,
    i.bicicleta_id AS bicicletaId,
    b.codigo AS codigoBicicleta,
    i.estacion_id AS estacionId,
    e.nombre AS nombreEstacion,
    i.descripcion,
    i.estado,
    i.observacion_admin AS observacionAdmin,
    i.fecha_creacion AS fechaCreacion,
    i.fecha_atencion AS fechaAtencion,
    i.fecha_cierre AS fechaCierre
  FROM incidencias i
  JOIN perfiles p ON i.usuario_id = p.usuario_id
  LEFT JOIN bicicletas b ON i.bicicleta_id = b.id
  LEFT JOIN estaciones e ON i.estacion_id = e.id
`;

export function crear({ usuarioId, tipo, bicicletaId, estacionId, descripcion }) {
  const resultado = db
    .prepare(
      `INSERT INTO incidencias (usuario_id, tipo, bicicleta_id, estacion_id, descripcion)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(usuarioId, tipo, bicicletaId ?? null, estacionId ?? null, descripcion);

  return buscarPorId(resultado.lastInsertRowid);
}

export function buscarPorId(id) {
  return db.prepare(`${SELECCION} WHERE i.id = ?`).get(id);
}

export function listarPorUsuario(usuarioId) {
  return db
    .prepare(`${SELECCION} WHERE i.usuario_id = ? ORDER BY i.fecha_creacion DESC`)
    .all(usuarioId);
}

export function listarTodas({ estado } = {}) {
  let sql = SELECCION;
  const params = [];

  if (estado) {
    sql += ` WHERE i.estado = ?`;
    params.push(estado);
  }

  sql += `
    ORDER BY
      CASE i.estado
        WHEN 'ABIERTA' THEN 1
        WHEN 'ATENDIDA' THEN 2
        WHEN 'CERRADA' THEN 3
      END,
      i.fecha_creacion DESC
  `;

  return db.prepare(sql).all(...params);
}

export function atender(id, observacion) {
  db.prepare(
    `UPDATE incidencias
     SET estado = 'ATENDIDA', observacion_admin = ?, fecha_atencion = datetime('now')
     WHERE id = ?`
  ).run(observacion, id);

  return buscarPorId(id);
}

export function cerrar(id) {
  db.prepare(
    `UPDATE incidencias
     SET estado = 'CERRADA', fecha_cierre = datetime('now')
     WHERE id = ?`
  ).run(id);

  return buscarPorId(id);
}

export function contarAbiertas() {
  const fila = db.prepare(`SELECT COUNT(*) AS total FROM incidencias WHERE estado = 'ABIERTA'`).get();
  return fila?.total ?? 0;
}

export function listarRecientes(limite = 5) {
  return db.prepare(`${SELECCION} ORDER BY i.fecha_creacion DESC LIMIT ?`).all(limite);
}

