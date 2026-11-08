import { Router } from "express";
import * as controlador from "../controllers/incidencias.controller.js";
import { autenticar } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(autenticar);

// Reportar daño o incidencia (HU_6)
router.post("/", controlador.reportar);

// Mis incidencias reportadas (HU_6)
router.get("/", controlador.listarMisIncidencias);

export default router;

