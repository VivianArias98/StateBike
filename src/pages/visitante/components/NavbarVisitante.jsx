import Logo from '../../../components/Logo/Logo.jsx';
import BotonTema from '../../../components/BotonTema/BotonTema.jsx';
import { Icono } from './IconosVisitante.jsx';
import { leerSesion, rutaInicio } from '../../../utils/sesion.js';
import styles from './NavbarVisitante.module.css';

// Enlaces del navbar del visitante (mismo orden que el mockup)
const ENLACES = [
  { nombre: 'Acerca de nosotros', ruta: '/acerca' },
  { nombre: 'Cómo usar el servicio', ruta: '/como-usar' },
  { nombre: 'Estaciones', ruta: '/' },
  { nombre: 'Planes y tarifas', ruta: '/planes' },
];

// Componente de presentación: el estado del menú llega desde el layout.
// Detecta automáticamente si hay sesión activa para mostrar acceso a su panel o los botones de Iniciar sesión / Registrarse.
function NavbarVisitante({ itemActivo, menuAbierto, onAlternarMenu }) {
  const sesion = leerSesion();
  const usuario = sesion?.usuario;

  return (
    <header className={`contexto-oscuro ${styles.raiz}`}>
      <div className={styles.barra}>
        <a href="/" className={styles.marca} aria-label="StationBike, ir al inicio">
          <Logo altura="2.5rem" variante="oscuro" />
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--espacio-2)' }}>
          <BotonTema compacto />
          <button
            type="button"
            className={`boton boton--s ${styles.botonMenu}`}
            aria-expanded={menuAbierto}
            aria-controls="menu-visitante"
            onClick={onAlternarMenu}
          >
            <Icono nombre="cuadricula" />
            <span>Menú</span>
          </button>
        </div>
      </div>

      <div
        id="menu-visitante"
        className={`${styles.panel} ${menuAbierto ? styles.panelAbierto : ''}`}
      >
        <nav className={styles.navegacion} aria-label="Principal">
          {ENLACES.map((enlace) => {
            const activo = enlace.nombre === itemActivo;

            return (
              <a
                key={enlace.nombre}
                href={enlace.ruta}
                aria-current={activo ? 'page' : undefined}
                className={`${styles.enlace} ${activo ? styles.enlaceActivo : ''}`}
              >
                {enlace.nombre}
              </a>
            );
          })}
        </nav>

        <div className={styles.acciones}>
          {usuario ? (
            <a
              href={rutaInicio(usuario.rol)}
              className={`boton boton--s ${styles.pastilla}`}
              title={`Sesión iniciada como ${usuario.nombre || 'Usuario'}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--espacio-2)' }}
            >
              <span className={styles.avatar} role="img" aria-hidden="true" style={{ width: '1.8rem', height: '1.8rem' }}>
                <Icono nombre="usuario" />
              </span>
              <span>Mi cuenta</span>
            </a>
          ) : (
            <>
              <a href="/login" className={`boton boton--s ${styles.pastilla}`}>
                Iniciar sesión
              </a>
              <a href="/registro" className={`boton boton--primario boton--s ${styles.pastilla} ${styles.registrarse}`}>
                Registrarse
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default NavbarVisitante;
