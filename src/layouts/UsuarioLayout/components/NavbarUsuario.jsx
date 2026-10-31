import { IconoBicicleta, IconoUsuario } from '../../../components/Iconos/Iconos.jsx';
import styles from './NavbarUsuario.module.css';

const ENLACES = ['Mapa', 'Historial', 'Mi Perfil'];

//Barra de navegación del rol usuario. El estado del menú vive en el layout.
function NavbarUsuario({
  itemActivo,
  nombre,
  plan,
  ciudad = 'TUNJA',
  menuAbierto,
  onAlternarMenu,
}) {
  return (
    <header className={`contexto-oscuro ${styles.raiz}`}>
      <div className={styles.barra}>
        <div className={styles.marca}>
          <span className={styles.logo}>
            <IconoBicicleta />
          </span>
          <span className={styles.nombre}>
            Station<span className={styles.nombreAcento}>Bike</span>
          </span>
          <span className={styles.ciudad}>{ciudad}</span>
        </div>

        <button
          type="button"
          className={styles.botonMenu}
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
          aria-controls="usuario-menu"
          onClick={onAlternarMenu}
        >
          ☰
        </button>

        <div
          id="usuario-menu"
          className={menuAbierto ? `${styles.panel} ${styles.panelAbierto}` : styles.panel}
        >
          {/* Cuando exista React Router, estos botones pasan a ser <NavLink> */}
          <nav className={styles.menu}>
            {ENLACES.map((enlace) => {
              const activo = enlace === itemActivo;
              return (
                <button
                  key={enlace}
                  type="button"
                  className={activo ? `${styles.enlace} ${styles.enlaceActivo}` : styles.enlace}
                  aria-current={activo ? 'page' : undefined}
                >
                  {enlace}
                </button>
              );
            })}
          </nav>

          <div className={styles.perfil}>
            <div className={styles.datos}>
              <p className={styles.nombreUsuario}>{nombre}</p>
              <p className={styles.plan}>{plan}</p>
            </div>
            <span className={styles.avatar}>
              <IconoUsuario />
              <span className={`punto-vivo ${styles.indicador}`} aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavbarUsuario;