import React from 'react';
import UsuarioLayout from './layouts/UsuarioLayout/UsuarioLayout';
import BilleteraPage from './pages/usuario/billetera/BilleteraPage';

function App() {
  return (
    <UsuarioLayout>
      <BilleteraPage />
    </UsuarioLayout>
  );
}

export default App;