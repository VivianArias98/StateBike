import { useState, useEffect } from 'react';
import styles from './BotonInstalarPWA.module.css';

/**
 * Botón accesible para instalar StationBike como PWA nativa.
 * Escucha el evento estándar 'beforeinstallprompt' del navegador.
 * Solo se muestra si la app es instalable y aún no está instalada.
 */
function BotonInstalarPWA({ compacto = false, texto = 'Instalar App' }) {
  const [eventoPrompt, setEventoPrompt] = useState(null);
  const [instalada, setInstalada] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  });

  useEffect(() => {
    if (instalada) return;

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setEventoPrompt(e);
    };

    const handleAppInstalled = () => {
      setEventoPrompt(null);
      setInstalada(true);
      console.log('StationBike PWA: Aplicación instalada satisfactoriamente.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [instalada]);

  if (instalada || !eventoPrompt) {
    return null;
  }

  const handleInstalar = async () => {
    if (!eventoPrompt) return;
    eventoPrompt.prompt();
    const { outcome } = await eventoPrompt.userChoice;
    console.log('StationBike PWA elección del usuario:', outcome);
    setEventoPrompt(null);
  };

  return (
    <button
      type="button"
      onClick={handleInstalar}
      className={`boton ${compacto ? styles.compacto : styles.normal}`}
      aria-label="Instalar aplicación StationBike en tu dispositivo"
      title="Instalar StationBike en pantalla de inicio"
    >
      <span className={styles.icono} aria-hidden="true">📲</span>
      {!compacto && <span>{texto}</span>}
    </button>
  );
}

export default BotonInstalarPWA;
