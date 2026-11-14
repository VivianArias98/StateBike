import { useEffect, useState } from 'react';
import { mensajeError } from './mensajeError.js';

// Carga datos del backend al abrir una pantalla.
// cargar: función que devuelve una promesa (por ejemplo una llamada de un archivo *Api.js).
// Devuelve { datos, cargando, error, reintentar }. "error" ya es el texto para mostrar.
export function useCarga(cargar) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  // intento sube al pulsar "Reintentar" y vuelve a disparar la carga
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;
    cargar()
      .then((respuesta) => {
        if (!activo) return;
        setDatos(respuesta);
        setError('');
      })
      .catch((errorApi) => {
        if (activo) setError(mensajeError(errorApi));
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
    // La función de carga es fija por pantalla; solo se repite al reintentar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intento]);

  const reintentar = () => {
    setCargando(true);
    setError('');
    setIntento((valor) => valor + 1);
  };

  return { datos, cargando, error, reintentar };
}
