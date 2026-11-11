import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cerrarSesion } from '../../utils/auth.js';
import { leerSesion } from '../../utils/sesion.js';
import styles from './AdminLayout.module.css';

// Los 7 módulos oficiales del Rol Administrador según especificación
const MENU = [
  { nombre: 'Panel de control', ruta: '/admin' },
  { nombre: 'Estaciones', ruta: '/admin/estaciones' },
  { nombre: 'Bicicletas', ruta: '/admin/bicicletas' },
  { nombre: 'Planes y tarifas', ruta: '/admin/planes' },
  { nombre: 'Tarjetas NFC', ruta: '/admin/tarjetas' },
  { nombre: 'Incidencias', ruta: '/admin/incidencias' },
  { nombre: 'Cuentas', ruta: '/admin/cuentas' },
];

// Layout compartido del panel de administración.
// En pantallas pequeñas el menú está plegado y se abre con un botón.
function AdminLayout({ itemActivo, children }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  const sesion = leerSesion();
  const nombreAdmin = sesion?.usuario?.nombreCompleto || 'Administrador';

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
            <p className={styles.titulo}>Panel Admin</p>
            <p className={styles.subtitulo}>{nombreAdmin} · Gestión Central</p>
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
            {MENU.map(({ nombre, ruta, conPunto }) => {
              const activo = nombre === itemActivo;
              return (
                <button
                  key={nombre}
                  type="button"
                  className={activo ? `${styles.item} ${styles.itemActivo}` : styles.item}
                  aria-current={activo ? 'page' : undefined}
                  onClick={() => handleNavegar(ruta)}
                >
                  {nombre}
                  {conPunto && <span className="punto-vivo" aria-hidden="true" />}
                </button>
              );
            })}
          </nav>

          <div className={styles.pie}>
            <button
              type="button"
              className={`enlace ${styles.salir}`}
              onClick={handleCerrarSesion}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      <div className={styles.areaPrincipal}>
        <main className={styles.contenido}>{children}</main>
        {/* Footer idéntico al de visitante */}
        <footer className={`contexto-oscuro ${styles.footer}`}>
          <span className={styles.marcaFooter}>StationBike</span>
        </footer>
      </div>
    </div>
  );
}

export default AdminLayout;
