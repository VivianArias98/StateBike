import './PlanForm.css';

function PlanForm() {
  return (
    <section className="plan-form" aria-labelledby="plan-form-titulo">
      <h2 id="plan-form-titulo" className="plan-form__titulo">
        Registrar o editar plan
      </h2>

      <div className="plan-form__campos">
        <input
          type="text"
          className="plan-form__input"
          placeholder="Nombre del plan"
          aria-label="Nombre del plan"
        />
        <input
          type="number"
          min="0"
          className="plan-form__input"
          placeholder="Costo base (COP)"
          aria-label="Costo base (COP)"
        />
        <input
          type="number"
          min="0"
          className="plan-form__input"
          placeholder="Tiempo de referencia (min)"
          aria-label="Tiempo de referencia (min)"
        />
      </div>

      <button type="button" className="plan-form__guardar">
        GUARDAR
      </button>

      <p className="plan-form__nota">
        Los cambios no afectan los planes ya adquiridos.
      </p>
    </section>
  );
}

export default PlanForm;
