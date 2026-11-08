import * as billetera from "../services/billetera.service.js";

export async function consultar(req, res) {
  const datos = await billetera.consultarBilletera(req.usuario.id, req.token);
  res.json(datos);
}

export async function recargar(req, res) {
  const resultado = await billetera.recargar(req.usuario.id, req.body.monto, req.token);
  res.json(resultado);
}

export async function pagarCobro(req, res) {
  const resultado = await billetera.pagarCobroPendiente(req.usuario.id, req.token);
  res.json(resultado);
}

