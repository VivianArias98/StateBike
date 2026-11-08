import { Router } from "express";
import { requerirClaveInterna } from "../middlewares/interno.middleware.js";
import * as controlador from "../controllers/interno.controller.js";

const router = Router();

// Todo lo de /api/interno es solo para la API NFC y el simulador de estación
router.use(requerirClaveInterna);

// Prueba de conexión
router.get("/ping", (req, res) => {
  res.json({ ok: true });
});

// Consulta de anclajes de una estación
router.get("/estaciones/:id/anclajes", controlador.consultarAnclajes);

// Retiro de bicicleta (HU_3)
router.post("/retiros", controlador.retirar);
router.post("/estaciones/:id/retiros", controlador.retirar);

// Devolución de bicicleta (HU_4)
router.post("/devoluciones", controlador.devolver);
router.post("/estaciones/:id/devoluciones", controlador.devolver);

export default router;
