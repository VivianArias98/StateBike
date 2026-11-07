import { db } from "../config/db.js";
import { escaparLike } from "../utils/sql.js";

const rellenar = (numero, largo) => String(numero).padStart(largo, "0");

//eLa estación con sus conteos, con los nombres de campo que usa el front:
//bicicletas = disponibles para retiro; anclajesOcupados incluye las que están en mantenimiento
const SELECCION = `
  SELECT e.id, e.nombre, e.direccion, e.estado, e.lat, e.lng,
         e.capacidad_maxima AS anclajes,
         COALESCE(SUM(a.estado = 'OCUPADO'), 0) AS anclajesOcupados,
         COALESCE(SUM(a.estado = 'LIBRE'), 0) AS anclajesLibres,
         COALESCE(SUM(b.estado = 'DISPONIBLE'), 0) AS bicicletas
  FROM estaciones e
  LEFT JOIN anclajes a ON a.estacion_id = e.id
  LEFT JOIN bicicletas b ON b.anclaje_id = a.id`;

export function listar({ soloActivas = false, busqueda = "" } = {}) {
  const condiciones = [];
  const parametros = [];

  if (soloActivas) condiciones.push("e.estado = 'ACTIVE'");
  if (busqueda) {
    condiciones.push("e.nombre LIKE ? ESCAPE '\\'");
    parametros.push(`%${escaparLike(busqueda)}%`);
  }

  const donde = condiciones.length ? `WHERE ${condiciones.join(" AND ")}` : "";
  return db.prepare(`${SELECCION} ${donde} GROUP BY e.id ORDER BY e.id`).all(...parametros);
}

export function buscarPorId(id) {
  return db.prepare(`${SELECCION} WHERE e.id = ? GROUP BY e.id`).get(id);
}

export function existeNombre(nombre, exceptoId = 0) {
  return Boolean(
    db.prepare("SELECT 1 FROM estaciones WHERE nombre = ? AND id <> ?").get(nombre, exceptoId)
  );
}

//Crea la estación y sus anclajes LIBRE en una sola transacción
export function crear({ nombre, direccion, capacidad, lat, lng }) {
  const registrar = db.transaction(() => {
    const { lastInsertRowid } = db
      .prepare(
        "INSERT INTO estaciones (nombre, direccion, capacidad_maxima, lat, lng) VALUES (?, ?, ?, ?, ?)"
      )
      .run(nombre, direccion, capacidad, lat, lng);

    const id = Number(lastInsertRowid);
    const insertarAnclaje = db.prepare(
      "INSERT INTO anclajes (estacion_id, numero, codigo) VALUES (?, ?, ?)"
    );
    for (let numero = 1; numero <= capacidad; numero += 1) {
      insertarAnclaje.run(id, numero, `ANC-${rellenar(id, 3)}-${rellenar(numero, 2)}`);
    }
    return id;
  });
  return registrar();
}

export function actualizar(id, { nombre, direccion, lat, lng }) {
  db.prepare("UPDATE estaciones SET nombre = ?, direccion = ?, lat = ?, lng = ? WHERE id = ?").run(
    nombre,
    direccion,
    lat,
    lng,
    id
  );
}

export function cambiarEstado(id, estado) {
  db.prepare("UPDATE estaciones SET estado = ? WHERE id = ?").run(estado, id);
}