import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook personalizado para rastreo de ubicación en tiempo real de alta precisión.
 * Utiliza navigator.geolocation.watchPosition con fallback y manejo de errores amigable.
 * 
 * @param {Object} opciones
 * @param {boolean} [opciones.autoActivar=true] - Si debe solicitar/activar la geolocalización al montar
 * @returns {{
 *   ubicacion: { lat: number, lng: number, precision: number, marcaTiempo: number } | null,
 *   cargando: boolean,
 *   error: string | null,
 *   activo: boolean,
 *   activar: () => void,
 *   desactivar: () => void
 * }}
 */
export function useUbicacionTiempoReal({ autoActivar = true } = {}) {
  const [ubicacion, setUbicacion] = useState(null);
  const [cargando, setCargando] = useState(autoActivar);
  const [error, setError] = useState(null);
  const [activo, setActivo] = useState(false);
  const watchIdRef = useRef(null);

  const detenerSeguimiento = useCallback(() => {
    if (watchIdRef.current != null && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setActivo(false);
  }, []);

  const iniciarSeguimiento = useCallback(() => {
    if (typeof window === 'undefined' || !navigator?.geolocation) {
      setError('Tu navegador o dispositivo no soporta geolocalización.');
      setCargando(false);
      setActivo(false);
      return;
    }

    detenerSeguimiento();
    setCargando(true);
    setError(null);
    setActivo(true);

    const opcionesGeo = {
      enableHighAccuracy: true,
      maximumAge: 3000,
      timeout: 12000,
    };

    const enExito = (pos) => {
      setUbicacion({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        precision: Math.round(pos.coords.accuracy || 0),
        marcaTiempo: pos.timestamp,
      });
      setCargando(false);
      setError(null);
    };

    const enError = (err) => {
      setCargando(false);
      switch (err.code) {
        case 1: // PERMISSION_DENIED
          setError('Permiso de ubicación denegado. Habilita los permisos de tu navegador para ubicarte.');
          break;
        case 2: // POSITION_UNAVAILABLE
          setError('No fue posible detectar tu señal de ubicación.');
          break;
        case 3: // TIMEOUT
          setError('Tiempo de espera agotado al consultar la ubicación satelital.');
          break;
        default:
          setError('No fue posible obtener tu ubicación en tiempo real.');
      }
    };

    // Intentar una primera lectura inmediata
    try {
      navigator.geolocation.getCurrentPosition(enExito, () => {
        // Si la lectura rápida falla, el watchPosition continuará escuchando
      }, opcionesGeo);

      // Iniciar el listener de seguimiento en tiempo real
      watchIdRef.current = navigator.geolocation.watchPosition(enExito, enError, opcionesGeo);
    } catch (e) {
      setError('Error al iniciar la geolocalización.');
      setCargando(false);
      setActivo(false);
    }
  }, [detenerSeguimiento]);

  useEffect(() => {
    if (autoActivar) {
      iniciarSeguimiento();
    }
    return () => {
      detenerSeguimiento();
    };
  }, [autoActivar, iniciarSeguimiento, detenerSeguimiento]);

  return {
    ubicacion,
    cargando,
    error,
    activo,
    activar: iniciarSeguimiento,
    desactivar: detenerSeguimiento,
  };
}

export default useUbicacionTiempoReal;

