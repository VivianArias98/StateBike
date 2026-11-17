import fs from "node:fs";
import { db } from "../config/db.js";

// Columnas añadidas después de crear una tabla: [tabla, columna, definición]
const COLUMNAS_NUEVAS = [
  ["perfiles", "correo", "TEXT"],
  ["perfiles", "nombre", "TEXT"],
];

const VALOR_MINUTO_EXCESO = 100;
const PLANES_INICIALES = [
  { nombre: "Plan Diario", costo: 4000, vigencia: 1, viajes: 2, minutos: 30 },
  { nombre: "Plan Mensual", costo: 32000, vigencia: 30, viajes: 4, minutos: 45 },
  { nombre: "Plan Semestral", costo: 150000, vigencia: 180, viajes: 4, minutos: 45 },
  { nombre: "Plan Anual", costo: 240000, vigencia: 365, viajes: 4, minutos: 60 },
];

const ESTACIONES_INICIALES = [
  {
    nombre: "Los Muiscas",
    direccion: "Avenida Norte con Calle 66",
    capacidad: 20,
    lat: 5.569815180732708,
    lng: -73.33962207709948,
  },
  {
    nombre: "Uniboyacá",
    direccion: "Avenida Universitaria",
    capacidad: 30,
    lat: 5.539274788807716,
    lng: -73.3576011657715,
  },
  {
    nombre: "Plaza de Bolívar",
    direccion: "Plaza de Bolívar Centro Histórico",
    capacidad: 10,
    lat: 5.532312212424458,
    lng: -73.36108803749086,
  },
  {
    nombre: "Avenida Maldonado",
    direccion: "Carrera 10",
    capacidad: 20,
    lat: 5.540855239508358,
    lng: -73.35978515623655,
  },
  {
    nombre: "Simón Bolívar",
    direccion: "Calle 17 N° 10 - 47",
    capacidad: 15,
    lat: 5.533956754733228,
    lng: -73.34923267364503,
  },
  {
    nombre: "Sur",
    direccion: "Calle Sur",
    capacidad: 15,
    lat: 5.541581391115115,
    lng: -73.37107658386232,
  },
];

function sembrarDatosIniciales() {
  try {
    const totalPlanes = db.prepare("SELECT COUNT(*) AS total FROM planes").get()?.total ?? 0;
    if (totalPlanes === 0) {
      const insertarPlan = db.prepare(
        `INSERT INTO planes (nombre, costo_base, vigencia_dias, viajes_por_dia, tiempo_viaje_min, valor_minuto_exceso)
         VALUES (?, ?, ?, ?, ?, ?)`
      );
      for (const plan of PLANES_INICIALES) {
        insertarPlan.run(plan.nombre, plan.costo, plan.vigencia, plan.viajes, plan.minutos, VALOR_MINUTO_EXCESO);
      }
    }

    const totalEstaciones = db.prepare("SELECT COUNT(*) AS total FROM estaciones").get()?.total ?? 0;
    if (totalEstaciones === 0) {
      const insertarEstacion = db.prepare(
        `INSERT INTO estaciones (nombre, direccion, capacidad_maxima, lat, lng, estado)
         VALUES (?, ?, ?, ?, ?, 'ACTIVE')`
      );
      const insertarAnclaje = db.prepare(
        "INSERT INTO anclajes (estacion_id, numero, codigo) VALUES (?, ?, ?)"
      );
      const rellenar = (numero, largo) => String(numero).padStart(largo, "0");

      for (const est of ESTACIONES_INICIALES) {
        const info = insertarEstacion.run(est.nombre, est.direccion, est.capacidad, est.lat, est.lng);
        const estId = Number(info.lastInsertRowid);
        for (let n = 1; n <= est.capacidad; n += 1) {
          insertarAnclaje.run(estId, n, `ANC-${rellenar(estId, 3)}-${rellenar(n, 2)}`);
        }
      }
    }
  } catch (err) {
    console.error("Aviso al sembrar datos iniciales:", err.message);
  }
}

function agregarColumnasFaltantes() {
  for (const [tabla, columna, definicion] of COLUMNAS_NUEVAS) {
    const existentes = db.prepare(`PRAGMA table_info(${tabla})`).all();
    if (!existentes.some((c) => c.name === columna)) {
      db.exec(`ALTER TABLE ${tabla} ADD COLUMN ${columna} ${definicion}`);
    }
  }
}

// Aplica el esquema; es seguro repetirlo (IF NOT EXISTS + columnas faltantes + siembra inicial)
export function aplicarEsquema() {
  const sql = fs.readFileSync(new URL("./schema.sql", import.meta.url), "utf8");
  db.exec(sql);
  agregarColumnasFaltantes();
  sembrarDatosIniciales();
}