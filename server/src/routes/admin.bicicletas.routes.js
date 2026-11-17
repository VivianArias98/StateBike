import { Router } from "express";
import * as controlador from "../controllers/bicicletas.controller.js";
import { autenticar, requerirRol } from "../middlewares/auth.middleware.js";

const router = Router();

//Todo el módulo de bicicletas es solo para administradores
router.use(autenticar, requerirRol("ADMINISTRADOR"));

router.get("/", controlador.listar);
router.post("/", controlador.registrar);
router.put("/:id", controlador.modificar);
router.patch("/:id/activar", controlador.activar);
router.patch("/:id/inactivar", controlador.inactivar);
router.patch("/:id/reubicar", controlador.reubicar);
router.patch("/estacion/:estacionId/reubicar-todas", controlador.reubicarTodas);

export default router;