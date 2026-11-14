import { createHash, timingSafeEqual } from "node:crypto";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

//Se comparan las huellas (mismo largo) con una comparación de tiempo constante
const huella = (texto) => createHash("sha256").update(texto).digest();

//Solo deja pasar a la API NFC: las rutas /api/interno no usan sesión de usuario
export function requerirClaveInterna(req, res, next) {
  const recibida = req.get("X-Clave-Interna") ?? "";
  if (!timingSafeEqual(huella(recibida), huella(env.claveInterna))) {
    throw new AppError(401, "clave_interna_invalida");
  }
  next();
}