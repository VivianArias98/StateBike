import { Router } from "express";
import health from "./health.routes.js";
import auth from "./auth.routes.js";
import estaciones from "./estaciones.routes.js";
import adminEstaciones from "./admin.estaciones.routes.js";
import adminBicicletas from "./admin.bicicletas.routes.js";

const router = Router();

router.use(health);
router.use("/auth", auth);
router.use("/estaciones", estaciones);
router.use("/admin/estaciones", adminEstaciones);
router.use("/admin/bicicletas", adminBicicletas);

export default router;