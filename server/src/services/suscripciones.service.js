import { AppError } from "../utils/AppError.js";
import { MENSAJES } from "../utils/mensajes.js";
import * as suscripcionesRepo from "../repositories/suscripciones.repository.js";
import * as planesRepo from "../repositories/planes.repository.js";
import * as tarjetasRepo from "../repositories/tarjetas.repository.js";
import * as viajesRepo from "../repositories/viajes.repository.js";
import { tunja } from "../clients/tunja.client.js";

/**
 * Consulta el plan actual del usuario (HU_17).
 * Retorna detalles del plan activo, fechas de vigencia, días usados/restantes,
 * estado vencido si aplica, cobro pendiente y el catálogo con tuPlanActual marcado.
 */
export function consultarMiPlan(usuarioId) {
  const activa = suscripcionesRepo.obtenerActiva(usuarioId);
  const catalogo = planesRepo.listar({ soloActivos: true });
  const tarjeta = tarjetasRepo.buscarPorUsuario(usuarioId);
  const tieneDeuda = viajesRepo.tieneCobroPendiente(usuarioId);

  const infoTarjeta = tarjeta
    ? {
        estado: tarjeta.estado,
        ultimosDigitos: tarjeta.uid.slice(-4),
      }
    : null;

  if (!activa) {
    const ultima = suscripcionesRepo.obtenerUltima(usuarioId);
    const planVencido = ultima?.estado === "VENCIDO";

    return {
      tienePlan: false,
      mensaje: planVencido ? MENSAJES.plan_vencido : MENSAJES.sin_plan_activo,
      planVencido,
      ultimoPlan: ultima
        ? {
            id: ultima.plan_id,
            nombre: ultima.nombre_plan,
            fechaInicio: ultima.fecha_inicio,
            fechaFin: ultima.fecha_fin,
            estado: ultima.estado,
          }
        : null,
      tarjeta: infoTarjeta,
      tieneCobroPendiente: tieneDeuda,
      catalogo: catalogo.map((p) => ({
        ...p,
        tuPlanActual: false,
      })),
    };
  }

  // Cálculo preciso de días y consumo
  const ahora = new Date();
  const fechaFinStr = activa.fecha_fin.includes("Z") ? activa.fecha_fin : activa.fecha_fin.replace(" ", "T") + "Z";
  const fin = new Date(fechaFinStr);

  const msRestantes = fin.getTime() - ahora.getTime();
  const diasRestantes = Math.max(0, Math.ceil(msRestantes / (1000 * 60 * 60 * 24)));
  const diasUsados = Math.max(0, Math.min(activa.vigencia_dias, activa.vigencia_dias - diasRestantes));
  const porcentajeConsumo = Math.min(
    100,
    Math.max(0, Math.round(((activa.vigencia_dias - diasRestantes) / activa.vigencia_dias) * 100))
  );

  const viajesHoy = viajesRepo.contarViajesHoy(usuarioId);
  const viajesRestantesHoy = Math.max(0, activa.viajes_por_dia - viajesHoy);

  return {
    tienePlan: true,
    plan: {
      id: activa.plan_id,
      suscripcionId: activa.id,
      nombre: activa.nombre_plan,
      costoBase: activa.costo_base,
      vigenciaDias: activa.vigencia_dias,
      viajesPorDia: activa.viajes_por_dia,
      tiempoViajeMin: activa.tiempo_viaje_min,
      valorMinutoExceso: activa.valor_minuto_exceso,
      fechaInicio: activa.fecha_inicio,
      fechaFin: activa.fecha_fin,
      diasUsados,
      diasRestantes,
      porcentajeConsumo,
      estado: activa.estado,
      viajesHoy,
      viajesRestantesHoy,
      tieneCobroPendiente: tieneDeuda,
      tarjeta: infoTarjeta,
    },
    catalogo: catalogo.map((p) => ({
      ...p,
      tuPlanActual: p.id === activa.plan_id,
    })),
  };
}

/**
 * Cancela el plan activo del usuario (HU_2).
 * Precondiciones: debe tener un plan activo y NO tener un viaje en curso.
 * Política de no reembolso: no devuelve saldo a la billetera.
 * Si existe un cobro pendiente, sobrevive a la cancelación.
 */
export function cancelarPlan(usuarioId) {
  const activa = suscripcionesRepo.obtenerActiva(usuarioId);
  if (!activa) {
    throw new AppError(400, "sin_plan_activo");
  }

  if (viajesRepo.tieneViajeEnCurso(usuarioId)) {
    throw new AppError(400, "cancelar_con_viaje");
  }

  const cancelada = suscripcionesRepo.cancelar(activa.id);

  return {
    mensaje: MENSAJES.plan_cancelado,
    suscripcion: {
      id: cancelada.id,
      planId: cancelada.plan_id,
      nombre: cancelada.nombre_plan,
      estado: cancelada.estado,
      fechaCancelacion: cancelada.fecha_cancelacion,
    },
  };
}

/**
 * Adquiere un nuevo plan de suscripción (HU_2).
 * Precondiciones: tarjeta NFC activa vinculada y sin plan vigente.
 * Descuenta el saldo de la billetera en TunjaAPI y activa inmediatamente.
 */
export async function adquirirPlan(usuarioId, planId, token) {
  const tarjeta = tarjetasRepo.buscarPorUsuario(usuarioId);
  if (!tarjeta || tarjeta.estado !== "ACTIVA") {
    throw new AppError(400, "sin_tarjeta_activa");
  }

  if (suscripcionesRepo.tienePlanActivo(usuarioId)) {
    throw new AppError(409, "ya_tiene_plan");
  }

  const plan = planesRepo.buscarPorId(Number(planId));
  if (!plan || plan.estado !== "ACTIVO") {
    throw new AppError(404, "plan_no_encontrado");
  }

  // Cobro en TunjaAPI si token está disponible
  if (token) {
    try {
      const billetera = await tunja("/wallet", { token });
      if (billetera && typeof billetera.saldo === "number") {
        if (billetera.saldo < plan.costoBase) {
          const faltante = plan.costoBase - billetera.saldo;
          throw new AppError(400, "saldo_insuficiente", {
            faltante,
            mensaje: `Saldo insuficiente para adquirir el plan. Le faltan $${faltante.toLocaleString("es-CO")}. Recargue su saldo en MI BILLETERA`,
          });
        }
        await tunja("/wallet/charge", {
          metodo: "POST",
          cuerpo: {
            monto: plan.costoBase,
            concepto: `Adquisición de ${plan.nombre}`,
          },
          token,
        });
      }
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(502, "tunja_no_responde");
    }
  }

  const ahora = new Date();
  const fin = new Date(ahora.getTime() + plan.vigenciaDias * 24 * 60 * 60 * 1000);
  const fechaFin = fin.toISOString().replace("T", " ").slice(0, 19);

  const suscripcion = suscripcionesRepo.crear({
    usuarioId,
    planId: plan.id,
    nombrePlan: plan.nombre,
    costoBase: plan.costoBase,
    vigenciaDias: plan.vigenciaDias,
    viajesPorDia: plan.viajesPorDia,
    tiempoViajeMin: plan.tiempoViajeMin,
    valorMinutoExceso: plan.valorMinutoExceso,
    fechaFin,
  });

  return {
    mensaje: MENSAJES.plan_adquirido,
    suscripcion: {
      id: suscripcion.id,
      planId: suscripcion.plan_id,
      nombre: suscripcion.nombre_plan,
      vigenciaDias: suscripcion.vigencia_dias,
      fechaInicio: suscripcion.fecha_inicio,
      fechaFin: suscripcion.fecha_fin,
      estado: suscripcion.estado,
    },
  };
}

