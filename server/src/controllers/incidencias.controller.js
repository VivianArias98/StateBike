import * as incidencias from "../services/incidencias.service.js";

export function reportar(req, res) {
  const resultado = incidencias.reportar(req.usuario.id, req.body);
  res.status(201).json(resultado);
}

export function listarMisIncidencias(req, res) {
  res.json(incidencias.listarMisIncidencias(req.usuario.id));
}

