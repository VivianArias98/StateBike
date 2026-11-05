import { db } from "../config/db.js";

//Las consultas se preparan dentro de cada función: así el esquema
//ya existe cuando se ejecutan, sin importar el orden de los imports.

export function buscar(usuarioId) {
  return db.prepare("SELECT * FROM perfiles WHERE usuario_id = ?").get(usuarioId);
}

//INSERT OR IGNORE: si el perfil ya existe no pasa nada
export function crear(usuarioId, fechaNacimiento = null) {
  db.prepare(
    "INSERT OR IGNORE INTO perfiles (usuario_id, fecha_nacimiento) VALUES (?, ?)"
  ).run(usuarioId, fechaNacimiento);
}

//Usuarios creados desde otro proyecto no tienen perfil local todavía
export function obtenerOCrear(usuarioId) {
  crear(usuarioId);
  return buscar(usuarioId);
}

export function registrarAcceso(usuarioId) {
  db.prepare(
    "UPDATE perfiles SET ultimo_acceso = datetime('now') WHERE usuario_id = ?"
  ).run(usuarioId);
}