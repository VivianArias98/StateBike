import { Router } from "express";
import health from "./health.routes.js";
import auth from "./auth.routes.js";

const router = Router();

router.use(health);
router.use("/auth", auth);
// Aquí se irán montando: /estaciones, /bicicletas, /planes...

export default router;