import * as tarjetas from "../services/tarjetas.service.js";

// Administrador (HU_18)
export async function listarUsuarios(req, res) {
  res.json(await tarjetas.listarUsuarios(req.query.q));
}

export async function vincular(req, res) {
  res.status(201).json(await tarjetas.vincular(req.body));
}

export async function desvincular(req, res) {
  res.json(await tarjetas.desvincular(Number(req.params.usuarioId)));
}

// Usuario en sesión (HU_1): req.usuario lo deja el middleware autenticar
export function consultarMia(req, res) {
  res.json(tarjetas.consultarMia(req.usuario.id));
}

export async function bloquear(req, res) {
  res.json(await tarjetas.bloquear(req.usuario.id));
}

export async function desbloquear(req, res) {
  res.json(await tarjetas.desbloquear(req.usuario.id));
}