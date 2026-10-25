import './BicicletaForm.css';

function BicicletaForm() {
  return (
    <section className="bicicleta-form" aria-labelledby="bicicleta-form-titulo">
      <h2 id="bicicleta-form-titulo" className="bicicleta-form__titulo">
        Registrar bicicleta
      </h2>

      <div className="bicicleta-form__campos">
        <input
          type="text"
          className="bicicleta-form__input"
          placeholder="Código"
          aria-label="Código"
        />
        <input
          type="text"
          className="bicicleta-form__input"
          placeholder="Estación (solo activas con anclajes libres)"
          aria-label="Estación (solo activas con anclajes libres)"
        />
      </div>

      <button type="button" className="bicicleta-form__guardar">
        GUARDAR BICICLETA
      </button>

      <p className="bicicleta-form__nota">
        Estado y anclaje se asignan automáticamente.
      </p>
    </section>
  );
}

export default BicicletaForm;
