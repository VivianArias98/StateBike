import React from 'react';
import { useTema } from '../../context/TemaContext.jsx';
import styles from './BotonTema.module.css';

function IconoSol() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function IconoLuna() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function BotonTema({ compacto = false, texto = false, className = '', style = {} }) {
  const { alternarTema, esOscuro } = useTema();

  return (
    <button
      type="button"
      className={`${styles.botonTema} ${compacto ? styles.compacto : ''} ${className}`}
      onClick={alternarTema}
      style={style}
      title={esOscuro ? 'Modo Oscuro activo (clic para cambiar a modo claro)' : 'Modo Claro activo (clic para cambiar a modo oscuro)'}
      aria-label={esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <span className={styles.icono}>
        {esOscuro ? <IconoLuna /> : <IconoSol />}
      </span>
      {texto && (
        <span className={styles.etiqueta}>
          {esOscuro ? 'Modo Oscuro' : 'Modo Claro'}
        </span>
      )}
    </button>
  );
}

export default BotonTema;

