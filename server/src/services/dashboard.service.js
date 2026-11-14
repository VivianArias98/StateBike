import * as estacionesRepo from "../repositories/estaciones.repository.js";
import * as bicicletasRepo from "../repositories/bicicletas.repository.js";
import * as anclajesRepo from "../repositories/anclajes.repository.js";
import * as incidenciasRepo from "../repositories/incidencias.repository.js";
import * as viajesRepo from "../repositories/viajes.repository.js";

const MAPA_TIPOS_INCIDENCIA = {
  BICICLETA: "Daño en bicicleta",
  ANCLAJE: "Falla en anclaje",
  TARJETA: "Tarjeta NFC perdida/dañada",
  OTRO: "Otro daño o incidencia",
};

export function obtenerResumen() {
  const estaciones = estacionesRepo.contarPorEstado();
  const flota = bicicletasRepo.contarFlota();
  const ocupacionGlobal = anclajesRepo.contarOcupacionGlobal();
  const viajesEnCurso = viajesRepo.contarEnCurso();
  const incidenciasAbiertas = incidenciasRepo.contarAbiertas();
  const ocupacionEstaciones = estacionesRepo.listarOcupacion();
  const recientes = incidenciasRepo.listarRecientes(5);

  const porcentajeFlota = flota.total > 0
    ? Math.round((flota.disponibles / flota.total) * 100)
    : 0;

  return {
    indicadores: {
      estacionesActivas: estaciones.activas,
      estacionesInactivas: estaciones.inactivas,
      bicicletasDisponibles: flota.disponibles,
      flotaTotal: flota.total,
      flotaEnUso: flota.enUso,
      flotaMantenimiento: flota.mantenimiento,
      porcentajeFlota,
      viajesEnCurso,
      incidenciasAbiertas,
    },
    estaciones: ocupacionEstaciones.map((e) => ({
      id: e.id,
      nombre: e.nombre,
      ocupados: e.ocupados,
      capacidad: e.capacidad,
      porcentaje: e.capacidad > 0 ? Math.round((e.ocupados / e.capacidad) * 100) : 0,
      lleno: e.ocupados >= e.capacidad,
    })),
    totalOcupados: ocupacionGlobal.ocupados,
    capacidadTotal: ocupacionGlobal.total > 0
      ? ocupacionGlobal.total
      : ocupacionEstaciones.reduce((sum, e) => sum + e.capacidad, 0),
    incidencias: recientes.map((inc) => ({
      id: inc.id,
      tipo: MAPA_TIPOS_INCIDENCIA[inc.tipo] || inc.tipo,
      tipoCodigo: inc.tipo,
      detalle: inc.codigoBicicleta || inc.nombreEstacion || inc.descripcion || "Incidencia",
      estado: inc.estado,
      reportadoPor: inc.reportadoPor,
      fechaCreacion: inc.fechaCreacion,
    })),
  };
}
