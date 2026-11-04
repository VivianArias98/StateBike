import app from "./app.js";
import { env } from "./config/env.js";
import { aplicarEsquema } from "./db/init.js";

aplicarEsquema();

app.listen(env.puerto, () => {
  console.log(`Servidor StationBike en http://localhost:${env.puerto}`);
});