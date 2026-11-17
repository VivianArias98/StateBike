import styles from './PanelEncabezado.module.css';

function PanelEncabezado({ titulo, actualizado, onActualizar }) {
  return (
    <header className={`contexto-oscuro ${styles.raiz}`}>
      <h1 className={styles.titulo}>
        <span className="punto-vivo" aria-hidden="true" />
        {titulo}
      </h1>

      <div className={styles.acciones}>
        <span className={styles.actualizado}>{actualizado}</span>
        <button type="button" className="boton boton--s" onClick={onActualizar}>
          Actualizar ahora
        </button>
      </div>
    </header>
  );
}

export default PanelEncabezado;