import { NavLink } from 'react-router-dom';
import {
  IconoMapa,
  IconoBicicleta,
  IconoBilletera,
  IconoTarjeta,
  IconoUsuario,
} from '../../../components/Iconos/Iconos.jsx';
import { useUsuario } from '../context/UsuarioContext.jsx';
import styles from './BarraNavegacionMovil.module.css';

const ELEMENTOS_MENU = [
  { id: 'inicio', texto: 'Inicio', ruta: '/inicio', Icono: IconoMapa },
  { id: 'viajes', texto: 'Viajes', ruta: '/viajes', Icono: IconoBicicleta, esViajes: true },
  { id: 'billetera', texto: 'Billetera', ruta: '/billetera', Icono: IconoBilletera },
  { id: 'plan', texto: 'Mi Plan', ruta: '/plan', Icono: IconoTarjeta },
  { id: 'perfil', texto: 'Perfil', ruta: '/perfil', Icono: IconoUsuario },
];

function BarraNavegacionMovil() {
  const { viajeActivo } = useUsuario();

  return (
    <nav className={styles.barra} aria-label="Navegación móvil inferior">
      {ELEMENTOS_MENU.map(({ id, texto, ruta, Icono, esViajes }) => (
        <NavLink
          key={id}
          to={ruta}
          className={({ isActive }) =>
            isActive ? `${styles.item} ${styles.itemActivo}` : styles.item
          }
        >
          <span className={styles.iconoContenedor}>
            <Icono />
            {esViajes && viajeActivo && (
              <span className={styles.puntoAlerta} aria-label="Viaje en curso" />
            )}
          </span>
          <span className={styles.etiqueta}>{texto}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BarraNavegacionMovil;
