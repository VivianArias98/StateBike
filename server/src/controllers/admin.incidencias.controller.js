import * as incidencias from "../services/incidencias.service.js";

export function listar(req, res) {
  res.json(incidencias.listarAdmin(req.query));
}

export function atender(req, res) {
  res.json(incidencias.atender(req.params.id, req.body));
}

export function cerrar(req, res) {
  res.json(incidencias.cerrar(req.params.id));
}

