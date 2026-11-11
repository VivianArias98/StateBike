import React from 'react';
import styles from './TarjetaIndicador.module.css';

// Tarjeta con un indicador numérico de alta presentación
function TarjetaIndicador({ titulo, valor, etiqueta, vivo = false, enlace, onClicEnlace, icono }) {
  return (
    <article className={styles.raiz}>
      <div className={styles.superior}>
        <div className={styles.titulos}>
          <h2 className={styles.titulo}>{titulo}</h2>
          {etiqueta}
        </div>
        {icono ? (
          <div className={styles.iconoCaja}>{icono}</div>
        ) : (
          vivo && <span className="punto-vivo" aria-hidden="true" />
        )}
      </div>

      <div className={styles.inferior}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--espacio-2)' }}>
          <p className={styles.valor}>{valor}</p>
          {vivo && icono && <span className="punto-vivo" title="Operación en vivo" aria-hidden="true" />}
        </div>
        {enlace && (
          <button type="button" className={`enlace ${styles.enlace}`} onClick={onClicEnlace}>
            {enlace}
          </button>
        )}
      </div>
    </article>
  );
}

export default TarjetaIndicador;
