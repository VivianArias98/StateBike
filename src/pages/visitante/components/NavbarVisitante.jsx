import Logo from '../../../components/Logo/Logo.jsx';
import { Icono } from './IconosVisitante.jsx';
import styles from './NavbarVisitante.module.css';

// Enlaces del navbar del visitante (mismo orden que el mockup)
const ENLACES = [
  { nombre: 'Acerca de nosotros', ruta: '/acerca' },
  { nombre: 'Cómo usar el servicio', ruta: '/como-usar' },
  { nombre: 'Estaciones', ruta: '/' },
  { nombre: 'Planes y tarifas', ruta: '/planes' },
];

// Componente de presentación: el estado del menú llega desde el layout.
// conUsuario: muestra el icono de la persona a la derecha (Estaciones y Planes).
function NavbarVisitante({ itemActivo, menuAbierto, onAlternarMenu, conUsuario = false }) {
  return (
    <header className={`contexto-oscuro ${styles.raiz}`}>
      <div className={styles.barra}>
        <a href="/" className={styles.marca} aria-label="StationBike, ir al inicio">
          <Logo altura="2.5rem" variante="oscuro" />
        </a>

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
          {conUsuario ? (
            <span className={styles.avatar} role="img" aria-label="Mi cuenta">
              <Icono nombre="usuario" />
            </span>
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
