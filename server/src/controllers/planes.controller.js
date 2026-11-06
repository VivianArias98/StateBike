import * as planes from "../services/planes.service.js";

//El id de la URL llega como texto
const idDe = (req) => Number(req.params.id);

export function listarPublicos(req, res) {
  res.json(planes.listarPublicos());
}

export function listarTodos(req, res) {
  res.json(planes.listarTodos());
}

export function registrar(req, res) {
  res.status(201).json(planes.registrar(req.body));
}

export function modificar(req, res) {
  res.json(planes.modificar(idDe(req), req.body));
}

export function activar(req, res) {
  res.json(planes.cambiarEstado(idDe(req), "ACTIVO"));
}

export function inactivar(req, res) {
  res.json(planes.cambiarEstado(idDe(req), "INACTIVO"));
}