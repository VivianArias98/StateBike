import { useState, useEffect } from 'react';
import AvatarAdmin from './AvatarAdmin.jsx';
import { AVATARES_ADMIN } from './catalogoAvataresAdmin.js';
import styles from './ModalSelectorAvatarAdmin.module.css';

/**
 * Modal interactivo para que el Administrador escoja su avatar formal/ejecutivo.
 * Opciones de mujeres y hombres vestidos de manera elegante para la supervisión de StationBike.
 */
function ModalSelectorAvatarAdmin({ avatarActual, abierto, onCerrar, onSeleccionar }) {
  const [seleccionado, setSeleccionado] = useState(avatarActual || 'admin-mujer-1');
  const [filtro, setFiltro] = useState('TODOS');

  useEffect(() => {
    if (abierto) {
      setSeleccionado(avatarActual || 'admin-mujer-1');
    }
  }, [abierto, avatarActual]);

  if (!abierto) return null;

  const avataresFiltrados = AVATARES_ADMIN.filter((a) => {
    if (filtro === 'MUJERES') return a.genero === 'Mujer';
    if (filtro === 'HOMBRES') return a.genero === 'Hombre';
    return true;
  });

  const handleGuardar = () => {
    onSeleccionar(seleccionado);
    onCerrar();
  };

  return (
    <div className={styles.telon} role="dialog" aria-modal="true" aria-labelledby="modal-admin-avatar-titulo">
      <div className={styles.modal}>
        <header className={styles.cabecera}>
          <div className={styles.titulos}>
            <h2 id="modal-admin-avatar-titulo" className={styles.titulo}>
              Escoge tu avatar administrativo
            </h2>
            <p className={styles.subtitulo}>
              Selecciona tu representación ejecutiva formal para el panel de control de StationBike
            </p>
          </div>
          <button
            type="button"
            className={styles.botonCerrar}
            onClick={onCerrar}
            aria-label="Cerrar selector de avatar administrativo"
          >
            ×
          </button>
        </header>

        <div className={styles.filtros}>
          <button
            type="button"
            className={`${styles.botonFiltro} ${filtro === 'TODOS' ? styles.botonFiltroActivo : ''}`}
            onClick={() => setFiltro('TODOS')}
          >
            Todos ({AVATARES_ADMIN.length})
          </button>
          <button
            type="button"
            className={`${styles.botonFiltro} ${filtro === 'MUJERES' ? styles.botonFiltroActivo : ''}`}
            onClick={() => setFiltro('MUJERES')}
          >
            Mujeres ejecutivas
          </button>
          <button
            type="button"
            className={`${styles.botonFiltro} ${filtro === 'HOMBRES' ? styles.botonFiltroActivo : ''}`}
            onClick={() => setFiltro('HOMBRES')}
          >
            Hombres ejecutivos
          </button>
        </div>

        <div className={styles.rejilla}>
          {avataresFiltrados.map((avatar) => {
            const esSeleccionado = seleccionado === avatar.id;
            const esActual = avatarActual === avatar.id;

            return (
              <button
                key={avatar.id}
                type="button"
                className={`${styles.tarjetaAvatar} ${esSeleccionado ? styles.tarjetaAvatarActiva : ''} ${
                  esActual && !esSeleccionado ? styles.tarjetaAvatarActual : ''
                }`}
                onClick={() => setSeleccionado(avatar.id)}
                aria-pressed={esSeleccionado}
              >
                {esSeleccionado && (
                  <span className={styles.checkSeleccion} aria-hidden="true">
                    ✓
                  </span>
                )}
                <AvatarAdmin id={avatar.id} tamano="l" />
                <h3 className={styles.nombreAvatar}>{avatar.nombre}</h3>
              </button>
            );
          })}
        </div>

        <footer className={styles.pie}>
          <button type="button" className="boton" onClick={onCerrar}>
            Cancelar
          </button>
          <button
            type="button"
            className={`boton boton--primario ${styles.botonGuardar}`}
            onClick={handleGuardar}
          >
            Usar este avatar
          </button>
        </footer>
      </div>
    </div>
  );
}

export default ModalSelectorAvatarAdmin;

