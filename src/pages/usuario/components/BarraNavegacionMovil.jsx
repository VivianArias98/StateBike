import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  IconoMapa,
  IconoBicicleta,
  IconoBilletera,
  IconoTarjeta,
  IconoReloj,
  IconoAlerta,
  IconoUsuario,
  IconoCerrar,
} from '../../../components/Iconos/Iconos.jsx';
import AvatarCiclista from '../../../components/AvataresCiclistas/AvatarCiclista.jsx';
import { useUsuario } from '../context/UsuarioContext.jsx';
import styles from './BarraNavegacionMovil.module.css';

// Todos los 7 módulos del navbar de usuario en el menú flotante móvil arrastrable
const ELEMENTOS_MENU = [
  { id: 'inicio', texto: 'Inicio y Estaciones', ruta: '/inicio', Icono: IconoMapa, desc: 'Mapa y anclajes en Tunja' },
  { id: 'viajes', texto: 'Viajes', ruta: '/viajes', Icono: IconoBicicleta, desc: 'Desbloqueo y cronómetro', esViajes: true },
  { id: 'billetera', texto: 'Mi Billetera', ruta: '/billetera', Icono: IconoBilletera, desc: 'Saldo y cobros' },
  { id: 'plan', texto: 'Mi Plan', ruta: '/plan', Icono: IconoTarjeta, desc: 'Suscripción activa' },
  { id: 'historial', texto: 'Historial', ruta: '/historial', Icono: IconoReloj, desc: 'Viajes y pagos' },
  { id: 'incidencias', texto: 'Reportar Incidencia', ruta: '/incidencias', Icono: IconoAlerta, desc: 'Novedades del servicio' },
  { id: 'perfil', texto: 'Mi Perfil', ruta: '/perfil', Icono: IconoUsuario, desc: 'Datos y tarjeta NFC' },
];

function BarraNavegacionMovil() {
  const [abierto, setAbierto] = useState(false);
  const [posicion, setPosicion] = useState(null);
  const [arrastrando, setArrastrando] = useState(false);
  const { viajeActivo, perfil } = useUsuario();
  const location = useLocation();

  const botonRef = useRef(null);
  const estadoArrastreRef = useRef({
    activo: false,
    startX: 0,
    startY: 0,
    elemX: 0,
    elemY: 0,
    haMovido: false,
  });

  // Cerrar el menú si cambia de ruta
  useEffect(() => {
    setAbierto(false);
  }, [location.pathname]);

  // Cerrar con tecla Escape
  useEffect(() => {
    if (!abierto) return;
    const alPresionarEsc = (e) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    window.addEventListener('keydown', alPresionarEsc);
    return () => window.removeEventListener('keydown', alPresionarEsc);
  }, [abierto]);

  // Reposicionar al cambiar tamaño de pantalla o rotación
  useEffect(() => {
    function alRedimensionar() {
      setPosicion((pos) => {
        if (!pos || !botonRef.current) return pos;
        const anchoBoton = botonRef.current.offsetWidth || 110;
        const altoBoton = botonRef.current.offsetHeight || 44;
        const margen = 12;
        const margenTop = 64;
        const maxLeft = Math.max(margen, window.innerWidth - anchoBoton - margen);
        const maxTop = Math.max(margenTop, window.innerHeight - altoBoton - margen);
        return {
          x: Math.max(margen, Math.min(pos.x, maxLeft)),
          y: Math.max(margenTop, Math.min(pos.y, maxTop)),
        };
      });
    }
    window.addEventListener('resize', alRedimensionar);
    return () => window.removeEventListener('resize', alRedimensionar);
  }, []);

  // Controladores de arrastre con Pointer Events (Touch y Mouse en móvil)
  const handlePointerDown = (e) => {
    if (abierto) return;
    const rect = botonRef.current?.getBoundingClientRect();
    if (!rect) return;

    estadoArrastreRef.current = {
      activo: true,
      startX: e.clientX,
      startY: e.clientY,
      elemX: rect.left,
      elemY: rect.top,
      haMovido: false,
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e) => {
    if (!estadoArrastreRef.current.activo) return;
    const deltaX = e.clientX - estadoArrastreRef.current.startX;
    const deltaY = e.clientY - estadoArrastreRef.current.startY;

    if (!estadoArrastreRef.current.haMovido && Math.hypot(deltaX, deltaY) > 5) {
      estadoArrastreRef.current.haMovido = true;
      setArrastrando(true);
    }

    if (estadoArrastreRef.current.haMovido) {
      const anchoBoton = botonRef.current?.offsetWidth || 110;
      const altoBoton = botonRef.current?.offsetHeight || 44;
      const margen = 12;
      const margenTop = 64;
      const margenBottom = 16;

      const maxLeft = window.innerWidth - anchoBoton - margen;
      const maxTop = window.innerHeight - altoBoton - margenBottom;

      let nuevoX = estadoArrastreRef.current.elemX + deltaX;
      let nuevoY = estadoArrastreRef.current.elemY + deltaY;

      nuevoX = Math.max(margen, Math.min(nuevoX, maxLeft));
      nuevoY = Math.max(margenTop, Math.min(nuevoY, maxTop));

      setPosicion({ x: Math.round(nuevoX), y: Math.round(nuevoY) });
    }
  };

  const handlePointerUp = (e) => {
    if (!estadoArrastreRef.current.activo) return;
    estadoArrastreRef.current.activo = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}

    if (estadoArrastreRef.current.haMovido) {
      setTimeout(() => setArrastrando(false), 50);
    } else {
      setArrastrando(false);
      setAbierto((prev) => !prev);
    }
  };

  const handlePointerCancel = () => {
    estadoArrastreRef.current.activo = false;
    setArrastrando(false);
  };

  // Posición dinámica asignada a variables CSS locales conforme a Guía CSS
  const estiloPosicion = posicion
    ? {
        '--fab-left': `${posicion.x}px`,
        '--fab-top': `${posicion.y}px`,
      }
    : undefined;

  return (
    <aside className={styles.contenedorFlotante} aria-label="Navegación móvil flotante">
      {/* Telón de fondo para cerrar al pulsar fuera */}
      {abierto && (
        <div
          className={styles.telon}
          onClick={() => setAbierto(false)}
          aria-hidden="true"
        />
      )}

      {/* Panel flotante modal con todas las opciones */}
      {abierto && (
        <div
          className={`tarjeta ${styles.panelFlotante}`}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de opciones de navegación"
        >
          <header className={styles.cabeceraPanel}>
            <div className={styles.infoUsuarioMovil}>
              <AvatarCiclista id={perfil?.avatar} tamano="s" />
              <div>
                <p className={styles.subtituloPanel}>{perfil?.nombreCompleto || 'Usuario'}</p>
                <h2 className={styles.tituloPanel}>Navegación</h2>
              </div>
            </div>
            <button
              type="button"
              className={styles.botonCerrar}
              onClick={() => setAbierto(false)}
              aria-label="Cerrar menú de navegación"
            >
              <IconoCerrar />
            </button>
          </header>

          <nav className={styles.lista}>
            {ELEMENTOS_MENU.map(({ id, texto, ruta, Icono, desc, esViajes }) => (
              <NavLink
                key={id}
                to={ruta}
                className={({ isActive }) =>
                  isActive ? `${styles.item} ${styles.itemActivo}` : styles.item
                }
                onClick={() => setAbierto(false)}
              >
                <span className={styles.iconoBox} aria-hidden="true">
                  <Icono />
                  {esViajes && viajeActivo && (
                    <span className={styles.puntoAlertaItem} />
                  )}
                </span>
                <div className={styles.info}>
                  <span className={styles.itemTexto}>{texto}</span>
                  <span className={styles.itemDesc}>{desc}</span>
                </div>
                {esViajes && viajeActivo && (
                  <span className={styles.badgeViajeEnCurso}>En curso</span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* Botón flotante disparador (FAB movible/arrastrable) */}
      <button
        ref={botonRef}
        type="button"
        style={estiloPosicion}
        className={`${styles.botonFlotante} ${abierto ? styles.botonFlotanteActivo : ''} ${
          posicion ? styles.posicionManual : ''
        } ${arrastrando ? styles.arrastrando : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        aria-expanded={abierto}
        aria-label={abierto ? 'Cerrar menú' : 'Abrir menú de navegación (arrastrable)'}
      >
        <span className={styles.iconoFab} aria-hidden="true">
          {abierto ? <IconoCerrar /> : <span>☰</span>}
        </span>
        <span className={styles.etiquetaFab}>{abierto ? 'Cerrar' : 'Menú'}</span>
        {!abierto && viajeActivo && (
          <span className={styles.puntoAlertaFab} aria-label="Viaje en curso activo" />
        )}
      </button>
    </aside>
  );
}

export default BarraNavegacionMovil;
