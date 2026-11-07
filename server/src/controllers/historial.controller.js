import * as historial from "../services/historial.service.js";

export function viajes(req, res) {
  const { desde, hasta } = req.query;
  res.json(historial.consultarViajes(req.usuario.id, { desde, hasta }));
}

export async function pagos(req, res) {
  const { desde, hasta } = req.query;
  const resultado = await historial.consultarPagos(req.usuario.id, req.token, { desde, hasta });
  res.json(resultado);
}

