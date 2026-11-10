import { useState } from 'react';
import NavbarUsuario from './components/NavbarUsuario.jsx';
import Footer from './components/Footer.jsx';
import styles from './UsuarioLayout.module.css';

const USUARIO = { nombre: 'Camila Rojas', plan: 'Plan Mensual Activo' };

function UsuarioLayout({ itemActivo, onCambiarSeccion, children }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className={styles.raiz} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Barra de navegación única */}
      <NavbarUsuario
        itemActivo={itemActivo}
        nombre={USUARIO.nombre}
        plan={USUARIO.plan}
        menuAbierto={menuAbierto}
        onAlternarMenu={() => setMenuAbierto(!menuAbierto)}
        onCambiarSeccion={onCambiarSeccion}
      />
      
      {/* Contenido principal */}
      <main className={styles.contenido} style={{ flex: 1 }}>
        {children}
      </main>
      
      {/* Pie de página */}
      <Footer />
    </div>
  );
}

export default UsuarioLayout;