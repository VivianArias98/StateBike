import { useState } from 'react';
import NavbarUsuario from '../../pages/usuario/components/NavbarUsuario.jsx';
import BarraNavegacionMovil from '../../pages/usuario/components/BarraNavegacionMovil.jsx';
import Footer from '../../pages/usuario/components/Footer.jsx';
import styles from './UsuarioLayout.module.css';

// Layout compartido de todas las pantallas del rol usuario.
// En pantallas pequeñas cuenta con barra de navegación inferior móvil (Bottom Navigation Bar).
function UsuarioLayout({ children, itemActivo }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className={styles.raiz}>
      <NavbarUsuario
        itemActivo={itemActivo}
        menuAbierto={menuAbierto}
        onAlternarMenu={() => setMenuAbierto(!menuAbierto)}
      />
      <main className={styles.contenido}>{children}</main>
      <Footer />
      <BarraNavegacionMovil />
    </div>
  );
}

export default UsuarioLayout;
