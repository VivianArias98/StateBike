//Mismos valores que src/components/MapaTunja/limitesTunja.js del front.
//Si se cambian allá, hay que cambiarlos aquí.
const [[LAT_MIN, LNG_MIN], [LAT_MAX, LNG_MAX]] = [
    [5.49, -73.42],
    [5.58, -73.32],
  ];
  
  export function estaDentroDeTunja(lat, lng) {
    return lat >= LAT_MIN && lat <= LAT_MAX && lng >= LNG_MIN && lng <= LNG_MAX;
  }