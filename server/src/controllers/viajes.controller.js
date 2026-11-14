import * as viajes from "../services/viajes.service.js";

export function consultarEnCurso(req, res) {
  res.json(viajes.consultarViajeEnCurso(req.usuario.id));
}

export function consultarUltimo(req, res) {
  res.json(viajes.consultarUltimoViaje(req.usuario.id));
}

