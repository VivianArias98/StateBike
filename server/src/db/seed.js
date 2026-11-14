import { aplicarEsquema } from "./init.js";
import { db } from "../config/db.js";
import { tunja } from "../clients/tunja.client.js";

const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NOMBRE } = process.env;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_NOMBRE) {
  console.error("Faltan ADMIN_EMAIL, ADMIN_PASSWORD o ADMIN_NOMBRE en el .env");
  process.exit(1);
}

aplicarEsquema();

//Catálogo inicial (HU_15, criterio 7). INSERT OR IGNORE: no pisa planes ya editados
const VALOR_MINUTO_EXCESO = 100;
const PLANES_INICIALES = [
  { nombre: "Plan Diario", costo: 4000, vigencia: 1, viajes: 2, minutos: 30 },
  { nombre: "Plan Mensual", costo: 32000, vigencia: 30, viajes: 4, minutos: 45 },
  { nombre: "Plan Semestral", costo: 150000, vigencia: 180, viajes: 4, minutos: 45 },
  { nombre: "Plan Anual", costo: 240000, vigencia: 365, viajes: 4, minutos: 60 },
];

const insertarPlan = db.prepare(
  `INSERT OR IGNORE INTO planes
     (nombre, costo_base, vigencia_dias, viajes_por_dia, tiempo_viaje_min, valor_minuto_exceso)
   VALUES (?, ?, ?, ?, ?, ?)`
);
for (const plan of PLANES_INICIALES) {
  insertarPlan.run(plan.nombre, plan.costo, plan.vigencia, plan.viajes, plan.minutos, VALOR_MINUTO_EXCESO);
}
console.log("Catálogo inicial de planes listo.");

let usuarioId;

try {
  //Primera vez: se crea en TunjaAPI
  const { usuario } = await tunja("/auth/register", {
    metodo: "POST",
    cuerpo: {
      email: ADMIN_EMAIL,
      contrasena: ADMIN_PASSWORD,
      nombre: ADMIN_NOMBRE,
      perfil: "general",
    },
  });
  usuarioId = usuario.id;
  console.log(`Administrador creado en TunjaAPI (id ${usuarioId})`);
} catch (error) {
  if (error.codigo !== "email_en_uso") throw error;

  //Ya existía: se inicia sesión solo para obtener su id
  const { usuario } = await tunja("/auth/login", {
    metodo: "POST",
    cuerpo: { email: ADMIN_EMAIL, contrasena: ADMIN_PASSWORD },
  });
  usuarioId = usuario.id;
  console.log(`El administrador ya existía en TunjaAPI (id ${usuarioId})`);
}

//Rol local: esto es lo que TunjaAPI no guarda
db.prepare(
  `INSERT INTO perfiles (usuario_id, rol) VALUES (?, 'ADMINISTRADOR')
   ON CONFLICT(usuario_id) DO UPDATE SET rol = 'ADMINISTRADOR'`
).run(usuarioId);

console.log("Rol ADMINISTRADOR asignado.");