import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { env } from "./env.js";

// Crea la carpeta de la base si no existe
fs.mkdirSync(path.dirname(env.dbArchivo), { recursive: true });

export const db = new Database(env.dbArchivo);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");