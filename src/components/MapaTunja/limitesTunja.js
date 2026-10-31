// Coordenadas APROXIMADAS de Tunja Formato: [latitud, longitud]
export const TUNJA_CENTRO = [5.5353, -73.3678];

// Esquinas del rectángulo que limita el mapa: [suroeste, noreste]
export const TUNJA_LIMITES = [
  [5.49, -73.42],
  [5.58, -73.32],
];

export function estaDentroDeTunja(lat, lng) {
  const [[surLat, oesteLng], [norteLat, esteLng]] = TUNJA_LIMITES;
  return lat >= surLat && lat <= norteLat && lng >= oesteLng && lng <= esteLng;
}