import { Router } from "express";
import * as controlador from "../controllers/estaciones.controller.js";

const router = Router();

router.get("/", controlador.listarPublicas);

export default router;