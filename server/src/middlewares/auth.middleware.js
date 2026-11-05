import { tunja } from "../clients/tunja.client.js";
import { AppError } from "../utils/AppError.js";
import { armarUsuario } from "../services/auth.service.js";
import * as perfiles from "../repositories/perfiles.repository.js";

//Caché corta: evita una llamada a TunjaAPI por cada petición (límite 120/min)
const cache = new Map();
const VIGENCIA_MS = 30_000;

export async function autenticar(req, res, next) {
  const acceso = req.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!acceso) throw new AppError(401, "token_requerido");

  const guardado = cache.get(acceso);
  if (guardado && guardado.vence > Date.now()) {
    req.usuario = guardado.usuario;
    return next();
  }

  // Si el token expiró, TunjaAPI responde token_expirado (401) y el front refresca
  const usuarioTunja = await tunja("/auth/me", { token: acceso });
  if (!usuarioTunja.activo) throw new AppError(403, "usuario_inactivo");

  req.usuario = armarUsuario(usuarioTunja, perfiles.obtenerOCrear(usuarioTunja.id));

  if (cache.size > 500) cache.clear();
  cache.set(acceso, { usuario: req.usuario, vence: Date.now() + VIGENCIA_MS });
  next();
}

//Uso: router.get("/algo", autenticar, requerirRol("ADMINISTRADOR"), controlador)
export const requerirRol = (rol) => (req, res, next) => {
  if (req.usuario.rol !== rol) throw new AppError(403, "sin_permisos");
  next();
};