import React, { useState } from 'react';
import UsuarioLayout from './layouts/UsuarioLayout/UsuarioLayout.jsx';
import ViajePage from './pages/usuario/viaje/ViajePage.jsx';
import HistorialPage from './pages/usuario/historial/HistorialPage.jsx';
import ReportarIncidenciaPage from './pages/usuario/reportar-incidencia/ReportarIncidenciaPage.jsx';


function App() {
  const [seccionActiva, setSeccionActiva] = useState('viajes');

  return (
    <UsuarioLayout itemActivo={seccionActiva} onCambiarSeccion={setSeccionActiva}>
      {seccionActiva === 'viajes' && <ViajePage />}
      {seccionActiva === 'historial' && <HistorialPage />}
      {seccionActiva === 'incidencias' && <ReportarIncidenciaPage />}
      {seccionActiva === 'mi-perfil' && <MiPerfilPage />}
      {seccionActiva === 'mi-plan' && <MiPlanPage />}
      {seccionActiva === 'mi-billetera' && <MiBilleteraPage />}
    </UsuarioLayout>
  );
}

export default App;