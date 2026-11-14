import { Router } from "express";
import * as controladorPlanes from "../controllers/planes.controller.js";
import * as controladorSuscripciones from "../controllers/suscripciones.controller.js";
import { autenticar } from "../middlewares/auth.middleware.js";

const router = Router();

// Catálogo público de planes (HU_10)
router.get("/", controladorPlanes.listarPublicos);

// Mi plan activo (HU_17)
router.get("/mi-plan", autenticar, controladorSuscripciones.miPlan);

// Cancelar plan (HU_2)
router.post("/cancelar", autenticar, controladorSuscripciones.cancelar);

// Adquirir plan (HU_2)
router.post("/adquirir", autenticar, controladorSuscripciones.adquirir);

export default router;
