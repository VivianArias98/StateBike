import fs from "node:fs";
import { db } from "../config/db.js";

//Aplica el esquema; es seguro repetirlo (IF NOT EXISTS)
export function aplicarEsquema() {
  const sql = fs.readFileSync(new URL("./schema.sql", import.meta.url), "utf8");
  db.exec(sql);
}