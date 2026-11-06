import React from 'react';
import styles from './BilleteraPrincipal.module.css';

function BilleteraPrincipal({ billetera, onIrARecarga, onIrAPago }) {
  return (
    <div className={styles.raiz}>
      <header className={styles.saludo}>
        <p className={styles.migas}>MÓDULO FINANCIERO / Cuenta #{billetera?.idUsuario || '1.049.882'}</p>
        <div className={styles.encabezadoTitulo}>
          <h1 className="titulo-pagina">Mi Billetera</h1>
          <span className="insignia insignia--activa">● Estado: Habilitado · Telemetría NFC en sincronía</span>
        </div>
        <p className={styles.subtitulo}>
          Consulta tu saldo disponible, cobros pendientes y registro de movimientos de tu cuenta.
        </p>
      </header>

      {/* Tarjetas Superiores */}
      <div className={styles.gridSuperior}>
        <article className="tarjeta">
          <div className={styles.headerTarjetaCard}>
            <span className={styles.etiquetaCard}>SALDO DISPONIBLE</span>
            <span className="insignia insignia--neutra">[ REGISTRO #COP-01 ]</span>
          </div>
          <p className={styles.valorPrincipal}>
            ${billetera?.saldo?.toLocaleString()} <small className={styles.moneda}>COP</small>
          </p>
          <p className={styles.descCard}>
            Saldo utilizado para la adquisición de planes y deducción de minutos de exceso.
          </p>
          <button
            type="button"
            className="boton boton--secundario boton--bloque"
            onClick={onIrARecarga}
            style={{ marginTop: 'var(--espacio-4)' }}
          >
            [ + RECARGAR SALDO ]
          </button>
        </article>

        {billetera?.cobroPendiente ? (
          <article className={`${styles.tarjetaAlerta} tarjeta`}>
            <div className={styles.headerTarjetaCard}>
              <span className={styles.etiquetaCardAlerta}>🔴 ALERTA · COBRO PENDIENTE</span>
              <span className="insignia insignia--inactiva">[ ACCIÓN REQUERIDA ]</span>
            </div>
            <p className={styles.valorAlerta}>
              ${billetera.cobroPendiente.monto.toLocaleString()} <small className={styles.moneda}>COP</small>
            </p>
            <div className={styles.boxConcepto}>
              <span>CONCEPTO ASOCIADO:</span>
              <strong>Viaje {billetera.cobroPendiente.viajeId || '#VIA-0892'} · {billetera.cobroPendiente.minutosExceso || 25} minutos de exceso en Estación Terminal</strong>
            </div>
            <button
              type="button"
              className="boton boton--secundario boton--bloque"
              onClick={onIrAPago}
              style={{ marginTop: 'var(--espacio-4)' }}
            >
              💳 [ PAGAR COBRO PENDIENTE ]
            </button>
          </article>
        ) : (
          <article className="tarjeta" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <span className="insignia insignia--activa" style={{ fontSize: 'var(--texto-m)', padding: 'var(--espacio-3) var(--espacio-5)' }}>
              ✓ CUENTA AL DÍA - Sin cobros pendientes
            </span>
            <p className={styles.descCard} style={{ marginTop: 'var(--espacio-3)' }}>
              Tu tarjeta NFC se encuentra totalmente habilitada para desbloquear bicicletas.
            </p>
          </article>
        )}
      </div>

      {/* Métricas Inferiores */}
      <div className={styles.metricasInferiores}>
        <article className="tarjeta">
          <p className={styles.metricaMiniTitulo}>PLAN VIGENTE</p>
          <p className={styles.metricaMiniValor}>{billetera?.planVigente || 'Regular 30 Días Activo'}</p>
          <p className={styles.metricaMiniDetalle}>{billetera?.diasRestantesPlan || 24} días restantes</p>
        </article>
        <article className="tarjeta">
          <p className={styles.metricaMiniTitulo}>ÚLTIMA ESTACIÓN</p>
          <p className={styles.metricaMiniValor}>{billetera?.ultimaEstacion || 'Terminal de Pasajeros'}</p>
          <p className={styles.metricaMiniDetalle}>Dock #{billetera?.dock || '04'} · Anclada</p>
        </article>
        <article className="tarjeta">
          <p className={styles.metricaMiniTitulo}>HARDWARE PASS</p>
          <p className={styles.metricaMiniValor}>Tarjeta NFC {billetera?.tarjetaNfc || '#4821'}</p>
          <p className={styles.metricaMiniDetalle}>✓ Desbloqueo Inmediato</p>
        </article>
      </div>

      {/* Tabla de Movimientos */}
      <section className="tarjeta" style={{ padding: 0, overflow: 'hidden' }}>
        <div className={styles.headerTabla}>
          <div>
            <h2 className={styles.tituloTabla}>Historial de Movimientos</h2>
            <p className={styles.subtituloTabla}>Mostrando movimientos del más reciente al más antiguo</p>
          </div>
          <span className="insignia insignia--neutra">[ CRITERIO_02 // ORDEN_DESCENDENTE ]</span>
        </div>

        <div className="tabla">
          <table>
            <thead>
              <tr>
                <th style={{ width: '15%' }}>TIPO</th>
                <th style={{ width: '40%' }}>CONCEPTO</th>
                <th style={{ width: '20%' }}>FECHA Y HORA</th>
                <th style={{ width: '12%' }}>MONTO</th>
                <th style={{ width: '13%' }}>SALDO RESULTANTE</th>
              </tr>
            </thead>
            <tbody>
              {billetera?.movimientos?.map((mov, idx) => (
                <tr key={mov.id || idx}>
                  <td>
                    <span className={`insignia ${mov.tipo === 'RECARGA' || mov.monto > 0 ? 'insignia--activa' : 'insignia--inactiva'}`}>
                      {mov.tipo === 'RECARGA' || mov.monto > 0 ? '+ RECARGA' : '- COBRO'}
                    </span>
                  </td>
                  <td>
                    <strong>{mov.concepto}</strong>
                    <div className={styles.subDetalleRef}>{mov.referencia || mov.detalleRef}</div>
                  </td>
                  <td style={{ fontSize: 'var(--texto-xs)' }}>🕒 {mov.fechaHora || mov.creado}</td>
                  <td>
                    <strong style={{ color: mov.monto > 0 ? 'var(--color-primario-texto)' : 'var(--color-error-texto)' }}>
                      {mov.monto > 0 ? `+$${mov.monto.toLocaleString()}` : `-$${Math.abs(mov.monto).toLocaleString()}`} COP
                    </strong>
                  </td>
                  <td>${mov.saldoResultante?.toLocaleString()} COP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default BilleteraPrincipal;