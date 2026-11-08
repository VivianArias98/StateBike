import React, { useState } from 'react';
import UsuarioLayout from './layouts/UsuarioLayout/UsuarioLayout';
import MiBilletera from './pages/usuario/billetera/MiBilletera';

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
      <MiBilletera />
    </UsuarioLayout>
  );
}

export default App;