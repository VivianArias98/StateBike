import { db } from "../config/db.js";

//Anclajes de una estación con la bicicleta que tiene cada uno (si tiene)
export function listarPorEstacion(estacionId) {
  return db
    .prepare(
      `SELECT a.numero, a.codigo, a.estado,
              b.codigo AS bicicletaCodigo, b.estado AS bicicletaEstado
       FROM anclajes a
       LEFT JOIN bicicletas b ON b.anclaje_id = a.id
       WHERE a.estacion_id = ?
       ORDER BY a.numero`
    )
    .all(estacionId);
}