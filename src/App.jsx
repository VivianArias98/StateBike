import React, { useState } from 'react';
import UsuarioLayout from './layouts/UsuarioLayout/UsuarioLayout';
import InicioMapaPage from './pages/usuario/inicioMapa/InicioMapaPage';
import EstacionDetallePage from './pages/usuario/estacion-detalle/EstacionDetallePage';

function App() {
  const [vista, setVista] = useState('inicio');
  const [estacionSeleccionada, setEstacionSeleccionada] = useState(null);

  const irADetalle = (estacion) => {
    setEstacionSeleccionada(estacion);
    setVista('detalle');
  };

  const irAInicio = () => {
    setVista('inicio');
  };

  return (
    <UsuarioLayout>
      {vista === 'inicio' ? (
        <InicioMapaPage onVerDetalleEstacion={irADetalle} />
      ) : (
        <EstacionDetallePage 
          estacion={estacionSeleccionada} 
          onVolver={irAInicio} 
        />
      )}
    </UsuarioLayout>
  );
}

export default App;