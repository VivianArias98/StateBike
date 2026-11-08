import { db } from "../config/db.js";
import { escaparLike } from "../utils/sql.js";

//La estación y el anclaje salen del anclaje que ocupa la bicicleta
const SELECCION = `
  SELECT b.id, b.codigo, b.estado,
         e.id AS estacionId, e.nombre AS estacion, a.codigo AS anclaje
  FROM bicicletas b
  LEFT JOIN anclajes a ON a.id = b.anclaje_id
  LEFT JOIN estaciones e ON e.id = a.estacion_id`;

export function listar({ busqueda = "" } = {}) {
  const donde = busqueda ? "WHERE b.codigo LIKE ? ESCAPE '\\'" : "";
  const parametros = busqueda ? [`%${escaparLike(busqueda)}%`] : [];
  return db.prepare(`${SELECCION} ${donde} ORDER BY b.id`).all(...parametros);
}

export function buscarPorId(id) {
  return db.prepare(`${SELECCION} WHERE b.id = ?`).get(id);
}

export function existeCodigo(codigo) {
  return Boolean(db.prepare("SELECT 1 FROM bicicletas WHERE codigo = ?").get(codigo));
}

export function buscarPorCodigo(codigo) {
  return db.prepare("SELECT * FROM bicicletas WHERE codigo = ? COLLATE NOCASE").get(codigo);
}

//El anclaje libre de menor número de la estación
export function primerAnclajeLibre(estacionId) {
  return db
    .prepare(
      "SELECT id FROM anclajes WHERE estacion_id = ? AND estado = 'LIBRE' ORDER BY numero LIMIT 1"
    )
    .get(estacionId);
}

//Registra la bicicleta DISPONIBLE y ocupa el anclaje en una sola transacción
export function crear(codigo, anclajeId) {
  const registrar = db.transaction(() => {
    const { lastInsertRowid } = db
      .prepare("INSERT INTO bicicletas (codigo, anclaje_id) VALUES (?, ?)")
      .run(codigo, anclajeId);
    db.prepare("UPDATE anclajes SET estado = 'OCUPADO' WHERE id = ?").run(anclajeId);
    return Number(lastInsertRowid);
  });
  return registrar();
}

export function cambiarEstado(id, estado) {
  db.prepare("UPDATE bicicletas SET estado = ? WHERE id = ?").run(estado, id);
}

//Pasa a INACTIVA y libera su anclaje; el registro no se borra
export function inactivar(id) {
  const inactivarBicicleta = db.transaction(() => {
    const { anclaje_id: anclajeId } = db
      .prepare("SELECT anclaje_id FROM bicicletas WHERE id = ?")
      .get(id);

    db.prepare("UPDATE bicicletas SET estado = 'INACTIVA', anclaje_id = NULL WHERE id = ?").run(id);
    if (anclajeId) {
      db.prepare("UPDATE anclajes SET estado = 'LIBRE' WHERE id = ?").run(anclajeId);
    }
  });
  inactivarBicicleta();
}

export function contarFlota() {
  const fila = db
    .prepare(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN estado = 'DISPONIBLE' THEN 1 ELSE 0 END) AS disponibles,
         SUM(CASE WHEN estado = 'EN_USO' THEN 1 ELSE 0 END) AS enUso,
         SUM(CASE WHEN estado = 'MANTENIMIENTO' THEN 1 ELSE 0 END) AS mantenimiento,
         SUM(CASE WHEN estado = 'INACTIVA' THEN 1 ELSE 0 END) AS inactivas
       FROM bicicletas`
    )
    .get();

  return {
    total: fila?.total ?? 0,
    disponibles: fila?.disponibles ?? 0,
    enUso: fila?.enUso ?? 0,
    mantenimiento: fila?.mantenimiento ?? 0,
    inactivas: fila?.inactivas ?? 0,
  };
}