import { Router } from "express";
import * as controlador from "../controllers/tarjetas.controller.js";
import { autenticar, requerirRol } from "../middlewares/auth.middleware.js";

const router = Router();

// Todo lo de este archivo es solo para administradores
router.use(autenticar, requerirRol("ADMINISTRADOR"));

router.get("/", controlador.listarUsuarios);
router.post("/", controlador.vincular);
router.delete("/:usuarioId", controlador.desvincular);

export default router;