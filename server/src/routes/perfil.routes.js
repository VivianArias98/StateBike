import { Router } from "express";
import * as controlador from "../controllers/perfil.controller.js";
import { autenticar } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(autenticar);

// Gestión de perfil propio (HU_1)
router.get("/", controlador.consultar);
router.put("/", controlador.editar);

export default router;

