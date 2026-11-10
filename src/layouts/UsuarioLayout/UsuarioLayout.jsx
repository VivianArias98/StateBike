import React, { useState } from 'react';
import NavbarUsuario from '../../pages/usuario/components/NavbarUsuario.jsx';
import Footer from '../../pages/usuario/components/Footer.jsx';
import { UsuarioProvider } from '../../pages/usuario/context/UsuarioContext.jsx';
import styles from './UsuarioLayout.module.css';

// Layout compartido de todas las pantallas del rol usuario.
// En pantallas pequeñas el menú está plegado y se abre con un botón.
function ContenidoLayout({ children }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className={styles.raiz}>
      <NavbarUsuario
        menuAbierto={menuAbierto}
        onAlternarMenu={() => setMenuAbierto(!menuAbierto)}
      />
      <main className={styles.contenido}>{children}</main>
      <Footer />
    </div>
  );
}

function UsuarioLayout({ children }) {
  return (
    <UsuarioProvider>
      <ContenidoLayout>{children}</ContenidoLayout>
    </UsuarioProvider>
  );
}

export default UsuarioLayout;
