import styles from './PlanForm.module.css';

function PlanForm() {
  return (
    <section className="tarjeta" aria-labelledby="plan-form-titulo">
      <h2 id="plan-form-titulo" className={styles.titulo}>
        Registrar o editar plan
      </h2>

      <div className={styles.campos}>
        <input
          type="text"
          className="input"
          placeholder="Nombre del plan"
          aria-label="Nombre del plan"
        />
        <input
          type="number"
          min="0"
          className="input"
          placeholder="Costo base (COP)"
          aria-label="Costo base (COP)"
        />
        <input
          type="number"
          min="0"
          className="input"
          placeholder="Tiempo de referencia (min)"
          aria-label="Tiempo de referencia (min)"
        />
      </div>

      <button type="button" className="boton boton--primario boton--bloque">
        GUARDAR
      </button>

      <p className={styles.nota}>
        Los cambios no afectan los planes ya adquiridos.
      </p>
    </section>
  );
}

export default PlanForm;
