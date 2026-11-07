import * as suscripciones from "../services/suscripciones.service.js";

export function miPlan(req, res) {
  res.json(suscripciones.consultarMiPlan(req.usuario.id));
}

export function cancelar(req, res) {
  res.json(suscripciones.cancelarPlan(req.usuario.id));
}

export async function adquirir(req, res) {
  const resultado = await suscripciones.adquirirPlan(req.usuario.id, req.body.planId, req.token);
  res.status(201).json(resultado);
}

