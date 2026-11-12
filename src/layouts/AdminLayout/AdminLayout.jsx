import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo/Logo.jsx';
import BotonTema from '../../components/BotonTema/BotonTema.jsx';
import {
  IconoPanel,
  IconoUbicacion,
  IconoBicicleta,
  IconoCalendario,
  IconoNfc,
  IconoAlerta,
  IconoUsuario,
  IconoBilletera,
} from '../../components/Iconos/Iconos.jsx';
import { cerrarSesion } from '../../utils/auth.js';
import { leerSesion } from '../../utils/sesion.js';
import styles from './AdminLayout.module.css';

// Módulos oficiales del Rol Administrador (Gestión Central Tunja)
const MENU = [
  { nombre: 'Panel de control', ruta: '/admin', icono: <IconoPanel /> },
  { nombre: 'Estaciones', ruta: '/admin/estaciones', icono: <IconoUbicacion /> },
  { nombre: 'Bicicletas', ruta: '/admin/bicicletas', icono: <IconoBicicleta /> },
  { nombre: 'Planes y tarifas', ruta: '/admin/planes', icono: <IconoCalendario /> },
  { nombre: 'Tarjetas NFC', ruta: '/admin/tarjetas', icono: <IconoNfc /> },
  { nombre: 'Incidencias', ruta: '/admin/incidencias', icono: <IconoAlerta /> },
  { nombre: 'Cuentas', ruta: '/admin/cuentas', icono: <IconoUsuario /> },
  { nombre: 'Billetera', ruta: '/admin/billetera', icono: <IconoBilletera /> },
];

function AdminLayout({ itemActivo, children }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  const sesion = leerSesion();
  const nombreAdmin = sesion?.usuario?.nombreCompleto || 'Administrador';
  const correoAdmin = sesion?.usuario?.correo || sesion?.usuario?.email || 'admin@stationbike.com';

  const handleCerrarSesion = async () => {
    await cerrarSesion();
    navigate('/login');
  };

  const handleNavegar = (ruta) => {
    if (ruta) {
      navigate(ruta);
      setMenuAbierto(false);
    }
  };

  return (
    <div className={styles.raiz}>
      <aside className={styles.sidebar}>
        <div className={styles.cabecera}>
          <div
            className={styles.marcaAdmin}
            onClick={() => handleNavegar('/admin')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleNavegar('/admin')}
            aria-label="Ir al Panel de Administración"
          >
            <Logo altura="2.5rem" variante="oscuro" />
            <span className={styles.badgeAdmin}>
              <span className="punto-vivo" aria-hidden="true" />
              Gestión Central Tunja
            </span>
          </div>

          <button
            type="button"
            className={styles.botonMenu}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuAbierto}
            aria-controls="admin-menu"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            {menuAbierto ? '✕' : '☰'}
          </button>
        </div>

        <div
          id="admin-menu"
          className={menuAbierto ? `${styles.panel} ${styles.panelAbierto}` : styles.panel}
        >
          <nav className={styles.menu} aria-label="Navegación de administración">
            {MENU.map(({ nombre, ruta, icono }) => {
              const activo = nombre === itemActivo;
              return (
                <button
                  key={nombre}
                  type="button"
                  className={activo ? `${styles.item} ${styles.itemActivo}` : styles.item}
                  aria-current={activo ? 'page' : undefined}
                  onClick={() => handleNavegar(ruta)}
                >
                  <span className={styles.itemIcono}>{icono}</span>
                  <span className={styles.itemTexto}>{nombre}</span>
                  {activo && <span className="punto-vivo" style={{ backgroundColor: 'var(--color-primario-texto)' }} aria-hidden="true" />}
                </button>
              );
            })}
          </nav>

          <div className={styles.pie}>
            <div style={{ marginBottom: 'var(--espacio-3)', display: 'flex' }}>
              <BotonTema texto style={{ width: '100%' }} />
            </div>

            <div className={styles.tarjetaPerfil}>
              <div className={styles.avatarAdmin}>
                <IconoUsuario />
              </div>
              <div className={styles.datosAdmin}>
                <p className={styles.nombreAdmin}>{nombreAdmin}</p>
                <p className={styles.correoAdmin}>{correoAdmin}</p>
              </div>
            </div>

            <button
              type="button"
              className={styles.salir}
              onClick={handleCerrarSesion}
              title="Cerrar sesión segura de administración"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      <div className={styles.areaPrincipal}>
        <main className={styles.contenido}>{children}</main>
        <footer className={`contexto-oscuro ${styles.footer}`}>
          <span className={styles.marcaFooter}>StationBike · Sistema Oficial de Bicicletas Compartidas de Tunja</span>
          <span style={{ opacity: 0.7 }}>v2.0</span>
        </footer>
      </div>
    </div>
  );
}

export default AdminLayout;
