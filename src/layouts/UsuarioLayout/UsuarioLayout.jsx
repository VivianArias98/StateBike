import React, { useState } from 'react';
import NavbarUsuario from '../../pages/usuario/components/NavbarUsuario.jsx';
import Footer from '../../pages/usuario/components/Footer.jsx';
import styles from './UsuarioLayout.module.css';

// Layout compartido de todas las pantallas del rol usuario.
// En pantallas pequeñas el menú está plegado y se abre con un botón.
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
    </div>
  );
}

export default UsuarioLayout;
