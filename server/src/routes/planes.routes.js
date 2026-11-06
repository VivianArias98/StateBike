import { Router } from "express";
import * as controlador from "../controllers/planes.controller.js";

const router = Router();

router.get("/", controlador.listarPublicos);

export default router;