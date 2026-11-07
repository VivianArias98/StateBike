import { db } from "../config/db.js";

//Las consultas se preparan dentro de cada función: así el esquema
//ya existe cuando se ejecutan, sin importar el orden de los imports.

export function buscar(usuarioId) {
  return db.prepare("SELECT * FROM perfiles WHERE usuario_id = ?").get(usuarioId);
}

// INSERT OR IGNORE: si el perfil ya existe no pasa nada
export function crear(usuarioId, { fechaNacimiento = null, correo = null, nombre = null } = {}) {
  db.prepare(
    "INSERT OR IGNORE INTO perfiles (usuario_id, fecha_nacimiento, correo, nombre) VALUES (?, ?, ?, ?)"
  ).run(usuarioId, fechaNacimiento, correo, nombre);
}

//Usuarios creados desde otro proyecto no tienen perfil local todavía
export function obtenerOCrear(usuarioId) {
  crear(usuarioId);
  return buscar(usuarioId);
}

export function registrarAcceso(usuarioId) {
  db.prepare("UPDATE perfiles SET ultimo_acceso = datetime('now') WHERE usuario_id = ?").run(
    usuarioId
  );
}

//Copia local del correo y el nombre de TunjaAPI (para listar y buscar por correo)
export function actualizarContacto(usuarioId, correo, nombre) {
  db.prepare("UPDATE perfiles SET correo = ?, nombre = ? WHERE usuario_id = ?").run(
    correo,
    nombre,
    usuarioId
  );
}

//Usuarios guardados antes de que existiera la copia local
export function idsSinContacto() {
  return db
    .prepare("SELECT usuario_id FROM perfiles WHERE rol = 'USUARIO' AND correo IS NULL")
    .all()
    .map((fila) => fila.usuario_id);
}