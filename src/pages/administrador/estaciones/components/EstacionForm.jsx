import styles from './EstacionForm.module.css';

function EstacionForm({ modo, valores, idTexto, onCambio, onSubmit, onCancelar, error }) {
  const editando = modo === 'editar';

  return (
    <form className={`tarjeta ${styles.raiz}`} onSubmit={onSubmit} noValidate>
      <h2 className={styles.titulo}>Datos de la estación</h2>

      {editando && (
        <div className="campo">
          <label htmlFor="estacion-id">Identificador de la estación</label>
          <input className="input" id="estacion-id" type="text" value={idTexto} disabled />
        </div>
      )}

      <div className="campo">
        <label htmlFor="estacion-nombre">Nombre de la estación</label>
        <input
          className="input"
          id="estacion-nombre"
          type="text"
          placeholder="Nombre de la estación"
          value={valores.nombre}
          onChange={(e) => onCambio('nombre', e.target.value)}
        />
      </div>

      <div className="campo">
        <label htmlFor="estacion-direccion">Dirección de la estación</label>
        <input
          className="input"
          id="estacion-direccion"
          type="text"
          placeholder="Carrera o calle y número"
          value={valores.direccion}
          onChange={(e) => onCambio('direccion', e.target.value)}
        />
      </div>

      <div className="campo">
        <label htmlFor="estacion-capacidad">
          {editando ? 'Número de anclajes' : 'Capacidad máxima de puestos'}
        </label>
        <input
          className="input"
          id="estacion-capacidad"
          type="number"
          min="1"
          placeholder="Número de puestos"
          value={valores.capacidad}
          disabled={editando}
          onChange={(e) => onCambio('capacidad', e.target.value)}
        />
      </div>

      {error && (
        <p className="mensaje-error" role="alert">
          {error}
        </p>
      )}

      <div className={styles.acciones}>
        <button type="submit" className="boton boton--primario">
          {editando ? 'ACTUALIZAR DATOS' : 'GUARDAR ESTACIÓN'}
        </button>
        <button type="button" className={`enlace ${styles.cancelar}`} onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default EstacionForm;