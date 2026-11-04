import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

//token: acceso del usuario (solo cuando el endpoint lo pide)
export async function tunja(camino, { metodo = "GET", cuerpo, token } = {}) {
  let respuesta;
  try {
    respuesta = await fetch(env.tunjaApi + camino, {
      method: metodo,
      signal: AbortSignal.timeout(8000),
      headers: {
        ...(cuerpo && { "Content-Type": "application/json" }),
        "X-API-Key": env.tunjaClave,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    throw new AppError(502, "tunja_no_responde");
  }

  //Un 204 no trae cuerpo
  const datos = respuesta.status === 204 ? null : await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const codigo = datos?.error ?? "error_desconocido";
    //Si la clave del servidor falla es un problema nuestro, no del usuario
    if (codigo.startsWith("clave_")) throw new AppError(502, "clave_tunja_invalida");
    throw new AppError(respuesta.status, codigo, datos ?? {});
  }

  return datos;
}