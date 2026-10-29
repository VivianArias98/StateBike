import styles from './BicicletaForm.module.css';

function BicicletaForm() {
  return (
    <section className="tarjeta" aria-labelledby="bicicleta-form-titulo">
      <h2 id="bicicleta-form-titulo" className={styles.titulo}>
        Registrar bicicleta
      </h2>

      <div className={styles.campos}>
        <input
          type="text"
          className="input"
          placeholder="Código"
          aria-label="Código"
        />
        <input
          type="text"
          className="input"
          placeholder="Estación (solo activas con anclajes libres)"
          aria-label="Estación (solo activas con anclajes libres)"
        />
      </div>

      <button type="button" className="boton boton--primario boton--bloque">
        GUARDAR BICICLETA
      </button>

      <p className={styles.nota}>
        Estado y anclaje se asignan automáticamente.
      </p>
    </section>
  );
}

export default BicicletaForm;
