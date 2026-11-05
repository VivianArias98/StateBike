import { db } from "../config/db.js";

const rellenar = (numero, largo) => String(numero).padStart(largo, "0");

//Escapa los comodines de LIKE para que el texto buscado sea literal
const escaparLike = (texto) => texto.replace(/[\\%_]/g, "\\$&");

//La estación con sus conteos, con los nombres de campo que usa el front.
//Hasta tener bicicletas (HU_14), "bicicletas" = anclajes OCUPADO.
const SELECCION = `
  SELECT e.id, e.nombre, e.direccion, e.estado, e.lat, e.lng,
         e.capacidad_maxima AS anclajes,
         COALESCE(SUM(a.estado = 'OCUPADO'), 0) AS bicicletas,
         COALESCE(SUM(a.estado = 'LIBRE'), 0) AS anclajesLibres
  FROM estaciones e
  LEFT JOIN anclajes a ON a.estacion_id = e.id`;

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