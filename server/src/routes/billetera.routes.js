import { Router } from "express";
import * as controlador from "../controllers/billetera.controller.js";
import { autenticar } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(autenticar);

// Consultar billetera (HU_23)
router.get("/", controlador.consultar);

// Recargar saldo (HU_24)
router.post("/recargar", controlador.recargar);

// Pagar cobro pendiente (HU_25)
router.post("/pagar-cobro", controlador.pagarCobro);

export default router;

