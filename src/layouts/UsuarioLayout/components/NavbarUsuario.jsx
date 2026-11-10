import { IconoBicicleta, IconoUsuario } from '../../../components/Iconos/Iconos.jsx';
import styles from './NavbarUsuario.module.css';

const ENLACES = ['Viajes', 'Historial', 'Mi Perfil', 'Mi Plan', 'Mi Billetera', 'Reportar Incidencia'];

function NavbarUsuario({
  itemActivo,
  nombre,
  plan,
  ciudad = 'TUNJA',
  menuAbierto,
  onAlternarMenu,
  onCambiarSeccion,
}) {
  const manejarClickEnlace = (enlace) => {
    if (!onCambiarSeccion) return;
    
    switch (enlace) {
      case 'Viajes':
        onCambiarSeccion('viajes');
        break;
      case 'Historial':
        onCambiarSeccion('historial');
        break;
      case 'Mi Perfil':
        onCambiarSeccion('mi-perfil');
        break;
      case 'Mi Plan':
        onCambiarSeccion('mi-plan');
        break;
      case 'Mi Billetera':
        onCambiarSeccion('mi-billetera');
        break;
      case 'Reportar Incidencia':
        onCambiarSeccion('incidencias');
        break;
      default:
        break;
    }
  };

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
          <nav className={styles.menu}>
            {ENLACES.map((enlace) => {
              const activo = 
                (enlace === 'Viajes' && itemActivo === 'viajes') ||
                (enlace === 'Historial' && itemActivo === 'historial') ||
                (enlace === 'Mi Perfil' && itemActivo === 'mi-perfil') ||
                (enlace === 'Mi Plan' && itemActivo === 'mi-plan') ||
                (enlace === 'Mi Billetera' && itemActivo === 'mi-billetera') ||
                (enlace === 'Reportar Incidencia' && itemActivo === 'incidencias');

              return (
                <button
                  key={enlace}
                  type="button"
                  className={activo ? `${styles.enlace} ${styles.enlaceActivo}` : styles.enlace}
                  aria-current={activo ? 'page' : undefined}
                  onClick={() => manejarClickEnlace(enlace)}
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