import { Router } from "express";
import health from "./health.routes.js";
import auth from "./auth.routes.js";
import estaciones from "./estaciones.routes.js";
import adminEstaciones from "./admin.estaciones.routes.js";
import adminBicicletas from "./admin.bicicletas.routes.js";
import planes from "./planes.routes.js";
import adminPlanes from "./admin.planes.routes.js";
import interno from "./interno.routes.js";
import tarjetas from "./tarjetas.routes.js";
import adminTarjetas from "./admin.tarjetas.routes.js";
import historial from "./historial.routes.js";
import billetera from "./billetera.routes.js";
import incidencias from "./incidencias.routes.js";
import adminIncidencias from "./admin.incidencias.routes.js";

const router = Router();

router.use(health);
router.use("/auth", auth);
router.use("/estaciones", estaciones);
router.use("/admin/estaciones", adminEstaciones);
router.use("/admin/bicicletas", adminBicicletas);
router.use("/admin/planes", adminPlanes);
router.use("/planes", planes);
router.use("/tarjeta", tarjetas);
router.use("/admin/tarjetas", adminTarjetas);
router.use("/historial", historial);
router.use("/billetera", billetera);
router.use("/incidencias", incidencias);
router.use("/admin/incidencias", adminIncidencias);

router.use("/interno", interno);


export default router;