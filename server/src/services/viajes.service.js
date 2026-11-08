import { AppError } from "../utils/AppError.js";
import { MENSAJES } from "../utils/mensajes.js";
import { normalizarUid } from "../utils/uid.js";
import { tunja } from "../clients/tunja.client.js";
import * as viajesRepo from "../repositories/viajes.repository.js";
import * as tarjetasRepo from "../repositories/tarjetas.repository.js";
import * as suscripcionesRepo from "../repositories/suscripciones.repository.js";
import * as anclajesRepo from "../repositories/anclajes.repository.js";
import * as estacionesRepo from "../repositories/estaciones.repository.js";

const TOPE_EXCESO_VIAJE = 5000; // HU_4 y HU_15: Tope máximo de $5.000 por cobro de exceso en un viaje

/**
 * Desbloquear bicicleta e iniciar viaje (HU_3).
 * Llamado desde la terminal NFC física o simulador.
 */
export function iniciarViaje({ anclajeId, uid }) {
  if (!uid) {
    throw new AppError(400, "no_se_pudo_leer_tarjeta");
  }

  const uidLimpio = normalizarUid(uid);
  const tarjeta = tarjetasRepo.buscarPorUid(uidLimpio);
  if (!tarjeta || tarjeta.estado !== "ACTIVA") {
    throw new AppError(400, "tarjeta_no_vinculada_o_bloqueada");
  }

  const usuarioId = tarjeta.usuario_id;

  // 1. Debe tener un plan ACTIVO vigente (HU_3)
  const planActivo = suscripcionesRepo.obtenerActiva(usuarioId);
  if (!planActivo) {
    throw new AppError(400, "sin_plan_activo");
  }

  // 2. No debe haber alcanzado el límite diario de viajes de su plan (HU_3)
  const viajesHoy = viajesRepo.contarViajesHoy(usuarioId);
  if (viajesHoy >= planActivo.viajes_por_dia) {
    throw new AppError(400, "limite_viajes_alcanzado");
  }

  // 3. No debe tener cobros pendientes por exceso (HU_3)
  if (viajesRepo.tieneCobroPendiente(usuarioId)) {
    throw new AppError(400, "cobro_pendiente_bloquea");
  }

  // 4. No debe tener ya otro viaje en curso (HU_3)
  if (viajesRepo.tieneViajeEnCurso(usuarioId)) {
    throw new AppError(400, "ya_tiene_viaje_en_curso");
  }

  // 5. Validar anclaje y bicicleta disponible
  const anclaje = anclajesRepo.buscarPorId(Number(anclajeId));
  if (!anclaje || anclaje.estado !== "OCUPADO" || !anclaje.bicicletaId) {
    throw new AppError(400, "bicicleta_no_disponible");
  }
  if (anclaje.bicicletaEstado !== "DISPONIBLE") {
    throw new AppError(400, "bicicleta_no_disponible");
  }

  // 6. Validar estación activa
  const estacion = estacionesRepo.buscarPorId(anclaje.estacionId);
  if (!estacion || estacion.estado !== "ACTIVE") {
    throw new AppError(400, "estacion_inactiva");
  }

  // 7. Iniciar viaje atómicamente
  const viaje = viajesRepo.iniciarViaje({
    usuarioId,
    bicicletaId: anclaje.bicicletaId,
    estacionOrigenId: estacion.id,
    anclajeOrigenId: anclaje.id,
  });

  const mensaje = `VIAJE INICIADO. ¡BUEN RECORRIDO! Tiene ${planActivo.tiempo_viaje_min} minutos incluidos en su plan`;

  return {
    mensaje,
    viaje,
    minutosIncluidos: planActivo.tiempo_viaje_min,
  };
}

/**
 * Devolver bicicleta y finalizar viaje (HU_4).
 * Valida sensor de bloqueo, calcula duración y exceso, aplica cobro y finaliza.
 */
export async function finalizarViaje({ anclajeId, estacionId, uid, bloqueoDetectado = true }) {
  // 1. Validar sensor de bloqueo físico
  if (bloqueoDetectado === false) {
    throw new AppError(400, "bloqueo_no_detectado");
  }

  if (!uid) {
    throw new AppError(400, "no_se_pudo_leer_tarjeta");
  }

  const uidLimpio = normalizarUid(uid);
  const tarjeta = tarjetasRepo.buscarPorUid(uidLimpio);
  if (!tarjeta) {
    throw new AppError(400, "tarjeta_no_vinculada_o_bloqueada");
  }

  const usuarioId = tarjeta.usuario_id;

  // 2. Verificar viaje en curso del usuario
  const viajeEnCurso = viajesRepo.obtenerViajeEnCursoPorUsuario(usuarioId);
  if (!viajeEnCurso) {
    throw new AppError(400, "sin_viaje_en_curso");
  }

  // 3. Validar anclaje libre en estación de destino activa
  let anclajeDestinoId = null;
  let estacionDestinoId = null;

  if (anclajeId) {
    const anclaje = anclajesRepo.buscarPorId(Number(anclajeId));
    if (!anclaje || anclaje.estado !== "LIBRE") {
      throw new AppError(400, "estacion_sin_anclajes_libres");
    }
    anclajeDestinoId = anclaje.id;
    estacionDestinoId = anclaje.estacionId;
  } else if (estacionId) {
    const libre = anclajesRepo.buscarPrimerLibre(Number(estacionId));
    if (!libre) {
      throw new AppError(400, "estacion_sin_anclajes_libres");
    }
    anclajeDestinoId = libre.id;
    estacionDestinoId = Number(estacionId);
  } else {
    throw new AppError(400, "estacion_sin_anclajes_libres");
  }

  const estacion = estacionesRepo.buscarPorId(estacionDestinoId);
  if (!estacion || estacion.estado !== "ACTIVE") {
    throw new AppError(400, "estacion_inactiva");
  }

  // 4. Calcular duración (redondeo hacia arriba al minuto iniciado, HU_4)
  const fechaInicio = new Date(
    viajeEnCurso.fechaInicio.includes("Z")
      ? viajeEnCurso.fechaInicio
      : viajeEnCurso.fechaInicio.replace(" ", "T") + "Z"
  );
  const duracionMin = Math.max(1, Math.ceil((Date.now() - fechaInicio.getTime()) / (1000 * 60)));

  // 5. Determinar condiciones del plan contratado
  const plan =
    suscripcionesRepo.obtenerActiva(usuarioId) || suscripcionesRepo.obtenerUltima(usuarioId);
  const minutosIncluidos = plan?.tiempo_viaje_min ?? 30;
  const tarifaExceso = plan?.valor_minuto_exceso ?? 100;

  // 6. Calcular minutos de exceso y valor cobrado (con tope de $5.000)
  const minutosExceso = Math.max(0, duracionMin - minutosIncluidos);
  let valorCobrado = 0;
  let estadoCobro = "SIN_COBRO";

  if (minutosExceso > 0) {
    valorCobrado = Math.min(minutosExceso * tarifaExceso, TOPE_EXCESO_VIAJE);

    // Intentar cobrar en TunjaAPI
    let cobradoEnApi = false;
    try {
      await tunja(`/users/${usuarioId}/wallet/charge`, {
        metodo: "POST",
        cuerpo: {
          monto: valorCobrado,
          concepto: `Cobro exceso viaje #${viajeEnCurso.id} (${minutosExceso} min)`,
        },
      });
      cobradoEnApi = true;
    } catch {
      // Si falta saldo o no responde la API externa, el cobro queda PENDIENTE
      cobradoEnApi = false;
    }

    estadoCobro = cobradoEnApi ? "PAGADO" : "PENDIENTE";
  }

  // 7. Finalizar viaje en SQLite
  const viajeFinalizado = viajesRepo.finalizarViaje({
    viajeId: viajeEnCurso.id,
    bicicletaId: viajeEnCurso.bicicletaId,
    estacionDestinoId,
    anclajeDestinoId,
    duracionMin,
    minutosExceso,
    valorCobrado,
    estadoCobro,
  });

  let mensaje = "VIAJE FINALIZADO CON ÉXITO";
  if (minutosExceso > 0) {
    mensaje += `. Tiempo excedido: ${minutosExceso} min. Cobro: $${valorCobrado.toLocaleString("es-CO")}`;
    if (estadoCobro === "PENDIENTE") {
      mensaje += ". El cobro por exceso quedó pendiente. Recargue su saldo para volver a usar el servicio";
    }
  }

  return {
    mensaje,
    viaje: viajeFinalizado,
    duracionMin,
    minutosExceso,
    valorCobrado,
    estadoCobro,
  };
}

/**
 * Consulta el viaje activo del usuario en sesión (para el frontend).
 */
export function consultarViajeEnCurso(usuarioId) {
  const viaje = viajesRepo.obtenerViajeEnCursoPorUsuario(usuarioId);
  if (!viaje) {
    return { enCurso: false, viaje: null };
  }

  const fechaInicio = new Date(
    viaje.fechaInicio.includes("Z") ? viaje.fechaInicio : viaje.fechaInicio.replace(" ", "T") + "Z"
  );
  const duracionMin = Math.max(1, Math.ceil((Date.now() - fechaInicio.getTime()) / (1000 * 60)));
  const plan = suscripcionesRepo.obtenerActiva(usuarioId);
  const minutosIncluidos = plan?.tiempo_viaje_min ?? 30;

  return {
    enCurso: true,
    viaje: {
      ...viaje,
      duracionMin,
      minutosIncluidos,
      minutosExceso: Math.max(0, duracionMin - minutosIncluidos),
    },
  };
}

