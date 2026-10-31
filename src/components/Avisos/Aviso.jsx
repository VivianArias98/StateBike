import { useEffect } from 'react';
import styles from './Aviso.module.css';

// Mensaje flotante que se cierra solo
function Aviso({ mensaje, onCerrar }) {
  useEffect(() => {
    if (!mensaje) return;
    const temporizador = setTimeout(onCerrar, 3500);
    return () => clearTimeout(temporizador);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mensaje]);

  if (!mensaje) return null;

  return (
    <div className={styles.raiz} role="status">
      {mensaje}
    </div>
  );
}

export default Aviso;