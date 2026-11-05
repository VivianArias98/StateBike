import * as auth from "../services/auth.service.js";

export async function registrar(req, res) {
  res.status(201).json(await auth.registrar(req.body));
}

export async function iniciarSesion(req, res) {
  res.json(await auth.iniciarSesion(req.body));
}

export async function refrescar(req, res) {
  res.json(await auth.refrescar(req.body?.refresco));
}

export async function cerrarSesion(req, res) {
  await auth.cerrarSesion(req.body?.refresco);
  res.sendStatus(204);
}

// req.usuario lo deja el middleware autenticar
export function yo(req, res) {
  res.json({ usuario: req.usuario });
}