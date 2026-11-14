import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../../../components/Logo/Logo.jsx';
import BotonTema from '../../../components/BotonTema/BotonTema.jsx';
import {
  IconoUsuario,
  IconoMapa,
  IconoBicicleta,
  IconoBilletera,
  IconoTarjeta,
  IconoReloj,
  IconoAlerta,
} from '../../../components/Iconos/Iconos.jsx';
import AvatarCiclista from '../../../components/AvataresCiclistas/AvatarCiclista.jsx';
import { useUsuario } from '../context/UsuarioContext.jsx';
import { borrarSesion } from '../../../utils/sesion.js';
import styles from './NavbarUsuario.module.css';

const ENLACES = [
  { texto: 'Inicio', ruta: '/inicio', Icono: IconoMapa },
  { texto: 'Viajes', ruta: '/viajes', Icono: IconoBicicleta },
  { texto: 'Mi billetera', ruta: '/billetera', Icono: IconoBilletera },
  { texto: 'Mi plan', ruta: '/plan', Icono: IconoTarjeta },
  { texto: 'Historial', ruta: '/historial', Icono: IconoReloj },
  { texto: 'Reportar incidencia', ruta: '/incidencias', Icono: IconoAlerta },
  { texto: 'Mi perfil', ruta: '/perfil', Icono: IconoUsuario },
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

        <div className={styles.accionesMovil}>
          {viajeActivo && (
            <NavLink
              to="/viajes"
              className={styles.badgeViajeMovil}
              title={`Viaje activo en ${viajeActivo.bicicleta || 'bicicleta'}`}
              aria-label="Ir a viaje activo"
            >
              <span className="punto-vivo" aria-hidden="true" />
              <span>{viajeActivo.bicicleta || 'EN VIAJE'}</span>
            </NavLink>
          )}
          <BotonTema compacto />
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
        </div>

        <div
          id="usuario-menu"
          className={menuAbierto ? `${styles.panel} ${styles.panelAbierto}` : styles.panel}
        >
          <nav className={styles.menu} aria-label="Navegación principal de usuario">
            {ENLACES.map(({ texto, ruta, Icono }) => (
              <NavLink
                key={ruta}
                to={ruta}
                className={({ isActive }) =>
                  isActive ? `${styles.enlace} ${styles.enlaceActivo}` : styles.enlace
                }
                onClick={() => menuAbierto && onAlternarMenu()}
              >
                {Icono && (
                  <span className={styles.iconoEnlace} aria-hidden="true">
                    <Icono />
                  </span>
                )}
                <span>{texto}</span>
              </NavLink>
            ))}
          </nav>

          <div className={styles.derecha}>
            <div className={styles.ocultarEnMovil}>
              <BotonTema compacto />
            </div>

            {viajeActivo && (
              <NavLink to="/viajes" className={styles.badgeViaje} title="Tienes un viaje en curso activo">
                <span className="punto-vivo" aria-hidden="true" />
                EN VIAJE · {viajeActivo.bicicleta}
              </NavLink>
            )}

            <p className={styles.nfc} title={`Tarjeta NFC: ${nfcActivo ? 'Activa' : (perfil?.tarjeta ? 'Bloqueada' : 'Sin vincular')}`}>
              <span className={nfcActivo ? 'punto-vivo' : styles.puntoInactivo} aria-hidden="true" />
              NFC: {nfcActivo ? 'ACTIVA' : (perfil?.tarjeta ? 'BLOQUEADA' : 'SIN VINCULAR')}
            </p>

            <div className={styles.perfil}>
              <span className={styles.avatar} aria-hidden="true">
                <AvatarCiclista id={perfil?.avatar} tamano="s" />
              </span>
              <div className={styles.datos}>
                <p className={styles.nombreUsuario}>{perfil?.nombreCompleto || 'Usuario'}</p>
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
