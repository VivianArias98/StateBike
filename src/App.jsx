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
import AdminEstacionesPage from './pages/administrador/estaciones/EstacionesPage.jsx';
import AdminBicicletasPage from './pages/administrador/bicicletas/BicicletasPage.jsx';
import AdminPlanesPage from './pages/administrador/planes-tarifas/PlanesTarifasPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EstacionesPage />} />
        <Route path="/planes" element={<PlanesTarifas />} />
        <Route path="/acerca" element={<AcercaNosotros />} />
        <Route path="/como-usar" element={<ComoUsarServicio />} />
        <Route path="/login" element={<InicioSesionPage />} />
        <Route path="/registro" element={<RegistroPage />} />

        <Route
          path="/inicio"
          element={
            <RutaProtegida rol={ROLES.USUARIO}>
              <InicioMapaPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin"
          element={
            <RutaProtegida rol={ROLES.ADMINISTRADOR}>
              <PanelControlPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/estaciones"
          element={
            <RutaProtegida rol={ROLES.ADMINISTRADOR}>
              <AdminEstacionesPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/bicicletas"
          element={
            <RutaProtegida rol={ROLES.ADMINISTRADOR}>
              <AdminBicicletasPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/planes"
          element={
            <RutaProtegida rol={ROLES.ADMINISTRADOR}>
              <AdminPlanesPage />
            </RutaProtegida>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;