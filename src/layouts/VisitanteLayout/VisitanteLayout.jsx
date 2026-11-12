import { useState } from 'react';

import NavbarVisitante from '../../pages/visitante/components/NavbarVisitante.jsx';
import FooterVisitante from '../../pages/visitante/components/FooterVisitante.jsx';
import styles from './VisitanteLayout.module.css';

// Marco de todas las pantallas del visitante: navbar arriba, contenido y footer.
// Props:
//   itemActivo → nombre del enlace del navbar que se marca como activo
//   fondo      → 'claro' (verde, por defecto) | 'blanco' (pantalla del mapa)
function VisitanteLayout({ children, itemActivo, fondo = 'claro' }) {
  // El estado del menú móvil vive aquí, no en la pantalla
  const [menuAbierto, setMenuAbierto] = useState(false);

  const claseFondo =
    fondo === 'blanco' ? styles.principalBlanco : styles.principalClaro;

  return (
    <div className={styles.raiz}>
      <NavbarVisitante
        itemActivo={itemActivo}
        menuAbierto={menuAbierto}
        onAlternarMenu={() => setMenuAbierto((valor) => !valor)}
      />

      <main className={`${styles.principal} ${claseFondo}`}>
        {children}
      </main>

      <FooterVisitante />
    </div>
  );
}

export default VisitanteLayout;
