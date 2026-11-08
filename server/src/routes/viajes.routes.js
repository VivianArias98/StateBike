import { Router } from "express";
import * as controlador from "../controllers/viajes.controller.js";
import { autenticar } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(autenticar);

// Consulta del viaje activo del usuario en sesión
router.get("/en-curso", controlador.consultarEnCurso);

export default router;

