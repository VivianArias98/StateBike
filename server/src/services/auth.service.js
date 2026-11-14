import { tunja } from "../clients/tunja.client.js";
import { AppError } from "../utils/AppError.js";
import { MENSAJES } from "../utils/mensajes.js";
import * as perfiles from "../repositories/perfiles.repository.js";

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/;
const LARGO_MAX_CORREO = 100;   // Cuenta.correo VARCHAR(100)
const LARGO_MIN_CONTRASENA = 8; // mismo mínimo que exige TunjaAPI
const EDAD_MINIMA = 18;

// Vacío o solo espacios en blanco
const vacio = (valor) => typeof valor !== "string" || valor.trim() === "";

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

// HU_7: el orden de las validaciones sigue el flujo normal
export async function registrar(datos = {}) {
  const { nombreCompleto, fechaNacimiento, correo, telefono, contrasena, confirmacion, aceptaTerminos } = datos;

  if ([nombreCompleto, fechaNacimiento, correo, telefono, contrasena, confirmacion].some(vacio)) {
    throw new AppError(400, "campos_vacios");
  }

  const email = correo.trim();
  if (email.length > LARGO_MAX_CORREO || !FORMATO_CORREO.test(email)) {
    throw new AppError(400, "correo_invalido");
  }
  const telLimpio = String(telefono).trim();
  if (!/^\+?\d{7,15}$/.test(telLimpio)) {
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
      cuerpo: { email, contrasena, nombre: nombreCompleto.trim(), perfil: "general" },
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
    telefono: telLimpio,
  });

  // La HU manda a iniciar sesión: no se devuelven tokens
  return {
    mensaje: MENSAJES.cuenta_creada,
    usuario: armarUsuario(respuesta.usuario, perfiles.buscar(usuarioId)),
  };
}

// HU_8
export async function iniciarSesion(datos = {}) {
  const { correo, contrasena } = datos;
  if (vacio(correo) || vacio(contrasena)) throw new AppError(400, "campos_vacios");

  // TunjaAPI responde credenciales_invalidas (sin decir cuál falló) y usuario_inactivo
  const sesion = await tunja("/auth/login", {
    metodo: "POST",
    cuerpo: { email: correo.trim(), contrasena },
  });

  const perfil = perfiles.obtenerOCrear(sesion.usuario.id);
  perfiles.actualizarContacto(sesion.usuario.id, sesion.usuario.email, sesion.usuario.nombre);
  perfiles.registrarAcceso(sesion.usuario.id);
  return respuestaSesion(sesion, perfil);
  
}

export async function refrescar(refresco) {
  if (vacio(refresco)) throw new AppError(401, "refresco_invalido");
  const sesion = await tunja("/auth/refresh", { metodo: "POST", cuerpo: { refresco } });
  return respuestaSesion(sesion, perfiles.obtenerOCrear(sesion.usuario.id));
}

export async function cerrarSesion(refresco) {
  if (vacio(refresco)) return;
  await tunja("/auth/logout", { metodo: "POST", cuerpo: { refresco } });
}