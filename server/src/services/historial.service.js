import { AppError } from "../utils/AppError.js";
import { MENSAJES } from "../utils/mensajes.js";
import * as viajesRepo from "../repositories/viajes.repository.js";
import { tunja } from "../clients/tunja.client.js";
import { db } from "../config/db.js";

function validarRangoFechas(desde, hasta) {
  if (desde && hasta) {
    if (new Date(hasta) < new Date(desde)) {
      throw new AppError(400, "fecha_invalida_rango");
    }
  }
}

/**
 * Consulta el historial de viajes del usuario (HU_5).
 * Permite filtrar por rango de fechas (desde, hasta).
 * Valida que la fecha final no sea anterior a la inicial.
 * Retorna los viajes ordenados del más reciente al más antiguo.
 */
export function consultarViajes(usuarioId, { desde, hasta } = {}) {
  validarRangoFechas(desde, hasta);

  const viajes = viajesRepo.listarPorUsuario(usuarioId, { desde, hasta });

  if (viajes.length === 0 && (desde || hasta)) {
    return { viajes: [], mensaje: MENSAJES.sin_registros_rango };
  }

  return { viajes };
}

/**
 * Consulta el historial de pagos del usuario (HU_5).
 * Combina movimientos de la billetera en TunjaAPI, compras de planes locales
 * y cobros por exceso (pagados o pendientes).
 * Permite filtrar por rango de fechas (desde, hasta).
 */
export async function consultarPagos(usuarioId, token, { desde, hasta } = {}) {
  validarRangoFechas(desde, hasta);

  let movimientosTunja = [];
  if (token) {
    try {
      const resp = await tunja("/wallet/movements", { token });
      movimientosTunja = Array.isArray(resp) ? resp : (resp?.movimientos ?? []);
    } catch (err) {
      if (err instanceof AppError && err.estado === 401) throw err;
      movimientosTunja = [];
    }
  }

  // Mapear movimientos de TunjaAPI
  const pagos = movimientosTunja.map((m) => ({
    id: m.id || `mov-${Math.random()}`,
    fecha: m.fecha || m.created_at || m.creado || new Date().toISOString(),
    tipo: m.tipo || (m.monto >= 0 ? "RECARGA" : "COBRO"),
    concepto: m.concepto || (m.tipo === "TOPUP" ? "Recarga de saldo en billetera" : "Cobro del servicio"),
    monto: Math.abs(m.monto || 0),
    estado: "PAGADO",
  }));

  // Incluir suscripciones registradas en SQLite si no están en TunjaAPI
  const suscripciones = db
    .prepare("SELECT * FROM suscripciones WHERE usuario_id = ? ORDER BY id DESC")
    .all(usuarioId);

  for (const sub of suscripciones) {
    const yaRegistrado = pagos.some((p) => p.concepto?.includes(sub.nombre_plan));
    if (!yaRegistrado) {
      pagos.push({
        id: `sub-${sub.id}`,
        fecha: sub.fecha_inicio,
        tipo: "COMPRA_PLAN",
        concepto: `Adquisición de ${sub.nombre_plan}`,
        monto: sub.costo_base,
        estado: "PAGADO",
      });
    }
  }

  // Cobros por exceso de viajes (pagados y pendientes)
  const viajesConCobro = db
    .prepare(
      `SELECT id, fecha_fin, minutos_exceso, valor_cobrado, estado_cobro
       FROM viajes
       WHERE usuario_id = ? AND estado_cobro IN ('PAGADO', 'PENDIENTE')`
    )
    .all(usuarioId);

  for (const vc of viajesConCobro) {
    pagos.push({
      id: `cobro-viaje-${vc.id}`,
      fecha: vc.fecha_fin,
      tipo: "COBRO_EXCESO",
      concepto: `Exceso de tiempo viaje #${vc.id} (${vc.minutos_exceso} min)`,
      monto: vc.valor_cobrado,
      estado: vc.estado_cobro, // 'PAGADO' o 'PENDIENTE'
    });
  }

  // Filtrado por fecha
  let filtrados = pagos;
  if (desde || hasta) {
    filtrados = pagos.filter((p) => {
      if (!p.fecha) return true;
      const f = p.fecha.slice(0, 10);
      if (desde && f < desde) return false;
      if (hasta && f > hasta) return false;
      return true;
    });
  }

  // Ordenar del más reciente al más antiguo
  filtrados.sort((a, b) => new Date(b.fecha || 0).getTime() - new Date(a.fecha || 0).getTime());

  if (filtrados.length === 0 && (desde || hasta)) {
    return { pagos: [], mensaje: MENSAJES.sin_registros_rango };
  }

  return { pagos: filtrados };
}

