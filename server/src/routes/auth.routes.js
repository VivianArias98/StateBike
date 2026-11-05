import { Router } from "express";
import * as controlador from "../controllers/auth.controller.js";
import { autenticar } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", controlador.registrar);
router.post("/login", controlador.iniciarSesion);
router.post("/refresh", controlador.refrescar);
router.post("/logout", controlador.cerrarSesion);
router.get("/me", autenticar, controlador.yo);

export default router;