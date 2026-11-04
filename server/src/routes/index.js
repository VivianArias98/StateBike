import { Router } from "express";
import health from "./health.routes.js";

const router = Router();

router.use(health);
//Aquí se irán montando: /auth, /estaciones, /bicicletas, /planes...

export default router;