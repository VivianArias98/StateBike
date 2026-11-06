import { useState } from 'react';
import FilaDato from '../../../components/FilaDato/FilaDato.jsx';
import { formatearCOP } from '../../../utils/formatoMoneda.js';
import { calcularCobroExceso } from '../../../utils/calculoViaje.js';
import styles from './ConfirmarDevolucion.module.css';

// Paso previo a finalizar el viaje: elegir la estación de destino y ver el cobro estimado.
function ConfirmarDevolucion({ viaje, segundos, estaciones, enviando, error, onConfirmar, onVolver }) {
  const [idEstacion, setIdEstacion] = useState('');
  const calculo = calcularCobroExceso({ segundosUsados: segundos, minutosIncluidos: viaje.minutosIncluidos });

  return (
    <div className={styles.raiz}>
      <header className={styles.encabezado}>
        <h1 className={styles.titulo}>Devolver bicicleta</h1>
        <p className={styles.subtitulo}>
          Elige la estación donde dejas la bicicleta y confirma para finalizar el viaje.
        </p>
      </header>

      <section className={`tarjeta ${styles.bloque}`}>
        <div className="campo">
          <label htmlFor="estacion-destino">Estación de destino</label>
          <select
            id="estacion-destino"
            className="input"
            value={idEstacion}
            onChange={(evento) => setIdEstacion(evento.target.value)}
          >
            <option value="">Selecciona una estación</option>
            {estaciones.map((estacion) => (
              <option key={estacion.id} value={estacion.id} disabled={estacion.anclajesLibres === 0}>
                {estacion.nombre} · {estacion.anclajesLibres} anclajes libres
              </option>
            ))}
          </select>
        </div>

        <dl>
          <FilaDato etiqueta="Tiempo usado" valor={`${calculo.minutosUsados} min`} />
          <FilaDato etiqueta="Tiempo incluido en el plan" valor={`${calculo.minutosIncluidos} min`} />
          <FilaDato etiqueta="Minutos de exceso" valor={`${calculo.minutosExceso} min`} />
          <FilaDato etiqueta="Valor por minuto de exceso" valor={`${formatearCOP(calculo.tarifaMinuto)} COP`} />
          <FilaDato
            etiqueta="Cobro estimado"
            valor={`${formatearCOP(calculo.cobro)} COP${calculo.topeAplicado ? ` (tope de ${formatearCOP(calculo.tope)} COP por viaje)` : ''}`}
            tono={calculo.cobro > 0 ? 'negativo' : 'normal'}
          />
        </dl>
      </section>

      {error && (
        <p className="mensaje-error" role="alert">
          {error}
        </p>
      )}

      <div className={styles.acciones}>
        <button type="button" className="boton" onClick={onVolver}>
          Volver al viaje
        </button>
        <button
          type="button"
          className="boton boton--acento"
          disabled={!idEstacion || enviando}
          onClick={() => onConfirmar(estaciones.find((e) => String(e.id) === idEstacion))}
        >
          {enviando ? 'Finalizando…' : 'Confirmar devolución'}
        </button>
      </div>
    </div>
  );
}

export default ConfirmarDevolucion;
