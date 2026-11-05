import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import rutas from "./routes/index.js";
import { rutaNoEncontrada, manejarErrores } from "./middlewares/errores.middleware.js";

const app = express();

app.use(cors({ origin: env.origenFront }));
app.use(express.json());

app.use("/api", rutas);

app.use(rutaNoEncontrada);
app.use(manejarErrores);

export default app;