import { useEffect, useState } from 'react';

// Segundos transcurridos del viaje. La base la calcula el servidor (segundosTranscurridos);
// aquí solo se suman los segundos que pasaron desde que llegó esa respuesta.
export function useCronometro(viaje) {
  const [ahora, setAhora] = useState(() => Date.now());
  const viajeId = viaje?.id;

  useEffect(() => {
    if (!viajeId) return undefined;
    setAhora(Date.now());
    const intervalo = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(intervalo);
  }, [viajeId]);

  if (!viaje) return 0;
  return viaje.segundosTranscurridos + Math.max(0, Math.floor((ahora - viaje.recibidoEn) / 1000));
}