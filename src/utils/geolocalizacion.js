/**
 * Utilidades de geolocalización y cálculo de distancias geodésicas para StateBike Tunja.
 */

// Radio medio de la Tierra en metros (WGS84 aproximado)
const RADIO_TIERRA_METROS = 6371e3;

/**
 * Calcula la distancia ortodrómica (Haversine) en metros entre dos coordenadas geográficas.
 * @param {number} lat1 Latitud punto 1
 * @param {number} lon1 Longitud punto 1
 * @param {number} lat2 Latitud punto 2
 * @param {number} lon2 Longitud punto 2
 * @returns {number|null} Distancia en metros redondeada al entero más cercano, o null si faltan datos
 */
export function calcularDistanciaMetros(lat1, lon1, lat2, lon2) {
  const nLat1 = Number(lat1);
  const nLon1 = Number(lon1);
  const nLat2 = Number(lat2);
  const nLon2 = Number(lon2);

  if (
    !Number.isFinite(nLat1) ||
    !Number.isFinite(nLon1) ||
    !Number.isFinite(nLat2) ||
    !Number.isFinite(nLon2)
  ) {
    return null;
  }

  const rad = Math.PI / 180;
  const dLat = (nLat2 - nLat1) * rad;
  const dLon = (nLon2 - nLon1) * rad;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(nLat1 * rad) *
      Math.cos(nLat2 * rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(RADIO_TIERRA_METROS * c);
}

/**
 * Formatea una distancia en metros a texto amigable para la interfaz (ej: "150 m" o "1,4 km").
 * @param {number|null} metros
 * @returns {string} Texto formateado o cadena vacía si no hay valor
 */
export function formatearDistancia(metros) {
  if (metros == null || !Number.isFinite(metros) || metros < 0) return '';
  if (metros < 1000) {
    return `${metros} m`;
  }
  const km = (metros / 1000).toFixed(1).replace('.', ',');
  return `${km} km`;
}

/**
 * Enriquece un listado de estaciones con la distancia a la ubicación del usuario
 * y marca la(s) estación(es) más cercana(s).
 * @param {Array} estaciones Listado original de estaciones
 * @param {{ lat: number, lng: number }|null} ubicacion Ubicación actual del usuario
 * @returns {Array} Listado con campos adicionales: distanciaMetros, distanciaTexto y esMasCercana
 */
export function enriquecerEstacionesConDistancia(estaciones = [], ubicacion = null) {
  if (!Array.isArray(estaciones)) return [];

  const tieneUbicacionValida =
    ubicacion &&
    Number.isFinite(Number(ubicacion.lat)) &&
    Number.isFinite(Number(ubicacion.lng));

  if (!tieneUbicacionValida) {
    return estaciones.map((est) => ({
      ...est,
      distanciaMetros: null,
      distanciaTexto: '',
      esMasCercana: false,
    }));
  }

  const uLat = Number(ubicacion.lat);
  const uLng = Number(ubicacion.lng);

  // Calcular distancias de cada estación
  const conDistancias = estaciones.map((est) => {
    const lat = est.lat != null ? est.lat : est.latitud;
    const lng = est.lng != null ? est.lng : est.longitud;
    const distanciaMetros = calcularDistanciaMetros(uLat, uLng, lat, lng);
    return {
      ...est,
      lat: lat != null ? Number(lat) : null,
      lng: lng != null ? Number(lng) : null,
      distanciaMetros,
      distanciaTexto: formatearDistancia(distanciaMetros),
      esMasCercana: false,
    };
  });

  // Encontrar la menor distancia válida
  let menorDistancia = Infinity;
  for (const est of conDistancias) {
    if (est.distanciaMetros != null && est.distanciaMetros < menorDistancia) {
      menorDistancia = est.distanciaMetros;
    }
  }

  // Marcar la estación o estaciones más cercanas
  if (menorDistancia !== Infinity) {
    for (const est of conDistancias) {
      if (est.distanciaMetros === menorDistancia) {
        est.esMasCercana = true;
      }
    }
  }

  return conDistancias;
}

/**
 * Ordena las estaciones por distancia (las más cercanas primero).
 * Las estaciones sin coordenadas válidas se ubican al final conservando el orden relativo.
 * @param {Array} estaciones
 * @returns {Array}
 */
export function ordenarEstacionesPorCercania(estaciones = []) {
  if (!Array.isArray(estaciones)) return [];
  return [...estaciones].sort((a, b) => {
    if (a.distanciaMetros == null && b.distanciaMetros == null) return 0;
    if (a.distanciaMetros == null) return 1;
    if (b.distanciaMetros == null) return -1;
    return a.distanciaMetros - b.distanciaMetros;
  });
}

