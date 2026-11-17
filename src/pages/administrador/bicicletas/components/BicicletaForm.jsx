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
    if (!codigoLimpio) {
      setErrorLocal('El código de la bicicleta es obligatorio');
      document.getElementById('bicicleta-codigo')?.focus();
      return;
    }

    if (!estacionId) {
      setErrorLocal('Debe seleccionar una estación con anclajes libres');
      document.getElementById('bicicleta-estacion')?.focus();
      return;
    }

    if (codigoLimpio.length > 20) {
      setErrorLocal('Código de bicicleta inválido (máximo 20 caracteres)');
      document.getElementById('bicicleta-codigo')?.focus();
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

  const esErrorCodigo = Boolean(errorLocal && (!codigo.trim() || errorLocal.toLowerCase().includes('código')));
  const esErrorEstacion = Boolean(errorLocal && (!estacionId || errorLocal.toLowerCase().includes('estación')));

  return (
    <section className="tarjeta" aria-labelledby="bicicleta-form-titulo">
      <h2 id="bicicleta-form-titulo" className={styles.titulo}>
        Registrar bicicleta
      </h2>

      {errorLocal && (
        <div id="bicicleta-error" className={styles.error} role="alert">
          {errorLocal}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.campos}>
          <div className={styles.campoGrupo}>
            <label htmlFor="bicicleta-codigo" className={styles.etiquetaCampo}>
              Código de la bicicleta <span aria-hidden="true">*</span>
            </label>
            <input
              id="bicicleta-codigo"
              type="text"
              className="input"
              placeholder="Ej. BIC-010"
              maxLength={20}
              required
              aria-required="true"
              aria-invalid={esErrorCodigo}
              aria-describedby={errorLocal ? 'bicicleta-error' : undefined}
              value={codigo}
              onChange={(e) => {
                if (errorLocal) setErrorLocal('');
                setCodigo(e.target.value);
              }}
            />
          </div>

          <div className={styles.campoGrupo}>
            <label htmlFor="bicicleta-estacion" className={styles.etiquetaCampo}>
              Estación inicial <span aria-hidden="true">*</span>
            </label>
            <select
              id="bicicleta-estacion"
              className="input"
              required
              aria-required="true"
              aria-invalid={esErrorEstacion}
              aria-describedby={errorLocal ? 'bicicleta-error' : undefined}
              value={estacionId}
              onChange={(e) => {
                if (errorLocal) setErrorLocal('');
                setEstacionId(e.target.value);
              }}
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
