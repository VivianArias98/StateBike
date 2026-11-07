import { AppError } from "../utils/AppError.js";
import { MENSAJES } from "../utils/mensajes.js";
import * as repositorio from "../repositories/planes.repository.js";

const LARGO_MAX_NOMBRE = 50; // Plan.nombrePlan VARCHAR(50) en el diccionario
const MINIMO_PESOS = 100;    // costo base y valor por minuto de exceso (HU_15)

const vacio = (valor) => typeof valor !== "string" || valor.trim() === "";
const sinValor = (valor) => String(valor ?? "").trim() === "";

//Entero estricto: acepta 4000 o "4000"; rechaza "4.5", "abc" y notación científica
function aEntero(valor) {
  const texto = String(valor ?? "").trim();
  return /^-?\d+$/.test(texto) && Number.isSafeInteger(Number(texto)) ? Number(texto) : NaN;
}

function obtener(id) {
  const plan = Number.isInteger(id) ? repositorio.buscarPorId(id) : undefined;
  if (!plan) throw new AppError(404, "plan_no_encontrado");
  return plan;
}

//Valida en el orden de los criterios de la HU_15 y devuelve el plan limpio
function validar(datos = {}) {
  const { nombre, costoBase, vigenciaDias, viajesPorDia, tiempoViajeMin, valorMinutoExceso } = datos;

  const numerosVacios = [costoBase, vigenciaDias, viajesPorDia, tiempoViajeMin, valorMinutoExceso].some(sinValor);
  if (vacio(nombre) || numerosVacios) throw new AppError(400, "campos_obligatorios_vacios");

  const plan = {
    nombre: nombre.trim(),
    costoBase: aEntero(costoBase),
    vigenciaDias: aEntero(vigenciaDias),
    viajesPorDia: aEntero(viajesPorDia),
    tiempoViajeMin: aEntero(tiempoViajeMin),
    valorMinutoExceso: aEntero(valorMinutoExceso),
  };

  if (plan.nombre.length > LARGO_MAX_NOMBRE) throw new AppError(400, "nombre_plan_invalido");

  const costoValido = plan.costoBase >= MINIMO_PESOS;
  const excesoValido = plan.valorMinutoExceso === 0 || plan.valorMinutoExceso >= MINIMO_PESOS;
  if (!costoValido || !excesoValido) throw new AppError(400, "costo_invalido");

  const enterosPositivos = [plan.vigenciaDias, plan.viajesPorDia, plan.tiempoViajeMin].every((n) => n > 0);
  if (!enterosPositivos) throw new AppError(400, "numeros_plan_invalidos");

  return plan;
}

//HU_10 y HU_17: el catálogo vigente solo tiene los planes ACTIVO
export function listarPublicos() {
  const planes = repositorio.listar({ soloActivos: true });
  return planes.length > 0 ? { planes } : { planes, mensaje: MENSAJES.sin_planes_disponibles };
}

//HU_15: el administrador ve todos, activos e inactivos
export function listarTodos() {
  return { planes: repositorio.listar() };
}

export function registrar(datos) {
  const plan = validar(datos);
  if (repositorio.existeNombre(plan.nombre)) throw new AppError(409, "nombre_plan_duplicado");

  const id = repositorio.crear(plan);
  return { mensaje: MENSAJES.plan_guardado, plan: repositorio.buscarPorId(id) };
}

//Criterio 6: los planes ya adquiridos no cambian; esto solo afecta compras futuras
export function modificar(id, datos) {
  obtener(id);
  const plan = validar(datos);
  if (repositorio.existeNombre(plan.nombre, id)) throw new AppError(409, "nombre_plan_duplicado");

  repositorio.actualizar(id, plan);
  return { mensaje: MENSAJES.plan_guardado, plan: repositorio.buscarPorId(id) };
}

//Inactivar solo saca el plan del catálogo; no toca los planes ya comprados
export function cambiarEstado(id, estado) {
  obtener(id);
  repositorio.cambiarEstado(id, estado);
  return { plan: repositorio.buscarPorId(id) };
}