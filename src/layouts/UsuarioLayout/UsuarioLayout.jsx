import { useState } from 'react';
import NavbarUsuario from './components/NavbarUsuario.jsx';
import PieUsuario from './components/PieUsuario.jsx';
import styles from './UsuarioLayout.module.css';

//Datos de ejemplo (vendrán de la sesión del usuario)
const USUARIO = { nombre: 'Camila Rojas', plan: 'Plan Mensual Activo' };

// Layout compartido de todas las pantallas del rol usuario.
// En pantallas pequeñas el menú está plegado y se abre con un botón.
function UsuarioLayout({ itemActivo, children }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className={styles.raiz}>
      <NavbarUsuario
        itemActivo={itemActivo}
        nombre={USUARIO.nombre}
        plan={USUARIO.plan}
        menuAbierto={menuAbierto}
        onAlternarMenu={() => setMenuAbierto(!menuAbierto)}
      />
      <main className={styles.contenido}>{children}</main>
      <PieUsuario />
    </div>
  );
}

export default UsuarioLayout;