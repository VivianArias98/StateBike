import React, { useState } from 'react';
import UsuarioLayout from './layouts/UsuarioLayout/UsuarioLayout';
import BilleteraPage from './pages/usuario/billetera/BilleteraPage';

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
      <BilleteraPage />
    </UsuarioLayout>
  );
}

export default App;