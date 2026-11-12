import { AppError } from "../utils/AppError.js";
import { MENSAJES } from "../utils/mensajes.js";
import { tunja } from "../clients/tunja.client.js";
import * as viajesRepo from "../repositories/viajes.repository.js";
import { db } from "../config/db.js";

const MINIMO_RECARGA = 100;
const MAXIMO_RECARGA = 500_000;
const SALDO_MAXIMO_PERMITIDO = 2_000_000;

function validarMontoRecarga(monto) {
  const texto = String(monto ?? "").trim();
  if (!/^\d+$/.test(texto)) {
    throw new AppError(400, "monto_invalido");
  }
  const num = Number(texto);
  if (!Number.isSafeInteger(num) || num < MINIMO_RECARGA || num > MAXIMO_RECARGA) {
    throw new AppError(400, "monto_fuera_rango");
  }
  return num;
}

/**
 * Consulta el estado de la billetera del usuario (HU_23).
 * Trae saldo y movimientos desde TunjaAPI y alerta si hay cobros pendientes por exceso en SQLite.
 */
export async function consultarBilletera(usuarioId, token) {
  let saldo = 0;
  let movimientosTunja = [];

  if (token) {
    try {
      const datosBilletera = await tunja("/wallet", { token });
      saldo = datosBilletera?.saldo ?? 0;
    } catch (err) {
      if (err instanceof AppError && err.estado === 401) throw err;
      saldo = 0;
    }

    try {
      const respMov = await tunja("/wallet/movements", { token });
      movimientosTunja = Array.isArray(respMov) ? respMov : (respMov?.movimientos ?? []);
    } catch (err) {
      if (err instanceof AppError && err.estado === 401) throw err;
      movimientosTunja = [];
    }
  }

  // Verificar si tiene cobro pendiente por exceso en SQLite
  const cobroPendiente = viajesRepo.obtenerCobroPendiente(usuarioId);

  // Mapear movimientos consolidados según el formato de TunjaAPI
  const movimientos = movimientosTunja.map((m) => ({
    id: m.id || `mov-${Math.random()}`,
    fecha: m.fecha || m.created_at || m.creado || new Date().toISOString(),
    tipo: m.tipo || (m.operacion === "recarga" || m.monto >= 0 ? "RECARGA" : "COBRO"),
    concepto:
      m.concepto ||
      (m.tipo === "TOPUP" || m.operacion === "recarga"
        ? "Recarga de saldo"
        : "Cobro de servicio"),
    monto: Math.abs(m.monto || 0),
    saldoResultante: m.saldo ?? m.saldo_posterior ?? null,
    estado: "PAGADO",
  }));

  // Incluir suscripciones registradas en SQLite
  const suscripciones = db
    .prepare("SELECT * FROM suscripciones WHERE usuario_id = ? ORDER BY id DESC")
    .all(usuarioId);

  for (const sub of suscripciones) {
    const yaRegistrado = movimientos.some((m) => m.concepto?.includes(sub.nombre_plan));
    if (!yaRegistrado) {
      movimientos.push({
        id: `sub-${sub.id}`,
        fecha: sub.fecha_inicio,
        tipo: "COMPRA_PLAN",
        concepto: `Adquisición de ${sub.nombre_plan}`,
        monto: sub.costo_base,
        saldoResultante: null,
        estado: "PAGADO",
      });
    }
  }

  // Si hay cobro pendiente, agregarlo al inicio de la lista
  if (cobroPendiente) {
    movimientos.unshift({
      id: `cobro-viaje-${cobroPendiente.id}`,
      fecha: cobroPendiente.fecha_fin || cobroPendiente.fecha_inicio,
      tipo: "COBRO_EXCESO",
      concepto: `Exceso de tiempo viaje #${cobroPendiente.id} (${cobroPendiente.minutos_exceso} min)`,
      monto: cobroPendiente.valor_cobrado,
      saldoResultante: null,
      estado: "PENDIENTE",
    });
  }

  // Ordenar cronológicamente descendente
  movimientos.sort((a, b) => new Date(b.fecha || 0).getTime() - new Date(a.fecha || 0).getTime());

  return {
    saldo,
    tieneCobroPendiente: Boolean(cobroPendiente),
    cobroPendiente: cobroPendiente
      ? {
          id: cobroPendiente.id,
          fecha: cobroPendiente.fecha_fin || cobroPendiente.fecha_inicio,
          origen: cobroPendiente.origen,
          destino: cobroPendiente.destino,
          minutosExceso: cobroPendiente.minutos_exceso,
          monto: cobroPendiente.valor_cobrado,
          mensaje: "Tiene un pago pendiente por exceso de tiempo. Recargue su saldo para continuar",
        }
      : null,
    movimientos,
  };
}

/**
 * Recarga saldo en la billetera de TunjaAPI (HU_24).
 * Valida montos entre $100 y $500.000 y tope máximo de $2.000.000 COP.
 * No salda automáticamente cobros pendientes (debe pagarse explícitamente).
 */
export async function recargar(usuarioId, monto, token) {
  const montoValido = validarMontoRecarga(monto);

  let saldoActual = 0;
  if (token) {
    try {
      const billetera = await tunja("/wallet", { token });
      saldoActual = billetera?.saldo ?? 0;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(502, "tunja_no_responde");
    }

    if (saldoActual + montoValido > SALDO_MAXIMO_PERMITIDO) {
      throw new AppError(400, "recarga_supera_maximo");
    }

    const resultado = await tunja("/wallet/topup", {
      metodo: "POST",
      cuerpo: { monto: montoValido },
      token,
    });

    return {
      mensaje: MENSAJES.recarga_exitosa,
      saldoAnterior: saldoActual,
      montoRecargado: montoValido,
      nuevoSaldo: resultado?.saldo ?? (saldoActual + montoValido),
    };
  }

  // Si no hay token de TunjaAPI (entorno de pruebas aislado)
  if (saldoActual + montoValido > SALDO_MAXIMO_PERMITIDO) {
    throw new AppError(400, "recarga_supera_maximo");
  }

  return {
    mensaje: MENSAJES.recarga_exitosa,
    saldoAnterior: saldoActual,
    montoRecargado: montoValido,
    nuevoSaldo: saldoActual + montoValido,
  };
}

/**
 * Paga el cobro pendiente por exceso de tiempo (HU_25).
 * Valida que exista una deuda pendiente y que el saldo cubra el valor total.
 * Descuenta el monto en TunjaAPI y actualiza el viaje en SQLite a PAGADO.
 */
export async function pagarCobroPendiente(usuarioId, token) {
  const cobro = viajesRepo.obtenerCobroPendiente(usuarioId);
  if (!cobro) {
    throw new AppError(400, "sin_cobros_pendientes");
  }

  let saldo = 0;
  if (token) {
    try {
      const billetera = await tunja("/wallet", { token });
      saldo = billetera?.saldo ?? 0;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(502, "tunja_no_responde");
    }

    if (saldo < cobro.valor_cobrado) {
      const faltante = cobro.valor_cobrado - saldo;
      throw new AppError(400, "saldo_insuficiente", {
        faltante,
        mensaje: `Saldo insuficiente. Le faltan $${faltante.toLocaleString("es-CO")}. Recargue su saldo`,
      });
    }

    await tunja("/wallet/charge", {
      metodo: "POST",
      cuerpo: {
        monto: cobro.valor_cobrado,
        concepto: `Pago exceso de tiempo viaje #${cobro.id}`,
      },
      token,
    });
  }

  // Actualizar SQLite: estado_cobro pasa de PENDIENTE a PAGADO
  const viajeActualizado = viajesRepo.pagarCobroPendiente(cobro.id);

  return {
    mensaje: MENSAJES.cobro_pagado,
    cobro: {
      viajeId: cobro.id,
      montoPagado: cobro.valor_cobrado,
      minutosExceso: cobro.minutos_exceso,
      estadoCobro: viajeActualizado.estado_cobro, // 'PAGADO'
      saldoRestante: Math.max(0, saldo - cobro.valor_cobrado),
    },
  };
}

