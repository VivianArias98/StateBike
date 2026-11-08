import { useState } from 'react';
import styles from './BicicletaForm.module.css';

function BicicletaForm({ estacionesDisponibles = [], onRegistrar, cargando = false }) {
  const [codigo, setCodigo] = useState('');
  const [estacionId, setEstacionId] = useState('');
  const [errorLocal, setErrorLocal] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorLocal('');

    const codigoLimpio = codigo.trim();
    if (!codigoLimpio || !estacionId) {
      setErrorLocal('Campos obligatorios vacíos');
      return;
    }

    if (codigoLimpio.length > 20) {
      setErrorLocal('Código de bicicleta inválido (máximo 20 caracteres)');
      return;
    }

    try {
      await onRegistrar({
        codigo: codigoLimpio,
        estacionId: Number(estacionId),
      });
      setCodigo('');
      setEstacionId('');
    } catch (err) {
      setErrorLocal(err.message || 'Error al registrar bicicleta');
    }
  };

  return (
    <section className="tarjeta" aria-labelledby="bicicleta-form-titulo">
      <h2 id="bicicleta-form-titulo" className={styles.titulo}>
        Registrar bicicleta
      </h2>

      {errorLocal && (
        <div className={styles.error} role="alert">
          {errorLocal}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.campos}>
          <input
            type="text"
            className="input"
            placeholder="Código (ej. BIC-010)"
            aria-label="Código de la bicicleta"
            maxLength={20}
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />

          <select
            className="input"
            aria-label="Estación con anclajes libres"
            value={estacionId}
            onChange={(e) => setEstacionId(e.target.value)}
          >
            <option value="">Seleccione estación con anclajes libres...</option>
            {estacionesDisponibles.map((est) => {
              const libres = est.anclajesLibres ?? (est.anclajes - (est.anclajesOcupados || 0));
              return (
                <option key={est.id} value={est.id}>
                  {est.nombre} ({libres} {libres === 1 ? 'anclaje libre' : 'anclajes libres'})
                </option>
              );
            })}
          </select>
        </div>

        <button
          type="submit"
          className="boton boton--primario boton--bloque"
          disabled={cargando}
        >
          {cargando ? 'GUARDANDO...' : 'GUARDAR BICICLETA'}
        </button>

        <p className={styles.nota}>
          Estado y anclaje se asignan automáticamente.
        </p>
      </form>
    </section>
  );
}

export default BicicletaForm;
