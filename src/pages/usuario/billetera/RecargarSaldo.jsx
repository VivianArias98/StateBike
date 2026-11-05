import { useState } from 'react';
import EncabezadoPaso from './components/EncabezadoPaso.jsx';
import FilaDato from '../../../components/FilaDato/FilaDato.jsx';
import Etiqueta from '../../../components/Etiqueta/Etiqueta.jsx';
import { LIMITES_RECARGA } from './billeteraMock.js';
import { formatearCOP, formatearFechaHora } from '../../../utils/formatoMoneda.js';
import styles from './RecargarSaldo.module.css';

// Valida el monto escrito con los mensajes del requisito. Devuelve el error o '' si es válido.
function validarMonto(texto, saldo) {
  const { minimo, maximo, saldoMaximo } = LIMITES_RECARGA;
  const limpio = texto.trim();
  if (!limpio) return 'Campos obligatorios vacíos';
  if (!/^\d+$/.test(limpio) || Number(limpio) <= 0) return 'Monto inválido';
  const monto = Number(limpio);
  if (monto < minimo || monto > maximo) {
    return `El monto debe estar entre ${formatearCOP(minimo)} y ${formatearCOP(maximo)}`;
  }
  if (saldo + monto > saldoMaximo) {
    return `La recarga supera el saldo máximo permitido de ${formatearCOP(saldoMaximo)}`;
  }
  return '';
}

// Paso 1: elegir el monto. Paso 2: resumen y confirmación; después, el comprobante.
function RecargarSaldo({ saldo, cobroPendiente, comprobante, enviando, error, onConfirmar, onVolver }) {
  const [texto, setTexto] = useState('');
  const [errorLocal, setErrorLocal] = useState('');
  const [montoPorConfirmar, setMontoPorConfirmar] = useState(null); // número cuando se está en el resumen

  function continuar() {
    const mensaje = validarMonto(texto, saldo);
    setErrorLocal(mensaje);
    if (!mensaje) setMontoPorConfirmar(Number(texto.trim()));
  }

  // ---- Paso 2: resumen y confirmación ----
  if (montoPorConfirmar !== null && !comprobante) {
    return (
      <div className={styles.raiz}>
        <EncabezadoPaso
          titulo="Recargar Saldo"
          subtitulo="Paso 2 de 2: Confirma la recarga antes de acreditarla."
          paso="PASO 2 / 2"
          onVolver={onVolver}
        />
        <section className={`tarjeta ${styles.bloque}`}>
          <h2 className={styles.subtitulo}>Resumen de la recarga</h2>
          <dl>
            <FilaDato etiqueta="Saldo actual" valor={`${formatearCOP(saldo)} COP`} />
            <FilaDato etiqueta="Monto a recargar" valor={`+${formatearCOP(montoPorConfirmar)} COP`} tono="positivo" />
            <FilaDato etiqueta="Saldo resultante" valor={`${formatearCOP(saldo + montoPorConfirmar)} COP`} tono="positivo" />
          </dl>
          {error && (
            <p className="mensaje-error" role="alert">
              {error}
            </p>
          )}
          <div className={styles.acciones}>
            <button type="button" className="boton" onClick={() => setMontoPorConfirmar(null)}>
              Cancelar
            </button>
            <button
              type="button"
              className="boton boton--secundario"
              onClick={() => onConfirmar(montoPorConfirmar)}
              disabled={enviando}
            >
              {enviando ? 'Procesando…' : `Confirmar recarga de ${formatearCOP(montoPorConfirmar)} COP`}
            </button>
          </div>
        </section>
      </div>
    );
  }

  // ---- Paso 2: comprobante ----
  if (comprobante) {
    return (
      <div className={styles.raiz}>
        <EncabezadoPaso
          titulo="Recargar Saldo"
          subtitulo="Paso 2 de 2: Confirmación y comprobante de recarga."
          paso="PASO 2 / 2"
          onVolver={onVolver}
        />
        <div className={styles.columnas}>
          <section className={`tarjeta ${styles.bloque}`}>
            <Etiqueta texto="TRANSACCIÓN EXITOSA" color="verde" />
            <h2 className={styles.exito}>RECARGA EXITOSA</h2>
            <p>
              Se ha acreditado el monto correctamente a tu billetera y el movimiento ha sido
              registrado en el sistema.
            </p>
            <p className={styles.referencia}>REF: {comprobante.referencia}</p>
            {cobroPendiente && (
              <p className={styles.nota}>Tiene un cobro pendiente. Puede pagarlo desde MI BILLETERA</p>
            )}
            <button type="button" className="boton boton--secundario" onClick={onVolver}>
              Ir a Mi Billetera
            </button>
          </section>

          <section className={`tarjeta ${styles.bloque}`}>
            <h2 className={styles.subtitulo}>Detalle del movimiento</h2>
            <dl>
              <FilaDato etiqueta="Saldo anterior" valor={`${formatearCOP(comprobante.saldoAnterior)} COP`} />
              <FilaDato etiqueta="Monto recargado" valor={`+${formatearCOP(comprobante.monto)} COP`} tono="positivo" />
              <FilaDato etiqueta="Nuevo saldo disponible" valor={`${formatearCOP(comprobante.saldoNuevo)} COP`} tono="positivo" />
              <FilaDato etiqueta="Concepto registrado" valor="Recarga de saldo" />
                            <FilaDato etiqueta="Fecha y hora" valor={formatearFechaHora(comprobante.fecha)} />
              <FilaDato etiqueta="Estado" valor="Acreditado de inmediato" />
            </dl>
          </section>
        </div>
      </div>
    );
  }

  // ---- Paso 1: formulario ----
  const { minimo, maximo, saldoMaximo, sugeridos } = LIMITES_RECARGA;
  return (
    <div className={styles.raiz}>
      <EncabezadoPaso
        titulo="Recargar Saldo"
        subtitulo="Paso 1 de 2: Ingresa el monto que deseas recargar en tu billetera institucional."
        paso="PASO 1 / 2"
        onVolver={onVolver}
      />

      <section className={`tarjeta ${styles.bloque}`}>
        <p className={styles.saldoActual}>
          Saldo actual: <strong>{formatearCOP(saldo)} COP</strong>
        </p>

        <div className="campo">
          <label htmlFor="monto-recarga">Monto a recargar (COP) *</label>
          <input
            id="monto-recarga"
            className="input"
            type="text"
            inputMode="numeric"
            placeholder="20000"
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
            aria-invalid={Boolean(errorLocal)}
          />
          <span className={styles.ayuda}>
            Mínimo: {formatearCOP(minimo)} COP · Máximo por recarga: {formatearCOP(maximo)} COP ·
            Saldo máx: {formatearCOP(saldoMaximo)} COP
          </span>
        </div>

        {errorLocal && (
          <p className="mensaje-error" role="alert">
            {errorLocal}
          </p>
        )}

        <div>
          <h2 className={styles.subtitulo}>Montos sugeridos de selección rápida</h2>
          <div className={styles.sugeridos}>
            {sugeridos.map((opcion) => (
              <button
                key={opcion.valor}
                type="button"
                className={
                  Number(texto) === opcion.valor
                    ? `boton ${styles.sugerido} ${styles.sugeridoActivo}`
                    : `boton ${styles.sugerido}`
                }
                onClick={() => {
                  setTexto(String(opcion.valor));
                  setErrorLocal('');
                }}
              >
                <strong>{formatearCOP(opcion.valor)} COP</strong>
                <span className={styles.sugeridoNota}>{opcion.nota}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.acciones}>
          <button type="button" className="boton" onClick={onVolver}>
            Cancelar
          </button>
          <button type="button" className="boton boton--secundario" onClick={continuar}>
            CONTINUAR →
          </button>
        </div>
      </section>
    </div>
  );
}

export default RecargarSaldo;
