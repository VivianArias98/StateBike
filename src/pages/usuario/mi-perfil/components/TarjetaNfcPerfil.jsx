import { useState } from 'react';
import Etiqueta from '../../../../components/Etiqueta/Etiqueta.jsx';
import {
  IconoBloqueo,
  IconoCandado,
  IconoDesbloqueo,
  IconoNfc,
  IconoTarjeta,
} from '../../../../components/Iconos/Iconos.jsx';
import { formatearFechaBogota } from '../../../../utils/formatoMoneda.js';
import styles from './TarjetaNfcPerfil.module.css';

const ESTADOS = { ACTIVA: 'ACTIVA', BLOQUEADA: 'BLOQUEADA', SIN_VINCULAR: 'SIN VINCULAR' };

// Tarjeta NFC del usuario (HU_1): estado, últimos 4 dígitos y bloqueo / desbloqueo con confirmación.
// Solo dibuja; la llamada al backend la hace la página con onBloquear / onDesbloquear.
function TarjetaNfcPerfil({
  estado,
  ultimos,
  titular,
  fechaVinculacion,
  procesando,
  error,
  onBloquear,
  onDesbloquear,
}) {
  // La HU pide confirmar antes de cambiar el estado de la tarjeta
  const [confirmando, setConfirmando] = useState(false);

  const sinVincular = estado === ESTADOS.SIN_VINCULAR || !estado;
  const bloqueada = estado === ESTADOS.BLOQUEADA;
  const textoAccion = bloqueada ? 'Desbloquear Tarjeta NFC' : 'Bloquear Tarjeta NFC';

  const confirmar = () => {
    setConfirmando(false);
    if (bloqueada) onDesbloquear();
    else onBloquear();
  };

  return (
    <section className={`tarjeta ${styles.raiz}`} aria-labelledby="tarjeta-nfc-titulo">
      <header className={styles.cabecera}>
        <div className={styles.izquierda}>
          <span className={styles.icono} aria-hidden="true">
            <IconoTarjeta />
          </span>
          <h2 id="tarjeta-nfc-titulo" className={styles.titulo}>
            Tarjeta NFC
          </h2>
        </div>
        <Etiqueta texto={sinVincular ? ESTADOS.SIN_VINCULAR : estado} color={bloqueada ? 'amarilla' : 'menta'} />
      </header>

      {sinVincular ? (
        <p className={styles.aviso}>No tiene una tarjeta NFC vinculada</p>
      ) : (
        <div className={`contexto-oscuro ${styles.tarjetaFisica}`}>
          <div className={styles.filaSuperior}>
            <span className={styles.marca}>
              <IconoNfc /> STATION PASS
            </span>
            <span className={bloqueada ? `${styles.activa} ${styles.bloqueada}` : styles.activa}>
              {!bloqueada && <span className={styles.punto} aria-hidden="true" />}
              {estado}
            </span>
          </div>

          <div>
            <p className={styles.etiquetaNumero}>Últimos dígitos</p>
            <p className={styles.numero}>•••• •••• {ultimos}</p>
          </div>

          <div className={styles.filaInferior}>
            <span>Titular: {titular}</span>
            {fechaVinculacion && <span>Vinculada: {formatearFechaBogota(fechaVinculacion, { conHora: false })}</span>}
          </div>
        </div>
      )}

      <p className={styles.aviso}>
        <span className={styles.iconoAviso} aria-hidden="true">
          <IconoCandado />
        </span>
        <span>
          Una tarjeta bloqueada no desbloquea anclajes ni bicicletas, pero tu plan activo seguirá vigente. No es posible
          bloquear la tarjeta mientras tengas un viaje en curso.
        </span>
      </p>

      {error && (
        <p className="mensaje-error" role="alert">
          {error}
        </p>
      )}

      {!sinVincular &&
        (confirmando ? (
          <div className={styles.confirmacion}>
            <p>¿Seguro que desea {bloqueada ? 'desbloquear' : 'bloquear'} su tarjeta NFC?</p>
            <div className={styles.accionesConfirmacion}>
              <button type="button" className="boton boton--acento" onClick={confirmar}>
                Confirmar
              </button>
              <button type="button" className="boton" onClick={() => setConfirmando(false)}>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className={`boton boton--bloque ${styles.bloquear}`}
            onClick={() => setConfirmando(true)}
            disabled={procesando}
          >
            {bloqueada ? <IconoDesbloqueo /> : <IconoBloqueo />} {procesando ? 'Procesando...' : textoAccion}
          </button>
        ))}
    </section>
  );
}

export default TarjetaNfcPerfil;
