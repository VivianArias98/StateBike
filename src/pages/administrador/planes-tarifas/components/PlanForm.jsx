import { useState, useEffect } from 'react';
import styles from './PlanForm.module.css';

const VALORES_VACIOS = {
  nombre: '',
  costoBase: '',
  vigenciaDias: '',
  viajesPorDia: '',
  tiempoViajeMin: '',
  valorMinutoExceso: '',
};

function PlanForm({ planEditando, onGuardar, onCancelarEdicion, cargando = false }) {
  const [valores, setValores] = useState(VALORES_VACIOS);
  const [errorLocal, setErrorLocal] = useState('');

  useEffect(() => {
    if (planEditando) {
      setValores({
        nombre: planEditando.nombre ?? '',
        costoBase: planEditando.costoBase ?? '',
        vigenciaDias: planEditando.vigenciaDias ?? '',
        viajesPorDia: planEditando.viajesPorDia ?? '',
        tiempoViajeMin: planEditando.tiempoViajeMin ?? '',
        valorMinutoExceso: planEditando.valorMinutoExceso ?? '',
      });
      setErrorLocal('');
    } else {
      setValores(VALORES_VACIOS);
    }
  }, [planEditando]);

  const handleChange = (campo, valor) => {
    setValores((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorLocal('');

    const nombreLimpio = valores.nombre.trim();
    if (
      !nombreLimpio ||
      valores.costoBase === '' ||
      valores.vigenciaDias === '' ||
      valores.viajesPorDia === '' ||
      valores.tiempoViajeMin === '' ||
      valores.valorMinutoExceso === ''
    ) {
      setErrorLocal('Hay campos obligatorios vacíos');
      return;
    }

    const costo = Number(valores.costoBase);
    const vigencia = Number(valores.vigenciaDias);
    const viajes = Number(valores.viajesPorDia);
    const tiempo = Number(valores.tiempoViajeMin);
    const exceso = Number(valores.valorMinutoExceso);

    if (!Number.isInteger(costo) || costo < 100 || !Number.isInteger(exceso) || (exceso !== 0 && exceso < 100)) {
      setErrorLocal('Error: Verifique que el costo base sea un entero mínimo de $100 y el valor por minuto de exceso sea $0 o mínimo $100');
      return;
    }

    if (
      !Number.isInteger(vigencia) || vigencia <= 0 ||
      !Number.isInteger(viajes) || viajes <= 0 ||
      !Number.isInteger(tiempo) || tiempo <= 0
    ) {
      setErrorLocal('Error: La vigencia, los viajes por día y el tiempo por viaje deben ser números enteros mayores a cero');
      return;
    }

    try {
      await onGuardar({
        ...(planEditando ? { id: planEditando.id } : {}),
        nombre: nombreLimpio,
        costoBase: costo,
        vigenciaDias: vigencia,
        viajesPorDia: viajes,
        tiempoViajeMin: tiempo,
        valorMinutoExceso: exceso,
      });

      if (!planEditando) {
        setValores(VALORES_VACIOS);
      }
    } catch (err) {
      setErrorLocal(err.message || 'Error al guardar el plan');
    }
  };

  return (
    <section className="tarjeta" aria-labelledby="plan-form-titulo">
      <h2 id="plan-form-titulo" className={styles.titulo}>
        {planEditando ? 'Editar plan' : 'Registrar plan'}
      </h2>

      {errorLocal && (
        <div className={styles.error} role="alert">
          {errorLocal}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.campos}>
          <div className={styles.campoGrupo}>
            <label htmlFor="plan-nombre" className={styles.etiquetaCampo}>
              Nombre del plan
            </label>
            <input
              id="plan-nombre"
              type="text"
              className="input"
              placeholder="Ej. Pase Mensual"
              maxLength={50}
              value={valores.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
            />
          </div>

          <div className={styles.campoGrupo}>
            <label htmlFor="plan-costo" className={styles.etiquetaCampo}>
              Costo base (COP, mín. $100)
            </label>
            <input
              id="plan-costo"
              type="number"
              min="100"
              step="1"
              className="input"
              placeholder="Ej. 32000"
              value={valores.costoBase}
              onChange={(e) => handleChange('costoBase', e.target.value)}
            />
          </div>

          <div className={styles.campoGrupo}>
            <label htmlFor="plan-vigencia" className={styles.etiquetaCampo}>
              Vigencia (días enteros)
            </label>
            <input
              id="plan-vigencia"
              type="number"
              min="1"
              step="1"
              className="input"
              placeholder="Ej. 30"
              value={valores.vigenciaDias}
              onChange={(e) => handleChange('vigenciaDias', e.target.value)}
            />
          </div>

          <div className={styles.campoGrupo}>
            <label htmlFor="plan-viajes" className={styles.etiquetaCampo}>
              Viajes por día
            </label>
            <input
              id="plan-viajes"
              type="number"
              min="1"
              step="1"
              className="input"
              placeholder="Ej. 4"
              value={valores.viajesPorDia}
              onChange={(e) => handleChange('viajesPorDia', e.target.value)}
            />
          </div>

          <div className={styles.campoGrupo}>
            <label htmlFor="plan-tiempo" className={styles.etiquetaCampo}>
              Tiempo máx. por viaje (minutos)
            </label>
            <input
              id="plan-tiempo"
              type="number"
              min="1"
              step="1"
              className="input"
              placeholder="Ej. 45"
              value={valores.tiempoViajeMin}
              onChange={(e) => handleChange('tiempoViajeMin', e.target.value)}
            />
          </div>

          <div className={styles.campoGrupo}>
            <label htmlFor="plan-exceso" className={styles.etiquetaCampo}>
              Valor minuto exceso (COP, $0 o mín. $100)
            </label>
            <input
              id="plan-exceso"
              type="number"
              min="0"
              step="1"
              className="input"
              placeholder="Ej. 100"
              value={valores.valorMinutoExceso}
              onChange={(e) => handleChange('valorMinutoExceso', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.accionesForm}>
          <button
            type="submit"
            className="boton boton--primario boton--bloque"
            disabled={cargando}
          >
            {cargando ? 'GUARDANDO...' : planEditando ? 'ACTUALIZAR PLAN' : 'GUARDAR PLAN'}
          </button>

          {planEditando && (
            <button
              type="button"
              className="boton boton--secundario boton--bloque"
              onClick={onCancelarEdicion}
            >
              Cancelar edición
            </button>
          )}
        </div>

        <p className={styles.nota}>
          Los cambios no afectan los planes ya adquiridos.
        </p>
      </form>
    </section>
  );
}

export default PlanForm;
