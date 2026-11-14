import { Router } from "express";
import * as controlador from "../controllers/bicicletas.controller.js";

const router = Router();

// Consulta de bicicletas registradas para reporte de incidencias y disponibilidad (HU_6, HU_9)
router.get("/", controlador.listar);

export default router;

