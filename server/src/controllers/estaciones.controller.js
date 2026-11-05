import * as estaciones from "../services/estaciones.service.js";

//El id de la URL llega como texto
const idDe = (req) => Number(req.params.id);

export function listarPublicas(req, res) {
  res.json(estaciones.listarPublicas(req.query.q));
}

export function listarTodas(req, res) {
  res.json(estaciones.listarTodas(req.query.q));
}

export function registrar(req, res) {
  res.status(201).json(estaciones.registrar(req.body));
}

export function modificar(req, res) {
  res.json(estaciones.modificar(idDe(req), req.body));
}

export function inactivar(req, res) {
  res.json(estaciones.inactivar(idDe(req)));
}