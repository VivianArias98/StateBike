import * as bicicletas from "../services/bicicletas.service.js";

//El id de la URL llega como texto
const idDe = (req) => Number(req.params.id);

export function listar(req, res) {
  res.json(bicicletas.listar(req.query.q));
}

export function registrar(req, res) {
  res.status(201).json(bicicletas.registrar(req.body));
}

export function modificar(req, res) {
  res.json(bicicletas.modificar(idDe(req), req.body));
}

export function inactivar(req, res) {
  res.json(bicicletas.inactivar(idDe(req)));
}

export function activar(req, res) {
  res.json(bicicletas.activar(idDe(req), req.body));
}