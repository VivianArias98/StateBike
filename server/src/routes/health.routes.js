import { Router } from "express";
import { db } from "../config/db.js";
import { tunja } from "../clients/tunja.client.js";

const router = Router();

//Comprueba servidor, SQLite y que la clave de TunjaAPI esté viva
router.get("/health", async (req, res) => {
  const sqlite = db.prepare("SELECT 1 AS ok").get().ok === 1;

  let tunjaOk = false;
  try {
    await tunja("/key");
    tunjaOk = true;
  } catch {
    tunjaOk = false;
  }

  res.json({ servidor: "ok", sqlite, tunja: tunjaOk });
});

export default router;