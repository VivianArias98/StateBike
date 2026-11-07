import Logo from '../../../components/Logo/Logo.jsx';
import { IconoUsuario } from '../../../components/Iconos/Iconos.jsx';
import styles from './NavbarUsuario.module.css';

// Enlaces en el orden del diseño. itemActivo debe coincidir con uno de estos textos.
const ENLACES = ['Mi perfil', 'Mi plan', 'Mi billetera', 'Historial', 'Reportar incidencia', 'Viajes'];

// Barra de navegación del rol usuario. El logo viene de src/components/Logo.
// El estado del menú (plegado en celular) vive en UsuarioLayout.
function NavbarUsuario({ itemActivo, nombre, subtitulo, nfc, menuAbierto, onAlternarMenu }) {
  return (
    <header className={`contexto-oscuro ${styles.raiz}`}>
      <div className={styles.barra}>
        <div className={styles.marca}>
          <Logo altura="3.75rem" variante="oscuro" />
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
          {/* Cuando exista React Router, estos botones pasan a ser <NavLink> */}
          <nav className={styles.menu} aria-label="Navegación principal">
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

          <div className={styles.derecha}>
            <p className={styles.nfc}>
              <span className="punto-vivo" aria-hidden="true" />
              NFC: ACTIVO · <span className={styles.nfcId}>#{nfc}</span>
            </p>

            <div className={styles.perfil}>
              <span className={styles.avatar} aria-hidden="true">
                <IconoUsuario />
              </span>
              <div className={styles.datos}>
                <p className={styles.nombreUsuario}>{nombre}</p>
                <p className={styles.subtitulo}>{subtitulo}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavbarUsuario;
