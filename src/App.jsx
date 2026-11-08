import React, { useState } from 'react';
import UsuarioLayout from './layouts/UsuarioLayout/UsuarioLayout';
import MiBilletera from './pages/usuario/billetera/MiBilletera';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import RutaProtegida from './components/RutaProtegida/RutaProtegida.jsx';
import { ROLES } from './services/sesion.js';

import EstacionesPage from './pages/visitante/estaciones/EstacionesPage.jsx';
import PlanesTarifas from './pages/visitante/planesyTarifas/PlanesTarifas.jsx';
import AcercaNosotros from './pages/visitante/acercaNosotros/AcercaNosotros.jsx';
import ComoUsarServicio from './pages/visitante/comoUsarServicio/ComoUsarServicio.jsx';
import InicioSesionPage from './pages/visitante/inicioSesion/InicioSesionPage.jsx';
import RegistroPage from './pages/visitante/registro/RegistroPage.jsx';

import InicioMapaPage from './pages/usuario/inicioMapa/InicioMapaPage.jsx';
import PanelControlPage from './pages/administrador/panel-control/PanelControlPage.jsx';

function App() {
  return (
    <UsuarioLayout>
      <MiBilletera />
    </UsuarioLayout>
  );
}

export default App;