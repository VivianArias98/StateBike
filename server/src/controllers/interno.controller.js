import * as interno from "../services/interno.service.js";
import * as viajes from "../services/viajes.service.js";

export function consultarAnclajes(req, res) {
  res.json(interno.consultarAnclajes(Number(req.params.id)));
}

// Retiro de bicicleta desde estación física / simulador (HU_3)
export function retirar(req, res) {
  const datos = {
    ...req.body,
    ...(req.params.id && { estacionId: Number(req.params.id) }),
  };
  res.json(viajes.iniciarViaje(datos));
}

// Devolución de bicicleta en estación física / simulador (HU_4)
export async function devolver(req, res) {
  const datos = {
    ...req.body,
    ...(req.params.id && { estacionId: Number(req.params.id) }),
  };
  const resultado = await viajes.finalizarViaje(datos);
  res.json(resultado);
}
