import { Router } from "express";
import * as controlador from "../controllers/admin.incidencias.controller.js";
import { autenticar, requerirRol } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(autenticar, requerirRol("ADMINISTRADOR"));

// Gestión de incidencias (HU_19)
router.get("/", controlador.listar);
router.patch("/:id/atender", controlador.atender);
router.patch("/:id/cerrar", controlador.cerrar);

export default router;

