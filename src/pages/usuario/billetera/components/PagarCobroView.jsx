import React, { useState } from 'react';
import styles from './PagarCobroView.module.css';

function PagarCobroView({ billetera, onVolver, onEjecutarPago }) {
  const [paso, setPaso] = useState(1);
  const [comprobante, setComprobante] = useState(null);

  const cobro = billetera?.cobroPendiente || { monto: 2500, concepto: 'Exceso de tiempo', viaje: '#VIAJE-8831' };
  const saldoActual = billetera?.saldo || 35000;
  const saldoRestante = saldoActual - cobro.monto;

  const handleConfirmarPago = async () => {
    try {
      await onEjecutarPago();
      setComprobante({
        ref: 'CP-PAGADO-9912',
        monto: cobro.monto,
        saldoAnterior: saldoActual,
        nuevoSaldo: saldoRestante,
        fecha: new Date().toLocaleString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      });
      setPaso(2);
    } catch (err) {
      alert(`Error procesando el pago: ${err.message}`);
    }
  };

  if (paso === 2 && comprobante) {
    return (
      <div className={styles.raiz}>
        <button type="button" className="enlace" onClick={onVolver} style={{ marginBottom: 'var(--espacio-4)' }}>
          ← VOLVER A MI BILLETERA
        </button>

        <header className={styles.saludo}>
          <p className={styles.migas}>MÓDULO DE CONCILIACIÓN · TUNJA</p>
          <div className={styles.encabezadoTitulo}>
            <h1 className="titulo-pagina">Pagar Cobro Pendiente</h1>
            <span className="insignia insignia--neutra">[ PASO 2 DE 2: COMPROBANTE DE PAGO EXITOSO Y CUENTA AL DÍA ]</span>
          </div>
        </header>

        <div className={styles.gridPaso2}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--espacio-4)' }}>
            <article className="tarjeta">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--espacio-3)' }}>
                <span className="insignia insignia--activa" style={{ borderRadius: 'var(--radio-circulo)', padding: 'var(--espacio-2)' }}>✓</span>
                <div>
                  <p style={{ fontSize: '10px', color: 'var(--color-placeholder)' }}>[ ESTADO_OPERACIÓN: ÉXITO ] ● TRANSACCIÓN APROBADA</p>
                  <strong style={{ fontSize: 'var(--texto-l)' }}>Cobro pendiente pagado correctamente</strong>
                  <p style={{ fontSize: 'var(--texto-s)', color: 'var(--color-placeholder)', marginTop: 'var(--espacio-1)' }}>
                    El cobro por exceso de tiempo ha sido debitado de su billetera. Su cuenta se encuentra al día y ya puede desbloquear bicicletas e iniciar nuevos viajes.
                  </p>
                </div>
                <span className="insignia insignia--activa" style={{ marginLeft: 'auto' }}>🔒 CUENTA HABILITADA ●</span>
              </div>
            </article>

            <article className="tarjeta">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--espacio-3)' }}>
                <span>📑 REFERENCIA OFICIAL<br /><strong>COMPROBANTE #{comprobante.ref}</strong></span>
                <span className="insignia insignia--activa">● PAGADO</span>
              </div>

              <div className={styles.grid2Col}>
                <div className={styles.boxMetaItem}>
                  <span>CONCEPTO REGISTRADO</span>
                  <strong>Exceso de tiempo</strong>
                </div>
                <div className={styles.boxMetaItem}>
                  <span>VIAJE ASOCIADO</span>
                  <strong>#VIAJE-8831 (Plaza → Terminal)</strong>
                </div>
                <div className={styles.boxMetaItem}>
                  <span>MINUTOS LIQUIDADOS</span>
                  <strong>25 min de exceso</strong>
                </div>
                <div className={styles.boxMetaItem}>
                  <span>MÉTODO DE PAGO</span>
                  <strong>💳 Saldo de billetera</strong>
                </div>
              </div>

              <div className={styles.detalleFila} style={{ border: 'none', marginTop: 'var(--espacio-3)' }}>
                <span>FECHA Y HORA DEL PAGO</span>
                <span>{comprobante.fecha}</span>
              </div>

              <div className={styles.boxTarjetaHabilitada}>
                <span className="insignia insignia--activa">📲</span>
                <div>
                  <strong>TARJETA NFC HABILITADA</strong>
                  <p style={{ fontSize: 'var(--texto-xs)', color: 'var(--color-placeholder)' }}>Lista para desbloquear bicicletas en cualquier estación.</p>
                </div>
                <span className="insignia insignia--neutra" style={{ marginLeft: 'auto' }}>#TUN-8831 ●</span>
              </div>
            </article>
          </div>

          <article className="tarjeta" style={{ backgroundColor: 'var(--color-superficie-inversa)', color: 'var(--color-texto-inverso)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--texto-xs)', color: 'var(--color-placeholder)' }}>TOTAL DÉBITO REALIZADO</span>
              <span className="insignia insignia--neutra">COMPLETADO</span>
            </div>
            <p style={{ fontSize: 'var(--texto-m)', fontWeight: 700, marginTop: 'var(--espacio-1)' }}>Monto Pagado</p>
            
            <h2 style={{ fontSize: 'var(--texto-5xl)', fontWeight: 800, color: 'var(--color-acento)', margin: 'var(--espacio-4) 0' }}>
              ${comprobante.monto.toLocaleString()} COP
            </h2>

            <div className={styles.panelSaldosComparativa}>
              <div>
                <span>🕒 SALDO ANTERIOR</span>
                <p style={{ fontWeight: 700 }}>${comprobante.saldoAnterior.toLocaleString()} COP</p>
                <small style={{ color: 'var(--color-error-texto)' }}>-$2.500</small>
              </div>
              <div>
                <span>💳 NUEVO SALDO</span>
                <p style={{ fontWeight: 700, color: 'var(--color-primario-texto)' }}>${comprobante.nuevoSaldo.toLocaleString()} COP</p>
                <span className="insignia insignia--activa" style={{ fontSize: '10px' }}>ACTIVO</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--espacio-2)', marginTop: 'var(--espacio-5)' }}>
              <button type="button" className="boton boton--secundario boton--bloque" onClick={onVolver}>
                💳 Ir a Mi Billetera
              </button>
              <button type="button" className="boton boton--bloque" onClick={onVolver}>
                🚲 Ver Estaciones
              </button>
            </div>
            <p style={{ fontSize: 'var(--texto-xs)', textAlign: 'center', marginTop: 'var(--espacio-3)', cursor: 'pointer' }}>
              📥 Descargar comprobante en PDF
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
          <h1 className="titulo-pagina">Pagar Cobro Pendiente</h1>
          <span className="insignia insignia--neutra">[ PASO 1 DE 2 ]</span>
        </div>
        <p className={styles.subtitulo}>Paso 1 de 2: Verificación de saldo y resumen de cobro por exceso de tiempo</p>
      </header>

      <div className={styles.gridPaso2}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--espacio-4)' }}>
          <article className="tarjeta">
            <div className={styles.estadoCuentaBox}>
              <div>
                <p className={styles.subSeccionTitulo}>SALDO DISPONIBLE EN BILLETERA</p>
                <p style={{ fontSize: 'var(--texto-xl)', fontWeight: 700 }}>${saldoActual.toLocaleString()} COP</p>
              </div>
              <span className="insignia insignia--activa">● [ SALDO SUFICIENTE ]</span>
            </div>
          </article>

          <article className="tarjeta">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--espacio-3)' }}>
              <strong style={{ color: 'var(--color-error-texto)' }}>🔴 SEC_01 // DETALLE DEL COBRO PENDIENTE</strong>
              <span className="insignia insignia--inactiva">[ PENDIENTE ]</span>
            </div>

            <div className={styles.detalleFila}>
              <span>IDENTIFICADOR DEL COBRO</span>
              <strong>#{cobro.id || 'CP-2026-084'}</strong>
            </div>
            <div className={styles.detalleFila}>
              <span>VIAJE ASOCIADO</span>
              <strong>{cobro.viaje}</strong>
            </div>
            <div className={styles.detalleFila}>
              <span>FECHA DEL VIAJE</span>
              <span>01 Nov 2026, 17:45</span>
            </div>
            <div className={styles.detalleFila}>
              <span>TIEMPO UTILIZADO</span>
              <span>55 min <small style={{ color: 'var(--color-placeholder)' }}>(Límite del plan: 30 min)</small></span>
            </div>
            <div className={styles.detalleFila}>
              <span>MINUTOS DE EXCESO</span>
              <strong style={{ color: 'var(--color-error-texto)' }}>+ 25 minutos</strong>
            </div>
            <div className={styles.detalleFila}>
              <span>TARIFA POR MINUTO DE EXCESO</span>
              <span>$100 COP / min</span>
            </div>
            <div className={styles.boxTotalPagar}>
              <div>
                <strong>TOTAL A PAGAR</strong>
                <p style={{ fontSize: 'var(--texto-xs)', color: 'var(--color-placeholder)' }}>Liquidación automática por exceso</p>
              </div>
              <span style={{ fontSize: 'var(--texto-3xl)', fontWeight: 800 }}>${cobro.monto.toLocaleString()} COP</span>
            </div>
          </article>

          <article className="tarjeta">
            <strong style={{ fontSize: 'var(--texto-xs)', color: 'var(--color-placeholder)' }}>SEC_02 // DESGLOSE FINANCIERO Y BALANCE RESULTANTE</strong>
            <div className={styles.detalleFila} style={{ marginTop: 'var(--espacio-3)' }}>
              <span>Saldo actual en billetera</span>
              <span>${saldoActual.toLocaleString()} COP</span>
            </div>
            <div className={styles.detalleFila}>
              <span style={{ color: 'var(--color-error-texto)' }}>⊖ Menos monto a debitar</span>
              <span style={{ color: 'var(--color-error-texto)' }}>-${cobro.monto.toLocaleString()} COP</span>
            </div>
            <div className={styles.boxSaldoRestante}>
              <span>Saldo restante estimado</span>
              <strong>${saldoRestante.toLocaleString()} COP</strong>
            </div>
          </article>

          <article className="tarjeta">
            <p style={{ fontSize: 'var(--texto-s)', color: 'var(--color-placeholder)' }}>
              ℹ️ Al confirmar el pago, el cobro pasará al estado <strong>PAGADO</strong> y quedará registrado en sus movimientos con el concepto «Exceso de tiempo». Quedará habilitado inmediatamente para desbloquear bicicletas e iniciar nuevos viajes.
            </p>
          </article>

          <div className={styles.accionesPieForm}>
            <button type="button" className="boton" onClick={onVolver}>[ CANCELAR ]</button>
            <button type="button" className="boton boton--secundario" onClick={handleConfirmarPago}>
              🔒 [ CONFIRMAR Y PAGAR ${cobro.monto.toLocaleString()} COP ]
            </button>
          </div>
        </div>

        {/* Columna Derecha Lateral */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--espacio-4)' }}>
          <article className="tarjeta" style={{ backgroundColor: 'var(--color-superficie-inversa)', color: 'var(--color-texto-inverso)' }}>
            <strong>Station Bike</strong>
            <span className="insignia insignia--neutra" style={{ marginTop: 'var(--espacio-2)' }}>NFC PASS</span>
            <p style={{ fontSize: 'var(--texto-xs)', color: 'var(--color-error-texto)', marginTop: 'var(--espacio-3)' }}>
              🔴 ESTADO OPERATIVO: Desbloqueo Pausado
            </p>
            <p style={{ fontSize: 'var(--texto-s)', fontWeight: 700, marginTop: 'var(--espacio-2)' }}>Camila Rojas</p>
            <span className={styles.subDetalleRef}>#TUN-8831</span>
          </article>

          <article className="tarjeta">
            <strong style={{ fontSize: 'var(--texto-s)' }}>Estaciones del Recorrido</strong>
            <div style={{ marginTop: 'var(--espacio-3)', fontSize: 'var(--texto-xs)' }}>
              <p>🟢 <strong>Estación Plaza de Bolívar</strong><br />Salida: 01 Nov 2026 • 17:45</p>
              <p style={{ marginTop: 'var(--espacio-2)' }}>🔴 <strong>Estación Terminal de Transportes</strong><br />Llegada: 01 Nov 2026 • 18:40</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

export default PagarCobroView;