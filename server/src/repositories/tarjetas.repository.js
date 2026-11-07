import { db } from "../config/db.js";
import { escaparLike } from "../utils/sql.js";

export function buscarPorUsuario(usuarioId) {
  return db.prepare("SELECT * FROM tarjetas WHERE usuario_id = ?").get(usuarioId);
}

export function buscarPorUid(uid) {
  return db.prepare("SELECT * FROM tarjetas WHERE uid = ?").get(uid);
}

export function crear(usuarioId, uid) {
  db.prepare(
    "INSERT INTO tarjetas (usuario_id, uid, fecha_cambio_estado) VALUES (?, ?, datetime('now'))"
  ).run(usuarioId, uid);
}

export function cambiarEstado(usuarioId, estado) {
  db.prepare(
    "UPDATE tarjetas SET estado = ?, fecha_cambio_estado = datetime('now') WHERE usuario_id = ?"
  ).run(estado, usuarioId);
}

export function eliminar(usuarioId) {
  db.prepare("DELETE FROM tarjetas WHERE usuario_id = ?").run(usuarioId);
}

// Usuarios (rol USUARIO) con su tarjeta, si la tienen; busca por correo
export function listarUsuarios({ busqueda = "" } = {}) {
  const filtro = busqueda ? "AND p.correo LIKE ? ESCAPE '\\'" : "";
  const parametros = busqueda ? [`%${escaparLike(busqueda)}%`] : [];

  return db
    .prepare(
      `SELECT p.usuario_id AS usuarioId, p.nombre, p.correo,
              t.uid, t.estado, t.fecha_vinculacion, t.fecha_cambio_estado
       FROM perfiles p
       LEFT JOIN tarjetas t ON t.usuario_id = p.usuario_id
       WHERE p.rol = 'USUARIO' ${filtro}
       ORDER BY p.usuario_id`
    )
    .all(...parametros);
}