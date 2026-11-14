import fs from "node:fs";
import { db } from "../config/db.js";

// Columnas añadidas después de crear una tabla: [tabla, columna, definición]
const COLUMNAS_NUEVAS = [
  ["perfiles", "correo", "TEXT"],
  ["perfiles", "nombre", "TEXT"],
];

function agregarColumnasFaltantes() {
  for (const [tabla, columna, definicion] of COLUMNAS_NUEVAS) {
    const existentes = db.prepare(`PRAGMA table_info(${tabla})`).all();
    if (!existentes.some((c) => c.name === columna)) {
      db.exec(`ALTER TABLE ${tabla} ADD COLUMN ${columna} ${definicion}`);
    }
  }
}
''
// Aplica el esquema; es seguro repetirlo (IF NOT EXISTS + columnas faltantes)
export function aplicarEsquema() {
  const sql = fs.readFileSync(new URL("./schema.sql", import.meta.url), "utf8");
  db.exec(sql);
  agregarColumnasFaltantes();
}