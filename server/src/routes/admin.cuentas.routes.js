import { Router } from "express";
import * as controlador from "../controllers/admin.cuentas.controller.js";
import { autenticar, requerirRol } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(autenticar, requerirRol("ADMINISTRADOR"));

// Gestión de cuentas de usuario (HU_21)
router.get("/", controlador.listar);
router.patch("/:id/inactivar", controlador.inactivar);
router.patch("/:id/reactivar", controlador.reactivar);

// Billetera y recarga en taquilla
router.get("/:id/billetera", controlador.consultarBilletera);
router.post("/:id/recargar", controlador.recargarSaldo);

export default router;
