import * as cuentas from "../services/cuentas.service.js";

export async function consultar(req, res) {
  const perfil = await cuentas.consultarPerfil(req.usuario.id, req.token);
  res.json(perfil);
}

export async function editar(req, res) {
  const resultado = await cuentas.editarPerfil(req.usuario.id, req.body, req.token);
  res.json(resultado);
}

