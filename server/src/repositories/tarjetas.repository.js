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

function normalizarTexto(txt = "") {
  return String(txt)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Usuarios (rol USUARIO) con su tarjeta, si la tienen; busca por nombre, correo, ID, tarjeta UID o estado
export function listarUsuarios({ busqueda = "" } = {}) {
  const todasLasFilas = db
    .prepare(
      `SELECT p.usuario_id AS usuarioId, p.nombre, p.correo,
              t.uid, t.estado, t.fecha_vinculacion, t.fecha_cambio_estado
       FROM perfiles p
       LEFT JOIN tarjetas t ON t.usuario_id = p.usuario_id
       WHERE p.rol = 'USUARIO'
       ORDER BY p.usuario_id`
    )
    .all();

  const termino = String(busqueda || "").trim();
  if (!termino) {
    return todasLasFilas;
  }

  const terminoNormalizado = normalizarTexto(termino.replace(/^#/, ""));
  const palabras = terminoNormalizado.split(/\s+/).filter(Boolean);

  if (palabras.length === 0) {
    return todasLasFilas;
  }

  return todasLasFilas.filter((fila) => {
    const id = String(fila.usuarioId || "");
    const nombre = normalizarTexto(fila.nombre || "");
    const correo = normalizarTexto(fila.correo || "");
    const uid = normalizarTexto(fila.uid || "");
    const estado = normalizarTexto(fila.estado || "SIN VINCULAR");
    const textoCompleto = `${id} ${nombre} ${correo} ${uid} ${estado}`;

    return palabras.every((palabra) => textoCompleto.includes(palabra));
  });
}