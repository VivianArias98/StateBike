import { tunja } from "../clients/tunja.client.js";
import { AppError } from "../utils/AppError.js";
import { armarUsuario, verificarTokenTarjeta } from "../services/auth.service.js";
import * as perfiles from "../repositories/perfiles.repository.js";

//Caché corta: evita una llamada a TunjaAPI por cada petición (límite 120/min)
const cache = new Map();
const VIGENCIA_MS = 30_000;

export async function autenticar(req, res, next) {
  const acceso = req.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!acceso) throw new AppError(401, "token_requerido");
  req.token = acceso;

  const guardado = cache.get(acceso);
  if (guardado && guardado.vence > Date.now()) {
    req.usuario = guardado.usuario;
    return next();
  }

  let usuarioTunja = null;
  const usuarioIdTarjeta = verificarTokenTarjeta(acceso);

  if (usuarioIdTarjeta) {
    // Token emitido para tarjeta NFC o sesión en modo contingencia
    try {
      usuarioTunja = await tunja(`/users/${usuarioIdTarjeta}`);
    } catch {
      // Modo contingencia: TunjaAPI no responde
      const p = perfiles.buscar(usuarioIdTarjeta) || perfiles.obtenerOCrear(usuarioIdTarjeta);
      usuarioTunja = {
        id: usuarioIdTarjeta,
        nombre: p.nombre || "Usuario StationBike",
        email: p.correo || "usuario@stationbike.com",
        activo: true,
        saldo: 50000,
      };
    }
  } else {
    // Token estándar de TunjaAPI
    try {
      usuarioTunja = await tunja("/auth/me", { token: acceso });
    } catch (err) {
      if (err.codigo === "tunja_no_responde" && guardado) {
        req.usuario = guardado.usuario;
        return next();
      }
      throw err;
    }
  }

  if (!usuarioTunja || !usuarioTunja.activo) throw new AppError(403, "usuario_inactivo");

  const perfil = perfiles.obtenerOCrear(usuarioTunja.id);
  const adminEmail = (process.env.ADMIN_EMAIL || "admin.stationbike@ejemplo.com").trim().toLowerCase();
  if (adminEmail && usuarioTunja.email?.trim().toLowerCase() === adminEmail && perfil.rol !== "ADMINISTRADOR") {
    perfiles.asignarRol(usuarioTunja.id, "ADMINISTRADOR");
    perfil.rol = "ADMINISTRADOR";
  }

  req.usuario = armarUsuario(usuarioTunja, perfil);

  if (cache.size > 500) cache.clear();
  cache.set(acceso, { usuario: req.usuario, vence: Date.now() + VIGENCIA_MS });
  next();
}

//Uso: router.get("/algo", autenticar, requerirRol("ADMINISTRADOR"), controlador)
export const requerirRol = (rol) => (req, res, next) => {
  if (req.usuario.rol !== rol) throw new AppError(403, "sin_permisos");
  next();
};