import { useState } from 'react';
import styles from './AdminLayout.module.css';

const MENU = [
  'Panel de control',
  'Estaciones',
  'Bicicletas',
  'Planes y tarifas',
  'Incidencias',
];

// Layout compartido del panel de administración.
// En pantallas pequeñas el menú está plegado y se abre con un botón.
function AdminLayout({ itemActivo, children }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className={styles.raiz}>
      <aside className={styles.sidebar}>
        <div className={styles.cabecera}>
          <p className={styles.titulo}>Panel Admin</p>

          <button
            type="button"
            className={styles.botonMenu}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuAbierto}
            aria-controls="admin-menu"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            ☰
          </button>
        </div>

        <div
          id="admin-menu"
          className={menuAbierto ? `${styles.panel} ${styles.panelAbierto}` : styles.panel}
        >
          <nav className={styles.menu}>
            {MENU.map((item) => {
              const activo = item === itemActivo;
              return (
                <button
                  key={item}
                  type="button"
                  className={activo ? `${styles.item} ${styles.itemActivo}` : styles.item}
                  aria-current={activo ? 'page' : undefined}
                >
                  {item}
                </button>
              );
            })}
          </nav>

          <div className={styles.pie}>
            <button type="button" className={`enlace ${styles.salir}`}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      <main className={styles.contenido}>{children}</main>
    </div>
  );
}

export default AdminLayout;
