import { Router } from "express";
import * as controlador from "../controllers/estaciones.controller.js";
import { autenticar, requerirRol } from "../middlewares/auth.middleware.js";

const router = Router();

//Todo lo de este archivo es solo para administradores
router.use(autenticar, requerirRol("ADMINISTRADOR"));

router.get("/", controlador.listarTodas);
router.post("/", controlador.registrar);
router.put("/:id", controlador.modificar);
router.patch("/:id/inactivar", controlador.inactivar);

export default router;