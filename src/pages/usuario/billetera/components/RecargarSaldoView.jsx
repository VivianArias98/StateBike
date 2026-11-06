import React, { useState } from 'react';
import styles from './RecargarSaldoView.module.css';

function RecargarSaldoView({ saldoActual, cobroPendiente, onVolver, onEjecutarRecarga }) {
  const [paso, setPaso] = useState(1);
  const [monto, setMonto] = useState(20000);
  const [resultadoRecarga, setResultadoRecarga] = useState(null);

  const handleContinuar = async () => {
    try {
      const res = await onEjecutarRecarga(monto);
      setResultadoRecarga({
        montoRecargado: monto,
        saldoAnterior: saldoActual,
        nuevoSaldo: saldoActual + monto,
        referencia: res?.referencia || 'TRX-994021',
        fecha: new Date().toLocaleString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      });
      setPaso(2);
    } catch (err) {
      alert(`Error procesando la recarga: ${err.message}`);
    }
  };

  if (paso === 2 && resultadoRecarga) {
    return (
      <div className={styles.raiz}>
        <button type="button" className="enlace" onClick={onVolver} style={{ marginBottom: 'var(--espacio-4)' }}>
          ← Volver a Mi Billetera
        </button>

        <header className={styles.saludo}>
          <p className={styles.migas}>TRANSACCIÓN EXITOSA #RC-2026-90412</p>
          <div className={styles.encabezadoTitulo}>
            <h1 className="titulo-pagina">Recargar Saldo</h1>
            <span className="insignia insignia--activa">● PASO 2 / 2</span>
          </div>
          <p className={styles.subtitulo}>Paso 2 de 2: Confirmación y comprobante de recarga.</p>
        </header>

        <div className={styles.gridPaso2}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--espacio-4)' }}>
            <article className="tarjeta">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--espacio-3)' }}>
                <span className="insignia insignia--activa" style={{ borderRadius: 'var(--radio-circulo)', padding: 'var(--espacio-2)' }}>✓</span>
                <div>
                  <strong style={{ fontSize: 'var(--texto-m)' }}>RECARGA EXITOSA ●</strong>
                  <p style={{ fontSize: 'var(--texto-xs)', color: 'var(--color-placeholder)', marginTop: 'var(--espacio-1)' }}>
                    Se ha acreditado el monto correctamente a tu billetera y el movimiento ha sido registrado en el sistema.
                  </p>
                </div>
                <span className="insignia insignia--neutra" style={{ marginLeft: 'auto', fontSize: 'var(--texto-xs)' }}>
                  REF: {resultadoRecarga.referencia}
                </span>
              </div>
            </article>

            {cobroPendiente && (
              <article className="tarjeta" style={{ borderLeft: '4px solid var(--color-error-borde)' }}>
                <p style={{ fontSize: 'var(--texto-s)' }}>
                  ℹ️ Tiene un cobro pendiente de <strong>${cobroPendiente.monto.toLocaleString()} COP</strong>. La recarga no debita cobros de forma automática; puede pagarlo desde <strong>MI BILLETERA</strong> con el botón <strong>Pagar Cobro Pendiente</strong>.
                </p>
                <span className="insignia insignia--inactiva" style={{ marginTop: 'var(--espacio-2)', fontSize: 'var(--texto-xs)' }}>
                  NOTA: LA RECARGA NO PASA EL COBRO DE FORMA AUTOMÁTICA.
                </span>
              </article>
            )}

            <article className="tarjeta">
              <p className={styles.subSeccionTitulo}>ACCIONES RÁPIDAS</p>
              <div style={{ display: 'flex', gap: 'var(--espacio-3)', flexWrap: 'wrap' }}>
                <button type="button" className="boton boton--secundario" onClick={onVolver}>
                  💳 IR A MI BILLETERA
                </button>
                <button type="button" className="boton" onClick={() => alert('Planes disponibles en el módulo Mi Plan')}>
                  🚲 ADQUIRIR UN PLAN
                </button>
              </div>
              <p style={{ fontSize: 'var(--texto-xs)', color: 'var(--color-placeholder)', marginTop: 'var(--espacio-3)', cursor: 'pointer' }}>
                📥 Descargar comprobante en PDF
              </p>
            </article>
          </div>

          <article className="tarjeta">
            <div className={styles.headerDetalle}>
              <span>📄 DETALLE DEL MOVIMIENTO</span>
              <span className="insignia insignia--neutra">[ COMPROBANTE REGISTRADO ]</span>
            </div>

            <div className={styles.detalleFila}>
              <span>Saldo anterior:</span>
              <span>${resultadoRecarga.saldoAnterior.toLocaleString()} COP</span>
            </div>
            <div className={styles.detalleFila}>
              <span>Monto recargado:</span>
              <strong style={{ color: 'var(--color-primario-texto)' }}>+${resultadoRecarga.montoRecargado.toLocaleString()} COP</strong>
            </div>
            <div className={styles.boxSaldoResultante}>
              <span>💳 Nuevo saldo disponible:</span>
              <strong>${resultadoRecarga.nuevoSaldo.toLocaleString()} COP</strong>
            </div>
            <div className={styles.detalleFila}>
              <span>Concepto registrado:</span>
              <span>Recarga de saldo</span>
            </div>
            <div className={styles.detalleFila}>
              <span>Canal de pago:</span>
              <span>PSE · Aprobado #77291</span>
            </div>
            <div className={styles.detalleFila}>
              <span>Fecha y hora:</span>
              <span>{resultadoRecarga.fecha}</span>
            </div>
            <div className={styles.detalleFila} style={{ border: 'none' }}>
              <span>Estado:</span>
              <span className="insignia insignia--activa">● ACREDITADO DE INMEDIATO</span>
            </div>
            <p style={{ fontSize: '10px', color: 'var(--color-placeholder)', marginTop: 'var(--espacio-3)', textAlign: 'center' }}>
              📡 NFC Sincronizado: Tarjeta activa para desanclaje · RED MUNICIPAL TUNJA
            </p>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.raiz}>
      <button type="button" className="enlace" onClick={onVolver} style={{ marginBottom: 'var(--espacio-4)' }}>
        ← Volver a Mi Billetera
      </button>

      <header className={styles.saludo}>
        <div className={styles.encabezadoTitulo}>
          <h1 className="titulo-pagina">Recargar Saldo</h1>
          <span className="insignia insignia--neutra">[ PASO 1 / 2 ]</span>
        </div>
        <p className={styles.subtitulo}>Paso 1 de 2: Ingresa el monto que deseas recargar en tu billetera institucional.</p>
      </header>

      <div className={styles.gridPaso2}>
        <article className="tarjeta">
          <div className={styles.estadoCuentaBox}>
            <div>
              <p className={styles.subSeccionTitulo}>ESTADO DE CUENTA</p>
              <p style={{ fontSize: 'var(--texto-l)', fontWeight: 700 }}>
                Saldo actual: ${saldoActual.toLocaleString()} COP
              </p>
            </div>
            <span className="insignia insignia--activa">● [ DISPONIBLE ]</span>
          </div>

          <div className="campo" style={{ margin: 'var(--espacio-4) 0' }}>
            <label htmlFor="montoInput">MONTO A RECARGAR (COP) *</label>
            <div style={{ position: 'relative' }}>
              <input
                id="montoInput"
                type="number"
                className="input"
                value={monto}
                onChange={(e) => setMonto(Number(e.target.value))}
                style={{ fontSize: 'var(--texto-xl)', fontWeight: 700, paddingLeft: 'var(--espacio-6)' }}
              />
              <span style={{ position: 'absolute', left: 'var(--espacio-3)', top: '50%', transform: 'translateY(-50%)', fontWeight: 700 }}>$</span>
              <span style={{ position: 'absolute', right: 'var(--espacio-3)', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-placeholder)', fontSize: 'var(--texto-xs)' }}>COP</span>
            </div>
          </div>

          <div className={styles.bannerInfoMonto}>
            <span>✓ Escribe libremente el monto o elige una opción predefinida abajo.</span>
            <small>• Valor entero positivo sin decimales ($100 - $500.000 COP). Saldo máx: $2.000.000 COP.</small>
          </div>

          <p className={styles.subSeccionTitulo} style={{ marginTop: 'var(--espacio-4)' }}>MONTOS SUGERIDOS DE SELECCIÓN RÁPIDA</p>
          <div className={styles.sugeridosGrid}>
            <button type="button" className={`boton ${monto === 10000 ? 'boton--secundario' : ''}`} onClick={() => setMonto(10000)}>
              $10.000 COP<br /><small style={{ fontSize: '10px' }}>Recarga básica</small>
            </button>
            <button type="button" className={`boton ${monto === 20000 ? 'boton--secundario' : ''}`} onClick={() => setMonto(20000)}>
              $20.000 COP<br /><small style={{ fontSize: '10px' }}>Frecuente</small>
            </button>
            <button type="button" className={`boton ${monto === 32000 ? 'boton--secundario' : ''}`} onClick={() => setMonto(32000)}>
              $32.000 COP<br /><small style={{ fontSize: '10px' }}>(plan mensual)</small>
            </button>
            <button type="button" className={`boton ${monto === 50000 ? 'boton--secundario' : ''}`} onClick={() => setMonto(50000)}>
              $50.000 COP<br /><small style={{ fontSize: '10px' }}>Larga duración</small>
            </button>
          </div>

          <div className={styles.accionesPieForm}>
            <button type="button" className="boton" onClick={onVolver}>[ CANCELAR ]</button>
            <button type="button" className="boton boton--secundario" onClick={handleContinuar}>[ CONTINUAR ] →</button>
          </div>
        </article>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--espacio-3)' }}>
          <article className="tarjeta">
            <p style={{ fontSize: 'var(--texto-xs)', color: 'var(--color-placeholder)' }}>
              ℹ️ La acreditación se realiza de forma directa en el saldo de StationBike una vez verificado el medio de pago.
            </p>
          </article>
          <article className="tarjeta">
            <strong style={{ fontSize: 'var(--texto-xs)' }}>🔄 SINCRONIZACIÓN</strong>
            <p style={{ fontSize: 'var(--texto-s)' }}>Actualización Inmediata en Docks</p>
          </article>
          <article className="tarjeta">
            <strong style={{ fontSize: 'var(--texto-xs)' }}>🛡️ SEGURIDAD BANCARIA</strong>
            <p style={{ fontSize: 'var(--texto-s)' }}>Cifrado PSE & Pasarela Directa</p>
          </article>
          <article className="tarjeta">
            <strong style={{ fontSize: 'var(--texto-xs)' }}>🚲 RED MUNICIPAL</strong>
            <p style={{ fontSize: 'var(--texto-s)' }}>Tunja - Estaciones Activas</p>
          </article>
        </div>
      </div>
    </div>
  );
}

export default RecargarSaldoView;