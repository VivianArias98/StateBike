import { aplicarEsquema } from "./init.js";
import { db } from "../config/db.js";
import { tunja } from "../clients/tunja.client.js";

const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NOMBRE } = process.env;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_NOMBRE) {
  console.error("Faltan ADMIN_EMAIL, ADMIN_PASSWORD o ADMIN_NOMBRE en el .env");
  process.exit(1);
}

aplicarEsquema();

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