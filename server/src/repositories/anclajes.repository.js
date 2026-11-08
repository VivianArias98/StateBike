import { db } from "../config/db.js";

//Anclajes de una estación con la bicicleta que tiene cada uno (si tiene)
export function listarPorEstacion(estacionId) {
  return db
    .prepare(
      `SELECT a.id, a.numero, a.codigo, a.estado,
              b.id AS bicicletaId, b.codigo AS bicicletaCodigo, b.estado AS bicicletaEstado
       FROM anclajes a
       LEFT JOIN bicicletas b ON b.anclaje_id = a.id
       WHERE a.estacion_id = ?
       ORDER BY a.numero`
    )
    .all(estacionId);
}

export function buscarPorId(id) {
  return db
    .prepare(
      `SELECT a.id, a.estacion_id AS estacionId, a.numero, a.codigo, a.estado,
              b.id AS bicicletaId, b.codigo AS bicicletaCodigo, b.estado AS bicicletaEstado
       FROM anclajes a
       LEFT JOIN bicicletas b ON b.anclaje_id = a.id
       WHERE a.id = ?`
    )
    .get(id);
}

export function buscarPrimerLibre(estacionId) {
  return db
    .prepare(
      `SELECT id, numero, codigo FROM anclajes WHERE estacion_id = ? AND estado = 'LIBRE' ORDER BY numero LIMIT 1`
    )
    .get(estacionId);
}

export function contarOcupacionGlobal() {
  const fila = db
    .prepare(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN estado = 'OCUPADO' THEN 1 ELSE 0 END) AS ocupados,
         SUM(CASE WHEN estado = 'LIBRE' THEN 1 ELSE 0 END) AS libres
       FROM anclajes`
    )
    .get();

  return {
    total: fila?.total ?? 0,
    ocupados: fila?.ocupados ?? 0,
    libres: fila?.libres ?? 0,
  };
}