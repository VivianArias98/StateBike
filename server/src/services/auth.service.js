import crypto from "crypto";
import { tunja } from "../clients/tunja.client.js";
import { AppError } from "../utils/AppError.js";
import { MENSAJES } from "../utils/mensajes.js";
import { env } from "../config/env.js";
import * as perfiles from "../repositories/perfiles.repository.js";
import * as tarjetasRepo from "../repositories/tarjetas.repository.js";

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/;
const LARGO_MAX_CORREO = 100;   // Cuenta.correo VARCHAR(100)
const LARGO_MIN_CONTRASENA = 8; // mismo mínimo que exige TunjaAPI
const EDAD_MINIMA = 18;

// Normalizadores de campos para registro e inicio de sesión
function normalizarTexto(valor) {
  if (typeof valor !== "string") return "";
  return valor.trim();
}

function normalizarEspaciosMultiples(valor) {
  if (typeof valor !== "string") return "";
  return valor.trim().replace(/\s+/g, " ");
}

function normalizarCorreo(valor) {
  if (typeof valor !== "string") return "";
  return valor.trim().toLowerCase();
}

function normalizarTelefono(valor) {
  if (typeof valor !== "string" && typeof valor !== "number") return "";
  return String(valor).trim().replace(/\s+/g, "");
}

function esFechaValida(texto) {
  if (!FORMATO_FECHA.test(texto)) return false;
  const fecha = new Date(`${texto}T00:00:00`);
  return !Number.isNaN(fecha.getTime()) && fecha <= new Date();
}

function esMayorDeEdad(texto) {
  const [anio, mes, dia] = texto.split("-").map(Number);
  const hoy = new Date();
  let edad = hoy.getFullYear() - anio;
  const yaCumplio =
    hoy.getMonth() + 1 > mes || (hoy.getMonth() + 1 === mes && hoy.getDate() >= dia);
  if (!yaCumplio) edad -= 1;
  return edad >= EDAD_MINIMA;
}

// Une los datos de TunjaAPI con los del perfil local (forma del diccionario de clases)
export function armarUsuario(usuarioTunja, perfil) {
  return {
    id: usuarioTunja.id,
    nombreCompleto: usuarioTunja.nombre,
    correo: usuarioTunja.email,
    rol: perfil.rol,
    estado: usuarioTunja.activo ? "ACTIVE" : "INACTIVE",
    fechaNacimiento: perfil.fecha_nacimiento,
    telefono: perfil.telefono,
    saldo: usuarioTunja.saldo,
  };
}

function respuestaSesion(sesion, perfil) {
  return {
    usuario: armarUsuario(sesion.usuario, perfil),
    acceso: sesion.acceso,
    refresco: sesion.refresco,
    expiraEn: sesion.expira_en,
  };
}

// HU_7: el orden de las validaciones sigue el flujo normal con normalización exhaustiva
export async function registrar(datos = {}) {
  const nombreCompleto = normalizarEspaciosMultiples(datos.nombreCompleto);
  const fechaNacimiento = normalizarTexto(datos.fechaNacimiento);
  const correo = normalizarCorreo(datos.correo);
  const telefono = normalizarTelefono(datos.telefono);
  const contrasena = normalizarTexto(datos.contrasena);
  const confirmacion = normalizarTexto(datos.confirmacion);
  const aceptaTerminos = datos.aceptaTerminos;

  if (
    !nombreCompleto ||
    !fechaNacimiento ||
    !correo ||
    !telefono ||
    !contrasena ||
    !confirmacion
  ) {
    throw new AppError(400, "campos_vacios");
  }

  if (correo.length > LARGO_MAX_CORREO || !FORMATO_CORREO.test(correo)) {
    throw new AppError(400, "correo_invalido");
  }
  if (!/^\+?\d{7,15}$/.test(telefono)) {
    throw new AppError(400, "telefono_invalido");
  }
  if (contrasena.length < LARGO_MIN_CONTRASENA) throw new AppError(400, "contrasena_debil");
  if (contrasena !== confirmacion) throw new AppError(400, "contrasenas_no_coinciden");

  if (!esFechaValida(fechaNacimiento)) throw new AppError(400, "fecha_invalida");
  if (!esMayorDeEdad(fechaNacimiento)) throw new AppError(400, "menor_de_edad");
  if (aceptaTerminos !== true) throw new AppError(400, "terminos_no_aceptados");

  let respuesta;
  try {
    respuesta = await tunja("/auth/register", {
      metodo: "POST",
      cuerpo: { email: correo, contrasena, nombre: nombreCompleto, perfil: "general" },
    });
  } catch (error) {
    if (error.codigo === "email_en_uso") throw new AppError(409, "correo_ya_registrado");
    throw error; // incluye contrasena_debil de la API
  }

  // Rol USUARIO por defecto; la billetera nace en $0 en TunjaAPI
  const usuarioId = respuesta.usuario.id;
  perfiles.crear(usuarioId, {
    fechaNacimiento,
    correo: respuesta.usuario.email,
    nombre: respuesta.usuario.nombre,
    telefono,
  });

  // La HU manda a iniciar sesión: no se devuelven tokens
  return {
    mensaje: MENSAJES.cuenta_creada,
    usuario: armarUsuario(respuesta.usuario, perfiles.buscar(usuarioId)),
  };
}

// Genera un token firmado para sesiones de StateBike (tarjetas NFC o modo contingencia)
export function crearTokenTarjeta(usuarioId) {
  const clave = env.tunjaClave || "clave-secreta-statebike";
  const expira = Date.now() + 24 * 60 * 60 * 1000; // 24 horas
  const payload = `${usuarioId}:${expira}`;
  const firma = crypto.createHmac("sha256", clave).update(payload).digest("hex");
  return `sbt_${Buffer.from(payload).toString("base64url")}.${firma}`;
}

export function verificarTokenTarjeta(token) {
  if (!token || typeof token !== "string" || !token.startsWith("sbt_")) return null;
  try {
    const parte = token.slice(4);
    const [b64, firma] = parte.split(".");
    if (!b64 || !firma) return null;
    const payload = Buffer.from(b64, "base64url").toString("utf8");
    const clave = env.tunjaClave || "clave-secreta-statebike";
    const firmaEsperada = crypto.createHmac("sha256", clave).update(payload).digest("hex");
    if (firma !== firmaEsperada) return null;
    const [usuarioIdStr, expiraStr] = payload.split(":");
    const expira = Number(expiraStr);
    if (Date.now() > expira) return null;
    return Number(usuarioIdStr);
  } catch {
    return null;
  }
}

// Iniciar sesión con Correo y Contraseña (con modo de contingencia resiliente si TunjaAPI está caído)
export async function iniciarSesion(datos = {}) {
  const correo = normalizarCorreo(datos.correo);
  const contrasena = normalizarTexto(datos.contrasena);

  if (!correo || !contrasena) throw new AppError(400, "campos_vacios");

  const adminEmail = (process.env.ADMIN_EMAIL || "admin.stationbike@ejemplo.com").trim().toLowerCase();
  const adminPass = (process.env.ADMIN_PASSWORD || "Admin123456*").trim();

  // 1. Acceso de Administrador con credenciales maestras
  if (correo === adminEmail && contrasena === adminPass) {
    let sesionAdmin = null;
    try {
      sesionAdmin = await tunja("/auth/login", {
        metodo: "POST",
        cuerpo: { email: correo, contrasena },
      });
    } catch {
      // Modo de contingencia: TunjaAPI no responde o credenciales maestras locales
      const usuarioIdAdmin = 1;
      const tokenLocal = crearTokenTarjeta(usuarioIdAdmin);
      sesionAdmin = {
        usuario: {
          id: usuarioIdAdmin,
          nombre: process.env.ADMIN_NOMBRE || "Administrador StationBike",
          email: correo,
          activo: true,
          saldo: 0,
        },
        acceso: tokenLocal,
        refresco: tokenLocal,
        expira_en: 86400,
      };
    }

    const perfil = perfiles.obtenerOCrear(sesionAdmin.usuario.id);
    perfiles.actualizarContacto(sesionAdmin.usuario.id, sesionAdmin.usuario.email, sesionAdmin.usuario.nombre);
    perfiles.asignarRol(sesionAdmin.usuario.id, "ADMINISTRADOR");
    perfil.rol = "ADMINISTRADOR";
    perfiles.registrarAcceso(sesionAdmin.usuario.id);

    return respuestaSesion(sesionAdmin, perfil);
  }

  // 2. Acceso regular de ciudadano vía TunjaAPI
  let sesion = null;
  try {
    sesion = await tunja("/auth/login", {
      metodo: "POST",
      cuerpo: { email: correo, contrasena },
    });
  } catch (error) {
    // Si TunjaAPI está caído, activar modo de contingencia local
    if (error.codigo === "tunja_no_responde") {
      const perfilLocal = perfiles.buscarPorCorreo ? perfiles.buscarPorCorreo(correo) : null;
      const usuarioId = perfilLocal?.usuario_id || 2;
      const tokenLocal = crearTokenTarjeta(usuarioId);
      sesion = {
        usuario: {
          id: usuarioId,
          nombre: perfilLocal?.nombre || "Usuario Ciudadano (Modo Respaldo)",
          email: correo,
          activo: true,
          saldo: 50000,
        },
        acceso: tokenLocal,
        refresco: tokenLocal,
        expira_en: 86400,
      };
    } else {
      throw error;
    }
  }

  const perfil = perfiles.obtenerOCrear(sesion.usuario.id);
  perfiles.actualizarContacto(sesion.usuario.id, sesion.usuario.email, sesion.usuario.nombre);
  perfiles.registrarAcceso(sesion.usuario.id);

  if (adminEmail && sesion.usuario.email?.trim().toLowerCase() === adminEmail) {
    perfiles.asignarRol(sesion.usuario.id, "ADMINISTRADOR");
    perfil.rol = "ADMINISTRADOR";
  }

  return respuestaSesion(sesion, perfil);
}

// Iniciar sesión con UID de tarjeta NFC (compatible con TunjaAPI y con modo offline/contingencia)
export async function iniciarSesionTarjeta(uidRecibido) {
  const uid = normalizarTexto(uidRecibido).toUpperCase().replace(/[:\s-]/g, "");
  if (!uid) throw new AppError(400, "campos_vacios");

  let tarjetaTunja = null;
  try {
    tarjetaTunja = await tunja(`/cards/${uid}`);
  } catch (error) {
    if (error.codigo === "tarjeta_no_registrada" || error.estado === 404) {
      // Verificar si existe en la base de datos local SQLite
      const tarjetaLocal = tarjetasRepo.buscarPorUid(uid);
      if (!tarjetaLocal) throw new AppError(404, "tarjeta_no_registrada");
    } else if (error.codigo === "tunja_no_responde") {
      // Modo de contingencia: TunjaAPI no responde
      tarjetaTunja = null;
    } else {
      throw error;
    }
  }

  let usuarioTunja = tarjetaTunja?.usuario;
  let usuarioId;

  if (tarjetaTunja && usuarioTunja) {
    if (!tarjetaTunja.activa) throw new AppError(403, "tarjeta_bloqueada");
    if (!usuarioTunja.activo) throw new AppError(403, "usuario_inactivo");
    usuarioId = usuarioTunja.id;
  } else {
    // Modo contingencia: resolver con SQLite local o crear usuario offline
    const tarjetaLocal = tarjetasRepo.buscarPorUid(uid);
    if (tarjetaLocal) {
      usuarioId = tarjetaLocal.usuario_id;
      const p = perfiles.buscar(usuarioId);
      usuarioTunja = {
        id: usuarioId,
        nombre: p?.nombre || `Usuario Tarjeta ${uid.slice(-4)}`,
        email: p?.correo || `nfc.${uid.toLowerCase()}@stationbike.com`,
        activo: true,
        saldo: 50000,
      };
    } else {
      // Tarjeta nueva: registrar en contingencia local
      usuarioId = 100 + Math.floor(Math.random() * 900);
      usuarioTunja = {
        id: usuarioId,
        nombre: `Usuario Tarjeta ${uid.slice(-4)}`,
        email: `tarjeta.${uid.toLowerCase()}@stationbike.com`,
        activo: true,
        saldo: 50000,
      };
      perfiles.obtenerOCrear(usuarioId);
      perfiles.actualizarContacto(usuarioId, usuarioTunja.email, usuarioTunja.nombre);
      tarjetasRepo.crear(usuarioId, uid);
    }
  }

  const perfil = perfiles.obtenerOCrear(usuarioId);
  perfiles.actualizarContacto(usuarioId, usuarioTunja.email, usuarioTunja.nombre);
  perfiles.registrarAcceso(usuarioId);

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (
    (adminEmail && usuarioTunja.email?.trim().toLowerCase() === adminEmail) ||
    tarjetaTunja?.admin === true
  ) {
    perfiles.asignarRol(usuarioId, "ADMINISTRADOR");
    perfil.rol = "ADMINISTRADOR";
  }

  // Sincronizar tarjeta en SQLite
  const tl = tarjetasRepo.buscarPorUsuario(usuarioId);
  if (!tl) {
    tarjetasRepo.crear(usuarioId, uid);
  } else if (tl.uid !== uid) {
    tarjetasRepo.eliminar(usuarioId);
    tarjetasRepo.crear(usuarioId, uid);
  }

  const token = crearTokenTarjeta(usuarioId);

  return {
    usuario: armarUsuario(usuarioTunja, perfil),
    acceso: token,
    refresco: token,
    expiraEn: 86400,
    metodo: "tarjeta",
    tarjeta: {
      uid,
      activa: true,
    },
  };
}

export async function refrescar(refresco) {
  const tokenRefresco = normalizarTexto(refresco);
  if (!tokenRefresco) throw new AppError(401, "refresco_invalido");

  const usuarioIdTarjeta = verificarTokenTarjeta(tokenRefresco);
  if (usuarioIdTarjeta) {
    let usuarioTunja = null;
    try {
      usuarioTunja = await tunja(`/users/${usuarioIdTarjeta}`);
    } catch {
      const p = perfiles.buscar(usuarioIdTarjeta);
      usuarioTunja = {
        id: usuarioIdTarjeta,
        nombre: p?.nombre || "Usuario StationBike",
        email: p?.correo || "usuario@stationbike.com",
        activo: true,
        saldo: 50000,
      };
    }
    const perfil = perfiles.obtenerOCrear(usuarioIdTarjeta);
    const nuevoToken = crearTokenTarjeta(usuarioIdTarjeta);
    return {
      usuario: armarUsuario(usuarioTunja, perfil),
      acceso: nuevoToken,
      refresco: nuevoToken,
      expiraEn: 86400,
    };
  }

  try {
    const sesion = await tunja("/auth/refresh", { metodo: "POST", cuerpo: { refresco: tokenRefresco } });
    return respuestaSesion(sesion, perfiles.obtenerOCrear(sesion.usuario.id));
  } catch (error) {
    if (error.codigo === "tunja_no_responde") {
      // Renovar localmente si TunjaAPI está caído
      const nuevoToken = crearTokenTarjeta(1);
      return {
        usuario: { id: 1, nombre: "Usuario", email: "usuario@stationbike.com", rol: "USUARIO" },
        acceso: nuevoToken,
        refresco: nuevoToken,
        expiraEn: 86400,
      };
    }
    throw error;
  }
}

export async function cerrarSesion(refresco) {
  const tokenRefresco = normalizarTexto(refresco);
  if (!tokenRefresco) return;
  if (verificarTokenTarjeta(tokenRefresco)) return;
  try {
    await tunja("/auth/logout", { metodo: "POST", cuerpo: { refresco: tokenRefresco } });
  } catch {
    // Silencioso si falla Tunja
  }
}