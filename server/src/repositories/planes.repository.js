import { db } from "../config/db.js";

//Nombres de campo en camelCase para el front
const SELECCION = `
  SELECT id, nombre, costo_base AS costoBase, vigencia_dias AS vigenciaDias,
         viajes_por_dia AS viajesPorDia, tiempo_viaje_min AS tiempoViajeMin,
         valor_minuto_exceso AS valorMinutoExceso, estado
  FROM planes`;

//Del más barato al más caro, para poder compararlos
export function listar({ soloActivos = false } = {}) {
  const donde = soloActivos ? "WHERE estado = 'ACTIVO'" : "";
  return db.prepare(`${SELECCION} ${donde} ORDER BY costo_base, id`).all();
}

export function buscarPorId(id) {
  return db.prepare(`${SELECCION} WHERE id = ?`).get(id);
}

export function existeNombre(nombre, exceptoId = 0) {
  return Boolean(
    db.prepare("SELECT 1 FROM planes WHERE nombre = ? AND id <> ?").get(nombre, exceptoId)
  );
}

export function crear(plan) {
  const { lastInsertRowid } = db
    .prepare(
      `INSERT INTO planes
         (nombre, costo_base, vigencia_dias, viajes_por_dia, tiempo_viaje_min, valor_minuto_exceso)
       VALUES (@nombre, @costoBase, @vigenciaDias, @viajesPorDia, @tiempoViajeMin, @valorMinutoExceso)`
    )
    .run(plan);
  return Number(lastInsertRowid);
}

export function actualizar(id, plan) {
  db.prepare(
    `UPDATE planes SET nombre = @nombre, costo_base = @costoBase, vigencia_dias = @vigenciaDias,
       viajes_por_dia = @viajesPorDia, tiempo_viaje_min = @tiempoViajeMin,
       valor_minuto_exceso = @valorMinutoExceso
     WHERE id = @id`
  ).run({ ...plan, id });
}

export function cambiarEstado(id, estado) {
  db.prepare("UPDATE planes SET estado = ? WHERE id = ?").run(estado, id);
}