import * as cuentas from "../services/cuentas.service.js";

export function listar(req, res) {
  res.json(cuentas.listarCuentas(req.query));
}

export async function inactivar(req, res) {
  const resultado = await cuentas.inactivarCuenta(req.usuario.id, req.params.id);
  res.json(resultado);
}

export async function reactivar(req, res) {
  const resultado = await cuentas.reactivarCuenta(req.usuario.id, req.params.id);
  res.json(resultado);
}

export async function consultarBilletera(req, res) {
  const resultado = await cuentas.consultarBilleteraUsuario(req.params.id);
  res.json(resultado);
}

export async function recargarSaldo(req, res) {
  const resultado = await cuentas.recargarSaldoUsuario(req.usuario.id, req.params.id, req.body.monto);
  res.json(resultado);
}
