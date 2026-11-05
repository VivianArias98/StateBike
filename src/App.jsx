import React from 'react';

// 1. Importa aquí los componentes de la carpeta src/pages/visitante
// (Asegúrate de que las rutas de las carpetas coincidan exactamente con tu estructura)
import InicioMapa from './pages/visitante/recuperarContrasena/RecuperarContrasena';
//import PlanesTarifas from './pages/visitante/PlanesTarifas/PlanesTarifas.jsx';
//import ComoUsar from './pages/visitante/ComoUsar/ComoUsar.jsx';
//import AcercaDeNosotros from './pages/visitante/AcercaDeNosotros/AcercaDeNosotros.jsx';

function App() {
  // Instrucción: Descomenta ÚNICAMENTE el componente que quieras visualizar en pantalla.
  
  return (
    <div className="app-container">
      {/* --- PÁGINA ACTIVA ACTUAL --- */}
      <InicioMapa />

      {/* --- OTRAS PÁGINAS (Comentadas para mostrar manualmente) --- */}
      {/* <PlanesTarifas /> */}
      {/* <ComoUsar /> */}
      {/* <AcercaDeNosotros /> */}
    </div>
  );
}

export default App;