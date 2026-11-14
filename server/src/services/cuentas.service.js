import { AppError } from "../utils/AppError.js";
import { MENSAJES } from "../utils/mensajes.js";
import { tunja } from "../clients/tunja.client.js";
import * as perfilesRepo from "../repositories/perfiles.repository.js";
import * as tarjetasRepo from "../repositories/tarjetas.repository.js";
import * as viajesRepo from "../repositories/viajes.repository.js";

const LARGO_MAX_NOMBRE = 100;
const LARGO_MIN_CONTRASENA = 8;

/**
 * Consulta los datos personales del perfil del usuario (HU_1).
 * Incluye nombre, correo, fecha de nacimiento, teléfono, saldo y tarjeta vinculada.
 */
export async function consultarPerfil(usuarioId, token) {
  const perfil = perfilesRepo.buscar(usuarioId);
  const tarjeta = tarjetasRepo.buscarPorUsuario(usuarioId);

  let usuarioTunja = null;
  if (token) {
    try {
      usuarioTunja = await tunja("/auth/me", { token });
    } catch {
      usuarioTunja = null;
    }
  }

  return {
    id: usuarioId,
    nombreCompleto: usuarioTunja?.nombre || perfil?.nombre || "",
    correo: usuarioTunja?.email || perfil?.correo || "",
    rol: perfil?.rol || "USUARIO",
    estado: usuarioTunja?.activo === false ? "INACTIVE" : "ACTIVE",
    fechaNacimiento: perfil?.fecha_nacimiento || null,
    telefono: perfil?.telefono || null,
    saldo: usuarioTunja?.saldo ?? 0,
    tarjeta: tarjeta
      ? {
          estado: tarjeta.estado,
          ultimosDigitos: tarjeta.uid.slice(-4),
          fechaVinculacion: tarjeta.fecha_vinculacion,
        }
      : null,
  };
}

/**
 * Actualiza el perfil del usuario (HU_1).
 * Permite modificar nombre y teléfono. Documento y fecha de nacimiento son inmutables.
 * Permite cambiar la contraseña validando mínimo 8 caracteres.
 */
export async function editarPerfil(usuarioId, datos = {}, token) {
  const { nombreCompleto, telefono, contrasenaActual, nuevaContrasena } = datos;

  let nuevoNombre = null;
  if (nombreCompleto !== undefined) {
    if (typeof nombreCompleto !== "string" || nombreCompleto.trim() === "") {
      throw new AppError(400, "campos_vacios");
    }
    nuevoNombre = nombreCompleto.trim();
    if (nuevoNombre.length > LARGO_MAX_NOMBRE) {
      throw new AppError(400, "campos_vacios");
    }
  }

  let nuevoTelefono = null;
  if (telefono !== undefined && telefono !== null) {
    const telStr = String(telefono).trim();
    if (telStr !== "") {
      if (!/^\+?\d{7,15}$/.test(telStr)) {
        throw new AppError(400, "telefono_invalido");
      }
      nuevoTelefono = telStr;
    }
  }

  // Cambio opcional de contraseña
  if (nuevaContrasena) {
    if (typeof nuevaContrasena !== "string" || nuevaContrasena.length < LARGO_MIN_CONTRASENA) {
      throw new AppError(400, "contrasena_debil");
    }
    if (token && contrasenaActual) {
      try {
        await tunja("/auth/change-password", {
          metodo: "POST",
          cuerpo: { contrasenaActual, nuevaContrasena },
          token,
        });
      } catch (err) {
        if (err instanceof AppError) throw err;
      }
    }
  }

  // Actualizar copia local en SQLite
  perfilesRepo.actualizarPerfil(usuarioId, {
    nombre: nuevoNombre,
    telefono: nuevoTelefono,
  });

  // Actualizar TunjaAPI si hay token
  if (token && nuevoNombre) {
    try {
      await tunja("/users/me", {
        metodo: "PUT",
        cuerpo: { nombre: nuevoNombre },
        token,
      });
    } catch {
      // Si la API externa no lo soporta en este endpoint, SQLite conserva la actualización
    }
  }

  const actualizado = await consultarPerfil(usuarioId, token);

  return {
    mensaje: MENSAJES.perfil_actualizado,
    usuario: actualizado,
  };
}

/**
 * Listado de cuentas de usuario para el administrador (HU_21).
 * Filtra por correo o nombre si se indica un término de búsqueda.
 */
export function listarCuentas({ busqueda = "" } = {}) {
  const usuarios = perfilesRepo.listarUsuarios({ busqueda });

  return {
    usuarios: usuarios.map((u) => ({
      id: u.usuarioId,
      nombreCompleto: u.nombre,
      correo: u.correo,
      rol: u.rol,
      fechaNacimiento: u.fechaNacimiento,
      telefono: u.telefono,
      ultimoAcceso: u.ultimoAcceso,
      tarjeta: u.uid
        ? {
            estado: u.estadoTarjeta,
            ultimosDigitos: u.uid.slice(-4),
          }
        : null,
    })),
  };
}

/**
 * Inactiva una cuenta de usuario (HU_21).
 * Reglas:
 * 1. No permite inactivar la propia cuenta del administrador logueado.
 * 2. No permite inactivar si el usuario tiene un viaje en curso.
 * 3. Actualiza en TunjaAPI { activo: false }.
 */
export async function inactivarCuenta(adminId, usuarioId) {
  const idObjetivo = Number(usuarioId);
  if (adminId === idObjetivo) {
    throw new AppError(400, "no_inactivar_propia_cuenta");
  }

  const perfil = perfilesRepo.buscar(idObjetivo);
  if (!perfil) {
    throw new AppError(404, "usuario_no_encontrado");
  }

  // Precondición HU_21 Criterio 2: no permite inactivar con viaje en curso
  if (viajesRepo.tieneViajeEnCurso(idObjetivo)) {
    throw new AppError(400, "inactivar_con_viaje");
  }

  try {
    await tunja(`/users/${idObjetivo}`, {
      metodo: "PUT",
      cuerpo: { activo: false },
    });
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(502, "tunja_no_responde");
  }

  return {
    mensaje: MENSAJES.cuenta_inactivada,
    usuarioId: idObjetivo,
    estado: "INACTIVE",
  };
}

/**
 * Reactiva una cuenta de usuario previamente inactivada (HU_21).
 * Actualiza en TunjaAPI { activo: true }.
 */
export async function reactivarCuenta(adminId, usuarioId) {
  const idObjetivo = Number(usuarioId);

  const perfil = perfilesRepo.buscar(idObjetivo);
  if (!perfil) {
    throw new AppError(404, "usuario_no_encontrado");
  }

  try {
    await tunja(`/users/${idObjetivo}`, {
      metodo: "PUT",
      cuerpo: { activo: true },
    });
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(502, "tunja_no_responde");
  }

  return {
    mensaje: MENSAJES.cuenta_reactivada,
    usuarioId: idObjetivo,
    estado: "ACTIVE",
  };
}

const MINIMO_RECARGA = 100;
const MAXIMO_RECARGA = 500_000;
const SALDO_MAXIMO_PERMITIDO = 2_000_000;

/**
 * Consulta la billetera de un usuario para la taquilla del administrador.
 */
export async function consultarBilleteraUsuario(usuarioId) {
  const idObjetivo = Number(usuarioId);
  const perfil = perfilesRepo.buscar(idObjetivo);
  if (!perfil) {
    throw new AppError(404, "usuario_no_encontrado");
  }

  let saldo = 0;
  try {
    const resp = await tunja(`/users/${idObjetivo}/wallet`);
    saldo = resp?.saldo ?? 0;
  } catch {
    saldo = 0;
  }

  return {
    usuarioId: idObjetivo,
    nombreCompleto: perfil.nombre,
    correo: perfil.correo,
    saldo,
  };
}

/**
 * Recarga saldo a un usuario en taquilla por parte del administrador.
 * Conecta de forma segura con TunjaAPI (/users/:id/wallet/topup) usando TUNJA_CLAVE en el servidor.
 */
export async function recargarSaldoUsuario(adminId, usuarioId, monto) {
  const idObjetivo = Number(usuarioId);
  const perfil = perfilesRepo.buscar(idObjetivo);
  if (!perfil) {
    throw new AppError(404, "usuario_no_encontrado");
  }

  const texto = String(monto ?? "").trim();
  if (!/^\d+$/.test(texto)) {
    throw new AppError(400, "monto_invalido");
  }
  const montoNum = Number(texto);
  if (!Number.isSafeInteger(montoNum) || montoNum < MINIMO_RECARGA || montoNum > MAXIMO_RECARGA) {
    throw new AppError(400, "monto_fuera_rango", {
      mensaje: "El monto debe estar entre $100 y $500.000 COP",
    });
  }

  let saldoActual = 0;
  try {
    const billetera = await tunja(`/users/${idObjetivo}/wallet`);
    saldoActual = billetera?.saldo ?? 0;
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(502, "tunja_no_responde");
  }

  if (saldoActual + montoNum > SALDO_MAXIMO_PERMITIDO) {
    throw new AppError(400, "recarga_supera_maximo", {
      mensaje: "La recarga supera el saldo máximo permitido de $2.000.000",
    });
  }

  const resultado = await tunja(`/users/${idObjetivo}/wallet/topup`, {
    metodo: "POST",
    cuerpo: { monto: montoNum },
  });

  return {
    mensaje: "RECARGA EN TAQUILLA EXITOSA",
    usuarioId: idObjetivo,
    nombreCompleto: perfil.nombre,
    correo: perfil.correo,
    saldoAnterior: saldoActual,
    montoRecargado: montoNum,
    nuevoSaldo: resultado?.saldo ?? (saldoActual + montoNum),
  };
}


