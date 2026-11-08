import { Router } from "express";
import { autenticar, requerirRol } from "../middlewares/auth.middleware.js";
import * as controller from "../controllers/admin.dashboard.controller.js";

const router = Router();

router.get("/", autenticar, requerirRol("ADMINISTRADOR"), controller.obtenerResumen);

export default router;

