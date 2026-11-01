import EstacionesPage from './pages/administrador/estaciones/EstacionesPage.jsx';
import ViajeEnCursoPage from './pages/usuario/viaje-en-curso/ViajeEnCursoPage.jsx';
import HistorialPage from './pages/usuario/historial/HistorialPage.jsx';
import ResumenViajePage from './pages/usuario/resumen-viaje/ResumenViajePage.jsx';
//import BicicletasPage from './pages/administrador/bicicletas/BicicletasPage.jsx';

//Sin router por ahora: App muestra una sola pantalla.
//Para probar otra, cambiar temporalmente lo que devuelve (<BicicletasPage />, etc.)
function App() {
  return <ResumenViajePage />;
}

export default App;
