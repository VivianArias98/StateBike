import { Router } from "express";
import * as controlador from "../controllers/tarjetas.controller.js";
import { autenticar } from "../middlewares/auth.middleware.js";

const router = Router();

//La tarjeta es siempre la del usuario que tiene la sesión
router.use(autenticar);

router.get("/", controlador.consultarMia);
router.patch("/bloquear", controlador.bloquear);
router.patch("/desbloquear", controlador.desbloquear);

export default router;