import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../../../components/Logo/Logo.jsx';
import { IconoUsuario } from '../../../components/Iconos/Iconos.jsx';
import { useUsuario } from '../context/UsuarioContext.jsx';
import { borrarSesion } from '../../../utils/sesion.js';
import styles from './NavbarUsuario.module.css';

const ENLACES = [
  { texto: 'Inicio', ruta: '/inicio' },
  { texto: 'Viajes', ruta: '/viajes' },
  { texto: 'Mi billetera', ruta: '/billetera' },
  { texto: 'Mi plan', ruta: '/plan' },
  { texto: 'Historial', ruta: '/historial' },
  { texto: 'Reportar incidencia', ruta: '/incidencias' },
  { texto: 'Mi perfil', ruta: '/perfil' },
];

function NavbarUsuario({ menuAbierto, onAlternarMenu }) {
  const navigate = useNavigate();
  const { perfil, viajeActivo } = useUsuario();

  const handleCerrarSesion = () => {
    borrarSesion();
    navigate('/login');
  };

  const nfcActivo = perfil?.tarjeta?.estado === 'ACTIVA';

  return (
    <header className={`contexto-oscuro ${styles.raiz}`}>
      <div className={styles.barra}>
        <div className={styles.marca}>
          <NavLink to="/inicio" aria-label="Ir al inicio de StateBike">
            <Logo altura="3.5rem" variante="oscuro" />
          </NavLink>
        </div>

        <button
          type="button"
          className={styles.botonMenu}
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
          aria-controls="usuario-menu"
          onClick={onAlternarMenu}
        >
          {menuAbierto ? '✕' : '☰'}
        </button>

        <div
          id="usuario-menu"
          className={menuAbierto ? `${styles.panel} ${styles.panelAbierto}` : styles.panel}
        >
          <nav className={styles.menu} aria-label="Navegación principal de usuario">
            {ENLACES.map(({ texto, ruta }) => (
              <NavLink
                key={ruta}
                to={ruta}
                className={({ isActive }) =>
                  isActive ? `${styles.enlace} ${styles.enlaceActivo}` : styles.enlace
                }
                onClick={() => menuAbierto && onAlternarMenu()}
              >
                {texto}
              </NavLink>
            ))}
          </nav>

          <div className={styles.derecha}>
            {viajeActivo && (
              <NavLink to="/viajes" className={styles.badgeViaje} title="Tienes un viaje en curso activo">
                <span className="punto-vivo" aria-hidden="true" />
                EN VIAJE · {viajeActivo.bicicleta}
              </NavLink>
            )}

            <p className={styles.nfc} title={`Tarjeta NFC: ${nfcActivo ? 'Activa' : 'Bloqueada'}`}>
              <span className={nfcActivo ? 'punto-vivo' : ''} style={{ backgroundColor: nfcActivo ? undefined : 'var(--color-peligro)' }} aria-hidden="true" />
              NFC: {nfcActivo ? 'ACTIVO' : 'BLOQUEADA'} · <span className={styles.nfcId}>#{perfil?.tarjeta?.ultimosDigitos ?? '4821'}</span>
            </p>

            <div className={styles.perfil}>
              <span className={styles.avatar} aria-hidden="true">
                <IconoUsuario />
              </span>
              <div className={styles.datos}>
                <p className={styles.nombreUsuario}>{perfil?.nombreCompleto ?? 'Laura Gómez Rojas'}</p>
                <p className={styles.subtitulo}>Usuario verificado</p>
              </div>
            </div>

            <button
              type="button"
              className={styles.botonSalir}
              onClick={handleCerrarSesion}
              title="Cerrar sesión segura"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavbarUsuario;
