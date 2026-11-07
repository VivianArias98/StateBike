import { Router } from "express";
import { requerirClaveInterna } from "../middlewares/interno.middleware.js";
import * as controlador from "../controllers/interno.controller.js";

const router = Router();

//Todo lo de /api/interno es solo para la API NFC
router.use(requerirClaveInterna);

//Prueba de conexión; después se montan aquí los retiros y devoluciones
router.get("/ping", (req, res) => {
  res.json({ ok: true });
});

router.get("/estaciones/:id/anclajes", controlador.consultarAnclajes);

export default router;