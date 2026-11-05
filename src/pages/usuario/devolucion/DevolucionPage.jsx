import { useEffect, useState } from 'react';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import ViajeEnCursoPage from '../viaje-en-curso/ViajeEnCursoPage.jsx';
import ResumenViajePage from '../resumen-viaje/ResumenViajePage.jsx';
import ConfirmarDevolucion from './ConfirmarDevolucion.jsx';
import { obtenerEstacionesDestino, finalizarViaje } from '../../../services/viajesService.js';

// Flujo de devolución: viaje en curso -> elegir destino y confirmar -> resumen del viaje.
// Guarda el estado y la lógica. vista: 'viaje' | 'confirmar' | 'resumen'.
function DevolucionPage() {
  const [vista, setVista] = useState('viaje');
  const [devolucion, setDevolucion] = useState(null); // { viaje, segundos } al pulsar DEVOLVER
  const [estaciones, setEstaciones] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerEstacionesDestino()
      .then(setEstaciones)
      .catch(() => setError('No se pudieron cargar las estaciones. Intenta de nuevo.'));
  }, []);

  async function confirmar(estacionDestino) {
    setEnviando(true);
    setError('');
    try {
      const datos = await finalizarViaje({
        viaje: devolucion.viaje,
        segundos: devolucion.segundos,
        estacionDestino,
      });
      setResumen(datos);
      setVista('resumen');
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setEnviando(false);
    }
  }

  if (vista === 'resumen') {
    return <ResumenViajePage resumen={resumen} onNuevoViaje={() => { setResumen(null); setDevolucion(null); setVista('viaje'); }} />;
  }

  if (vista === 'confirmar') {
    return (
      <UsuarioLayout itemActivo="Viajes">
        <ConfirmarDevolucion
          viaje={devolucion.viaje}
          segundos={devolucion.segundos}
          estaciones={estaciones}
          enviando={enviando}
          error={error}
          onConfirmar={confirmar}
          onVolver={() => setVista('viaje')}
        />
      </UsuarioLayout>
    );
  }

  return (
    <ViajeEnCursoPage
      segundosIniciales={devolucion ? devolucion.segundos : undefined}
      onDevolver={(datos) => {
        setDevolucion(datos);
        setVista('confirmar');
      }}
    />
  );
}

export default DevolucionPage;
