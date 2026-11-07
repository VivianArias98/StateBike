import * as interno from "../services/interno.service.js";

export function consultarAnclajes(req, res) {
  res.json(interno.consultarAnclajes(Number(req.params.id)));
}