import * as dashboardService from "../services/dashboard.service.js";

export function obtenerResumen(_req, res, next) {
  try {
    const resumen = dashboardService.obtenerResumen();
    res.json(resumen);
  } catch (error) {
    next(error);
  }
}

