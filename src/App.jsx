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
import MiPerfilPage from './pages/usuario/mi-perfil/MiPerfilPage.jsx';
import MiBilleteraPage from './pages/usuario/mi-billetera/MiBilleteraPage.jsx';
import RecargarSaldoPaso1Page from './pages/usuario/recargar-saldo-paso-1/RecargarSaldoPaso1Page.jsx';
import RecargarSaldoPaso2Page from './pages/usuario/recargar-saldo-paso-2/RecargarSaldoPaso2Page.jsx';
import PagarCobroPaso1Page from './pages/usuario/pagar-cobro-paso-1/PagarCobroPaso1Page.jsx';
import PagarCobroPaso2Page from './pages/usuario/pagar-cobro-paso-2/PagarCobroPaso2Page.jsx';
import MiPlanPage from './pages/usuario/mi-plan/MiPlanPage.jsx';
import AdquirirPlanPaso1Page from './pages/usuario/adquirir-plan-paso-1/AdquirirPlanPaso1Page.jsx';
import AdquirirPlanPaso2Page from './pages/usuario/adquirir-plan-paso-2/AdquirirPlanPaso2Page.jsx';
import AdquirirPlanPaso3Page from './pages/usuario/adquirir-plan-paso-3/AdquirirPlanPaso3Page.jsx';
import AdquirirPlanPaso4Page from './pages/usuario/adquirir-plan-paso-4/AdquirirPlanPaso4Page.jsx';
import CancelarPlanPaso1Page from './pages/usuario/cancelar-plan-paso-1/CancelarPlanPaso1Page.jsx';
import CancelarPlanPaso2Page from './pages/usuario/cancelar-plan-paso-2/CancelarPlanPaso2Page.jsx';
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
          path="/perfil"
          element={
            <RutaProtegida rol={ROLES.USUARIO}>
              <MiPerfilPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/billetera"
          element={
            <RutaProtegida rol={ROLES.USUARIO}>
              <MiBilleteraPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/billetera/recargar"
          element={
            <RutaProtegida rol={ROLES.USUARIO}>
              <RecargarSaldoPaso1Page />
            </RutaProtegida>
          }
        />
        <Route
          path="/billetera/recargar/comprobante"
          element={
            <RutaProtegida rol={ROLES.USUARIO}>
              <RecargarSaldoPaso2Page />
            </RutaProtegida>
          }
        />
        <Route
          path="/billetera/pagar"
          element={
            <RutaProtegida rol={ROLES.USUARIO}>
              <PagarCobroPaso1Page />
            </RutaProtegida>
          }
        />
        <Route
          path="/billetera/pagar/comprobante"
          element={
            <RutaProtegida rol={ROLES.USUARIO}>
              <PagarCobroPaso2Page />
            </RutaProtegida>
          }
        />
        <Route
          path="/plan"
          element={
            <RutaProtegida rol={ROLES.USUARIO}>
              <MiPlanPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/plan/adquirir"
          element={
            <RutaProtegida rol={ROLES.USUARIO}>
              <AdquirirPlanPaso1Page />
            </RutaProtegida>
          }
        />
        <Route
          path="/plan/adquirir/elegir"
          element={
            <RutaProtegida rol={ROLES.USUARIO}>
              <AdquirirPlanPaso2Page />
            </RutaProtegida>
          }
        />
        <Route
          path="/plan/adquirir/resumen"
          element={
            <RutaProtegida rol={ROLES.USUARIO}>
              <AdquirirPlanPaso3Page />
            </RutaProtegida>
          }
        />
        <Route
          path="/plan/adquirir/activado"
          element={
            <RutaProtegida rol={ROLES.USUARIO}>
              <AdquirirPlanPaso4Page />
            </RutaProtegida>
          }
        />
        <Route
          path="/plan/cancelar"
          element={
            <RutaProtegida rol={ROLES.USUARIO}>
              <CancelarPlanPaso1Page />
            </RutaProtegida>
          }
        />
        <Route
          path="/plan/cancelar/listo"
          element={
            <RutaProtegida rol={ROLES.USUARIO}>
              <CancelarPlanPaso2Page />
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