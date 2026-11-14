import { AppError } from "../utils/AppError.js";
import { MENSAJES } from "../utils/mensajes.js";
import { normalizarUid } from "../utils/uid.js";
import { tunja } from "../clients/tunja.client.js";
import * as viajesRepo from "../repositories/viajes.repository.js";
import * as tarjetasRepo from "../repositories/tarjetas.repository.js";
import * as suscripcionesRepo from "../repositories/suscripciones.repository.js";
import * as anclajesRepo from "../repositories/anclajes.repository.js";
import * as estacionesRepo from "../repositories/estaciones.repository.js";

const TOPE_EXCESO_VIAJE = 5000; // HU_4 y HU_15: tope por viaje

// SQLite guarda UTC como "YYYY-MM-DD HH:MM:SS"
const aMs = (fecha) => new Date(fecha.includes("Z") ? fecha : fecha.replace(" ", "T") + "Z").getTime();

// Condiciones del plan: el activo, o el último si se canceló o venció durante el viaje
function condicionesDelPlan(usuarioId) {
  const plan = suscripcionesRepo.obtenerActiva(usuarioId) || suscripcionesRepo.obtenerUltima(usuarioId);
  return {
    minutosIncluidos: plan?.tiempo_viaje_min ?? 30,
    valorMinutoExceso: plan?.valor_minuto_exceso ?? 100,
  };
}

/** Desbloquear bicicleta e iniciar viaje (HU_3). Lo llama la API NFC. */
export function iniciarViaje({ estacionId, anclaje, uid }) {
  if (!uid) throw new AppError(400, "no_se_pudo_leer_tarjeta");

  const tarjeta = tarjetasRepo.buscarPorUid(normalizarUid(uid));
  if (!tarjeta || tarjeta.estado !== "ACTIVA") {
    throw new AppError(400, "tarjeta_no_vinculada_o_bloqueada");
  }
  const usuarioId = tarjeta.usuario_id;

  // Plan activo y vigente: si ya venció se avisa distinto (criterio 7)
  const plan = suscripcionesRepo.obtenerActiva(usuarioId);
  if (!plan) {
    const ultimo = suscripcionesRepo.obtenerUltima(usuarioId);
    throw new AppError(400, ultimo?.estado === "VENCIDO" ? "plan_vencido" : "sin_plan_activo");
  }
  if (viajesRepo.contarViajesHoy(usuarioId) >= plan.viajes_por_dia) {
    throw new AppError(400, "limite_viajes_alcanzado");
  }
  if (viajesRepo.tieneCobroPendiente(usuarioId)) {
    throw new AppError(400, "cobro_pendiente_bloquea");
  }
  if (viajesRepo.tieneViajeEnCurso(usuarioId)) {
    throw new AppError(400, "ya_tiene_viaje_en_curso");
  }

  // El anclaje debe ser de la estación del tótem y tener una bicicleta DISPONIBLE
  const ancla = anclajesRepo.buscarPorEstacionYNumero(Number(estacionId), Number(anclaje));
  if (!ancla || ancla.estado !== "OCUPADO" || ancla.bicicletaEstado !== "DISPONIBLE") {
    throw new AppError(400, "bicicleta_no_disponible");
  }
  const estacion = estacionesRepo.buscarPorId(ancla.estacionId);
  if (!estacion || estacion.estado !== "ACTIVE") throw new AppError(400, "estacion_inactiva");

  const viaje = viajesRepo.iniciarViaje({
    usuarioId,
    bicicletaId: ancla.bicicletaId,
    estacionOrigenId: estacion.id,
    anclajeOrigenId: ancla.id,
  });

  return { mensaje: MENSAJES.viaje_iniciado, minutosIncluidos: plan.tiempo_viaje_min, viaje };
}

/** Devolver bicicleta y finalizar viaje (HU_4). Lo llama la API NFC. */
export async function finalizarViaje({ estacionId, anclaje, uid, bloqueoDetectado = true }) {
  if (!uid) throw new AppError(400, "no_se_pudo_leer_tarjeta");

  const estId = Number(estacionId);
  const estacion = estacionesRepo.buscarPorId(estId);
  if (!estacion) throw new AppError(404, "estacion_no_encontrada");

  // 1. Anclaje donde se encaja la bicicleta
  let anclajeDestino = null;
  if (anclaje != null) {
    anclajeDestino = anclajesRepo.buscarPorEstacionYNumero(estId, Number(anclaje));
    if (!anclajeDestino) throw new AppError(404, "anclaje_no_encontrado");
    if (anclajeDestino.estado !== "LIBRE") throw new AppError(409, "anclaje_no_libre");
  } else if (anclajesRepo.contarLibres(estId) === 0) {
    throw new AppError(400, "devolucion_sin_anclajes"); // criterio 2
  }

  // 2. Sin anclaje o sin sensor de bloqueo, la bicicleta no está encajada (criterio 3)
  if (!anclajeDestino || bloqueoDetectado === false) {
    throw new AppError(400, "bloqueo_no_detectado");
  }

  // 3. La tarjeta debe ser la del viaje en curso (criterio 4)
  const tarjeta = tarjetasRepo.buscarPorUid(normalizarUid(uid));
  if (!tarjeta) throw new AppError(400, "tarjeta_no_vinculada_o_bloqueada");
  const viaje = viajesRepo.obtenerViajeEnCursoPorUsuario(tarjeta.usuario_id);
  if (!viaje) throw new AppError(400, "tarjeta_no_corresponde");

  // 4. La estación debe estar ACTIVE
  if (estacion.estado !== "ACTIVE") throw new AppError(400, "estacion_inactiva");

  // 5. Duración y exceso (se cuenta el minuto iniciado)
  const duracionMin = Math.max(1, Math.ceil((Date.now() - aMs(viaje.fechaInicio)) / 60000));
  const { minutosIncluidos, valorMinutoExceso } = condicionesDelPlan(tarjeta.usuario_id);
  const minutosExceso = Math.max(0, duracionMin - minutosIncluidos);
  const valorCobrado = Math.min(minutosExceso * valorMinutoExceso, TOPE_EXCESO_VIAJE);

  // 6. Se cierra el viaje con el cobro PENDIENTE antes de cobrar: así nunca se cobra dos veces
  viajesRepo.finalizarViaje({
    viajeId: viaje.id,
    bicicletaId: viaje.bicicletaId,
    estacionDestinoId: estId,
    anclajeDestinoId: anclajeDestino.id,
    duracionMin,
    minutosExceso,
    valorCobrado,
    estadoCobro: valorCobrado > 0 ? "PENDIENTE" : "SIN_COBRO",
  });

  // 7. Se intenta descontar del saldo; si no alcanza o falla, queda PENDIENTE (HU_25)
  if (valorCobrado > 0) {
    try {
      await tunja(`/users/${tarjeta.usuario_id}/wallet/charge`, {
        metodo: "POST",
        cuerpo: { monto: valorCobrado, concepto: `Exceso de tiempo viaje #${viaje.id}` },
      });
      viajesRepo.pagarCobroPendiente(viaje.id);
    } catch (err) {
      console.error("Cobro por exceso no realizado:", err.codigo ?? err.message);
    }
  }

  const final = viajesRepo.buscarPorId(viaje.id);
  return {
    mensaje: MENSAJES.viaje_finalizado,
    ...(final.estadoCobro === "PENDIENTE" && { aviso: MENSAJES.cobro_exceso_pendiente }),
    resumen: resumenDe(final),
  };
}

// Datos del resumen de HU_4: origen, destino, duración, minutos de exceso y valor cobrado
function resumenDe(v) {
  return {
    id: v.id,
    bicicleta: v.bicicletaCodigo,
    origen: v.estacionOrigenNombre,
    destino: v.estacionDestinoNombre,
    duracionMin: v.duracionMin,
    minutosExceso: v.minutosExceso,
    valorCobrado: v.valorCobrado,
    estadoCobro: v.estadoCobro,
    fechaInicio: new Date(aMs(v.fechaInicio)).toISOString(),
    fechaFin: v.fechaFin ? new Date(aMs(v.fechaFin)).toISOString() : null,
  };
}

/** Viaje en curso del usuario en sesión (el front lo consulta cada pocos segundos). */
export function consultarViajeEnCurso(usuarioId) {
  const viaje = viajesRepo.obtenerViajeEnCursoPorUsuario(usuarioId);
  if (!viaje) return { enCurso: false, viaje: null };

  const inicio = aMs(viaje.fechaInicio);
  const segundos = Math.max(0, Math.floor((Date.now() - inicio) / 1000));
  const minutosTranscurridos = Math.floor(segundos / 60);
  const { minutosIncluidos, valorMinutoExceso } = condicionesDelPlan(usuarioId);

  return {
    enCurso: true,
    viaje: {
      id: viaje.id,
      bicicleta: viaje.bicicletaCodigo,
      estacionOrigenId: viaje.estacionOrigenId,
      estacionOrigen: viaje.estacionOrigenNombre,
      origenLat: viaje.estacionOrigenLat,
      origenLng: viaje.estacionOrigenLng,
      fechaInicio: new Date(inicio).toISOString(),
      segundosTranscurridos: segundos, // calculado en el servidor: no depende del reloj del celular
      minutosTranscurridos,
      minutosIncluidos,
      minutosExceso: Math.max(0, minutosTranscurridos - minutosIncluidos),
      valorMinutoExceso,
      topeExceso: TOPE_EXCESO_VIAJE,
    },
  };
}

/** Último viaje finalizado (resumen que se muestra al devolver la bicicleta). */
export function consultarUltimoViaje(usuarioId) {
  const viaje = viajesRepo.obtenerUltimoFinalizado(usuarioId);
  if (!viaje) return { viaje: null };
  return {
    mensaje: MENSAJES.viaje_finalizado,
    ...(viaje.estadoCobro === "PENDIENTE" && { aviso: MENSAJES.cobro_exceso_pendiente }),
    viaje: resumenDe(viaje),
  };
}