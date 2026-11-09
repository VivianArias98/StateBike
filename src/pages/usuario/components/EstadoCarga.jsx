import styles from './EstadoCarga.module.css';

// Estado de una pantalla mientras llegan los datos del backend:
// cargando, error (con botón para reintentar) o lista vacía.
function EstadoCarga({ cargando, error, vacio, onReintentar }) {
  if (cargando) {
    return (
      <p className={`tarjeta ${styles.raiz}`} role="status">
        Cargando...
      </p>
    );
  }

  if (error) {
    return (
      <div className={`tarjeta ${styles.raiz}`}>
        <p className="mensaje-error" role="alert">
          {error}
        </p>
        {onReintentar && (
          <button type="button" className="boton boton--s" onClick={onReintentar}>
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (vacio) {
    return <p className={`tarjeta ${styles.raiz}`}>{vacio}</p>;
  }

  return null;
}

export default EstadoCarga;
