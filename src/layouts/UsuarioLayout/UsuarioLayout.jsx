import { useState } from 'react';
import NavbarUsuario from '../../pages/usuario/components/NavbarUsuario.jsx';
import Footer from '../../pages/usuario/components/Footer.jsx';
import { USUARIO } from '../../pages/usuario/datos.js';
import styles from './UsuarioLayout.module.css';

// Layout compartido de todas las pantallas del rol usuario.
// En pantallas pequeñas el menú está plegado y se abre con un botón.
function UsuarioLayout({ itemActivo, children }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className={styles.raiz}>
      <NavbarUsuario
        itemActivo={itemActivo}
        nombre={USUARIO.nombre}
        subtitulo={USUARIO.subtitulo}
        nfc={USUARIO.nfc}
        menuAbierto={menuAbierto}
        onAlternarMenu={() => setMenuAbierto(!menuAbierto)}
      />
      <main className={styles.contenido}>{children}</main>
      <Footer />
    </div>
  );
}

export default UsuarioLayout;
