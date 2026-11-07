import { tunja } from "../clients/tunja.client.js";
import { AppError } from "../utils/AppError.js";
import { MENSAJES } from "../utils/mensajes.js";
import { normalizarUid, esUidValido } from "../utils/uid.js";
import * as perfiles from "../repositories/perfiles.repository.js";
import * as tarjetas from "../repositories/tarjetas.repository.js";
import * as viajes from "../repositories/viajes.repository.js";

const DIGITOS_VISIBLES = 2; // últimos caracteres del UID que se muestran (HU_1, HU_17)
const SIN_VINCULAR = "SIN VINCULAR"; // tercer estado de la HU_18: no hay fila en tarjetas

// El UID completo no sale del servidor: es una credencial débil
function armarTarjeta(fila) {
  if (!fila) return null;
  return {
    estado: fila.estado,
    ultimosDigitos: fila.uid.slice(-DIGITOS_VISIBLES),
    fechaVinculacion: fila.fecha_vinculacion,
    fechaCambioEstado: fila.fecha_cambio_estado,
  };
}

function obtenerTarjeta(usuarioId) {
  const tarjeta = tarjetas.buscarPorUsuario(usuarioId);
  if (!tarjeta) throw new AppError(404, "sin_tarjeta");
  return tarjeta;
}

// Usuarios guardados antes de existir la copia local: se leen de TunjaAPI una sola vez
async function completarContacto() {
  for (const usuarioId of perfiles.idsSinContacto()) {
    try {
      const usuario = await tunja(`/users/${usuarioId}`);
      perfiles.actualizarContacto(usuarioId, usuario.email, usuario.nombre);
    } catch {
      // Si TunjaAPI no responde, se reintenta en la próxima consulta
    }
  }
}

// HU_18: lista de usuarios con el estado de su tarjeta y buscador por correo
export async function listarUsuarios(busqueda = "") {
  await completarContacto();
  const filas = tarjetas.listarUsuarios({ busqueda: String(busqueda).trim() });

  return {
    usuarios: filas.map((fila) => ({
      usuarioId: fila.usuarioId,
      nombreCompleto: fila.nombre,
      correo: fila.correo,
      estadoTarjeta: fila.estado ?? SIN_VINCULAR,
      ultimosDigitos: fila.uid ? fila.uid.slice(-DIGITOS_VISIBLES) : null,
    })),
  };
}

// HU_18: vincular (el administrador acerca la tarjeta al lector o digita el UID)
export async function vincular(datos = {}) {
  const usuarioId = Number(datos.usuarioId);
  const uid = normalizarUid(datos.uid);

  const perfil = Number.isInteger(usuarioId) ? perfiles.buscar(usuarioId) : undefined;
  if (!perfil || perfil.rol !== "USUARIO") throw new AppError(404, "usuario_no_encontrado");
  if (!esUidValido(uid)) throw new AppError(400, "uid_invalido");

  if (tarjetas.buscarPorUsuario(usuarioId)) throw new AppError(409, "usuario_con_tarjeta");
  if (tarjetas.buscarPorUid(uid)) throw new AppError(409, "tarjeta_en_uso");

  try {
    await tunja("/cards", { metodo: "POST", cuerpo: { uid, usuario_id: usuarioId } });
  } catch (error) {
    if (error.codigo === "uid_en_uso") throw new AppError(409, "tarjeta_en_uso");
    // El usuario se registró desde el proyecto de otro grupo: TunjaAPI no deja tocarlo
    if (error.codigo === "no_es_tuyo") throw new AppError(409, "usuario_de_otro_proyecto");
    throw error;
  }

  tarjetas.crear(usuarioId, uid);
  return {
    mensaje: MENSAJES.tarjeta_vinculada,
    tarjeta: armarTarjeta(tarjetas.buscarPorUsuario(usuarioId)),
  };
}

// HU_18: desvincular. El plan activo no se toca (criterio 6)
export async function desvincular(usuarioId) {
  const tarjeta = obtenerTarjeta(usuarioId);
  if (viajes.tieneViajeEnCurso(usuarioId)) throw new AppError(409, "desvincular_con_viaje");

  try {
    await tunja(`/cards/${tarjeta.uid}`, { metodo: "DELETE" });
  } catch (error) {
    // Si ya no estaba en TunjaAPI, solo falta limpiar el registro local
    if (error.codigo !== "no_encontrado") throw error;
  }

  tarjetas.eliminar(usuarioId);
  return { mensaje: MENSAJES.tarjeta_desvinculada };
}

// HU_1: lo que ve el usuario en MI PERFIL
export function consultarMia(usuarioId) {
  const tarjeta = armarTarjeta(tarjetas.buscarPorUsuario(usuarioId));
  return { estadoTarjeta: tarjeta?.estado ?? SIN_VINCULAR, tarjeta };
}

// HU_1: la confirmación la pide el front; aquí se valida y se cambia el estado
async function cambiarEstado(usuarioId, estadoNuevo) {
  const tarjeta = obtenerTarjeta(usuarioId);
  const bloquear = estadoNuevo === "BLOQUEADA";

  if (tarjeta.estado === estadoNuevo) {
    throw new AppError(409, bloquear ? "tarjeta_ya_bloqueada" : "tarjeta_ya_activa");
  }
  if (bloquear && viajes.tieneViajeEnCurso(usuarioId)) throw new AppError(409, "bloquear_con_viaje");

  await tunja(`/cards/${tarjeta.uid}`, { metodo: "PATCH", cuerpo: { activa: !bloquear } });
  tarjetas.cambiarEstado(usuarioId, estadoNuevo);

  return {
    mensaje: bloquear ? MENSAJES.tarjeta_bloqueada : MENSAJES.tarjeta_desbloqueada,
    tarjeta: armarTarjeta(tarjetas.buscarPorUsuario(usuarioId)),
  };
}

export const bloquear = (usuarioId) => cambiarEstado(usuarioId, "BLOQUEADA");
export const desbloquear = (usuarioId) => cambiarEstado(usuarioId, "ACTIVA");