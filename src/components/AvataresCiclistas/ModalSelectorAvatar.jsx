import { useState, useEffect } from 'react';
import AvatarCiclista from './AvatarCiclista.jsx';
import { AVATARES_CICLISTAS } from './catalogoAvatares.js';
import styles from './ModalSelectorAvatar.module.css';

/**
 * Modal interactivo para que el usuario escoja su avatar ciclista con casco.
 * HU_1: Personalización de perfil ciclista con opciones de mujeres y hombres.
 */
function ModalSelectorAvatar({ avatarActual, abierto, onCerrar, onSeleccionar }) {
  const [seleccionado, setSeleccionado] = useState(avatarActual || 'mujer-casco-1');
  const [filtro, setFiltro] = useState('TODOS');

  useEffect(() => {
    if (abierto) {
      setSeleccionado(avatarActual || 'mujer-casco-1');
    }
  }, [abierto, avatarActual]);

  if (!abierto) return null;

  const avataresFiltrados = AVATARES_CICLISTAS.filter((a) => {
    if (filtro === 'MUJERES') return a.genero === 'Mujer';
    if (filtro === 'HOMBRES') return a.genero === 'Hombre';
    return true;
  });

  const handleGuardar = () => {
    onSeleccionar(seleccionado);
    onCerrar();
  };

  return (
    <div className={styles.telon} role="dialog" aria-modal="true" aria-labelledby="modal-avatar-titulo">
      <div className={styles.modal}>
        <header className={styles.cabecera}>
          <div className={styles.titulos}>
            <h2 id="modal-avatar-titulo" className={styles.titulo}>
              Escoge tu avatar ciclista
            </h2>
            <p className={styles.subtitulo}>
              Elige el personaje con casco de bicicleta que te representará en StationBike
            </p>
          </div>
          <button
            type="button"
            className={styles.botonCerrar}
            onClick={onCerrar}
            aria-label="Cerrar selector de avatar"
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
            Todos ({AVATARES_CICLISTAS.length})
          </button>
          <button
            type="button"
            className={`${styles.botonFiltro} ${filtro === 'MUJERES' ? styles.botonFiltroActivo : ''}`}
            onClick={() => setFiltro('MUJERES')}
          >
            Mujeres con casco
          </button>
          <button
            type="button"
            className={`${styles.botonFiltro} ${filtro === 'HOMBRES' ? styles.botonFiltroActivo : ''}`}
            onClick={() => setFiltro('HOMBRES')}
          >
            Hombres con casco
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
                <AvatarCiclista id={avatar.id} tamano="l" />
                <h3 className={styles.nombreAvatar}>{avatar.nombre}</h3>
                <p className={styles.descripcionAvatar}>{avatar.descripcion}</p>
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

export default ModalSelectorAvatar;

