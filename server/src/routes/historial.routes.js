import { Router } from "express";
import * as controlador from "../controllers/historial.controller.js";
import { autenticar } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(autenticar);

// Historial de viajes (HU_5)
router.get("/viajes", controlador.viajes);

// Historial de pagos (HU_5)
router.get("/pagos", controlador.pagos);

export default router;

