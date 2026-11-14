import { AppError } from "../utils/AppError.js";
import * as estaciones from "../repositories/estaciones.repository.js";
import * as anclajes from "../repositories/anclajes.repository.js";

//Estado de una estación para el terminal: sus anclajes y la bicicleta de cada uno
export function consultarAnclajes(estacionId) {
  const estacion = Number.isInteger(estacionId) ? estaciones.buscarPorId(estacionId) : undefined;
  if (!estacion) throw new AppError(404, "estacion_no_encontrada");

  return {
    estacion: { id: estacion.id, nombre: estacion.nombre, estado: estacion.estado },
    anclajes: anclajes.listarPorEstacion(estacion.id).map((a) => ({
      numero: a.numero,
      codigo: a.codigo,
      estado: a.estado,
      bicicleta: a.bicicletaCodigo
        ? { codigo: a.bicicletaCodigo, estado: a.bicicletaEstado }
        : null,
    })),
  };
}