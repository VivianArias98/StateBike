import React, { useState } from 'react';
import styles from './HistorialPage.module.css';

function HistorialPage() {
  const [pestana, setPestana] = useState('viajes');

  return (
    <div className={styles.raiz}>
      {/* Indicador superior de subsección */}
      <div className={styles.migaSubmodulo}>
        ● OPERACIÓN TUNJA BICI / {pestana === 'viajes' ? 'RECORRIDOS HISTÓRICOS' : 'REGISTRO FINANCIERO'}
      </div>

      <div className={styles.encabezadoSeccion}>
        <div>
          <h1 className={styles.titulo}>
            {pestana === 'viajes' ? 'Historial de Viajes' : 'Historial de Pagos'}
          </h1>
          <p className={styles.subtitulo}>
            {pestana === 'viajes'
              ? 'Consulta de recorridos realizados, tiempos acumulados y detalle de estaciones en Tunja Bici.'
              : 'Registro detallado de recargas de saldo, planes y cobros adicionales de la cuenta.'}
          </p>
        </div>

        {/* Switch de pastilla VIAJES / PAGOS */}
        <div className={styles.switchPestanas}>
          <button
            type="button"
            className={pestana === 'viajes' ? styles.btnPestanaActivo : styles.btnPestanaInactivo}
            onClick={() => setPestana('viajes')}
          >
            VIAJES
          </button>
          <button
            type="button"
            className={pestana === 'pagos' ? styles.btnPestanaActivo : styles.btnPestanaInactivo}
            onClick={() => setPestana('pagos')}
          >
            ● PAGOS
          </button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className={`tarjeta ${styles.panelFiltros}`}>
        <div className={styles.campoFiltro}>
          <label className={styles.labelFiltro}>DESDE (FECHA INICIAL)</label>
          <input className="input" type="text" defaultValue="10/01/2026" readOnly />
        </div>
        <div className={styles.campoFiltro}>
          <label className={styles.labelFiltro}>HASTA (FECHA FINAL)</label>
          <input className="input" type="text" defaultValue="10/15/2026" readOnly />
        </div>
        <div className={styles.accionesFiltro}>
          <button type="button" className="boton boton--primario">🔍 CONSULTAR</button>
          <button type="button" className="boton boton--secundario">Limpiar</button>
        </div>
      </div>

      {pestana === 'viajes' ? (
        <>
          {/* Métricas de Viajes */}
          <div className={styles.gridMetricas}>
            <div className="tarjeta">
              <span className={styles.metricaEtiqueta}>TOTAL RECORRIDOS</span>
              <h3 className={styles.metricaValor}>
                4 <small className={styles.metricaSub}>viajes registrados</small>
              </h3>
            </div>
            <div className="tarjeta">
              <span className={styles.metricaEtiqueta}>TIEMPO TOTAL ACUMULADO</span>
              <h3 className={styles.metricaValor}>
                174 min <span className="insignia insignia--activa">(2h 54m)</span>
              </h3>
            </div>
            <div className="tarjeta">
              <span className={styles.metricaEtiqueta}>PERIODO CONSULTADO</span>
              <div className={styles.badgePeriodo}>01 OCT 2026 – 15 OCT 2026</div>
            </div>
          </div>

          {/* Tabla de Viajes */}
          <div className={`tarjeta ${styles.contenedorTabla}`}>
            <div className="tabla">
              <table>
                <thead>
                  <tr>
                    <th>FECHA Y HORA</th>
                    <th>ORIGEN</th>
                    <th>DESTINO</th>
                    <th>DURACIÓN</th>
                    <th>DETALLE / RUTA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>🟢 14 oct 2026, 18:42</td>
                    <td>📍 Estación Parque Central</td>
                    <td>Estación Terminal</td>
                    <td><span className={styles.duracionBadge}>52 min</span></td>
                    <td><button type="button" className="enlace">Ver ruta / mapa →</button></td>
                  </tr>
                  <tr>
                    <td>🟢 12 oct 2026, 08:15</td>
                    <td>📍 Estación Universidad</td>
                    <td>Estación Parque Central</td>
                    <td><span className={styles.duracionBadge}>28 min</span></td>
                    <td><button type="button" className="enlace">Ver ruta / mapa →</button></td>
                  </tr>
                  <tr>
                    <td>🟢 09 oct 2026, 17:30</td>
                    <td>📍 Estación Terminal</td>
                    <td>Estación Universidad</td>
                    <td><span className={styles.duracionBadge}>61 min</span></td>
                    <td><button type="button" className="enlace">Ver ruta / mapa →</button></td>
                  </tr>
                  <tr>
                    <td>🟢 05 oct 2026, 12:10</td>
                    <td>📍 Estación Parque Central</td>
                    <td>Estación Mercado</td>
                    <td><span className={styles.duracionBadge}>33 min</span></td>
                    <td><button type="button" className="enlace">Ver ruta / mapa →</button></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.pieTabla}>
              <span className={styles.contadorInfo}>Mostrando 4 registros en el rango seleccionado</span>
              <div className={styles.botonesDescarga}>
                <button type="button" className="boton boton--secundario">📄 Descargar reporte PDF</button>
                <button type="button" className="boton boton--secundario">📥 Descargar CSV</button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Métricas de Pagos */}
          <div className={styles.gridMetricas4}>
            <div className="tarjeta">
              <span className={styles.metricaEtiqueta}>TOTAL TRANSACCIONES</span>
              <h3 className={styles.metricaValor}>
                4 <small className={styles.metricaSub}>Movimientos registrados</small>
              </h3>
            </div>
            <div className="tarjeta">
              <span className={styles.metricaEtiqueta}>TOTAL DEBITADO / PAGADO</span>
              <h3 className={styles.metricaValor}>
                $65.300 COP <small className={styles.metricaSub}>Planes y excedentes</small>
              </h3>
            </div>
            <div className="tarjeta">
              <span className={styles.metricaEtiqueta}>SALDO ACTUAL EN BILLETERA</span>
              <h3 className={`${styles.metricaValor} ${styles.textoVerde}`}>
                $16.000 COP <small className={styles.metricaSub}>Disponible para uso</small>
              </h3>
            </div>
            <div className="tarjeta">
              <span className={styles.metricaEtiqueta}>PERIODO CONSULTADO</span>
              <div className={styles.badgePeriodo}>01 OCT 2026 – 15 OCT 2026</div>
              <small className={styles.metricaSub}>Rango de fechas activo</small>
            </div>
          </div>

          {/* Tabla de Pagos */}
          <div className={`tarjeta ${styles.contenedorTabla}`}>
            <div className="tabla">
              <table>
                <thead>
                  <tr>
                    <th>FECHA Y HORA</th>
                    <th>CONCEPTO / DETALLE</th>
                    <th>TIPO DE PAGO</th>
                    <th>MONTO (COP)</th>
                    <th>ESTADO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>🟡 15 oct 2026, 08:20</td>
                    <td>Cobro por exceso de tiempo (18 min viaje BIC-014)</td>
                    <td><span className={styles.tagTipoPago}>COBRO POR EXCESO</span></td>
                    <td><strong>$1.800 COP</strong></td>
                    <td><span className="insignia insignia--inactiva">PENDIENTE</span></td>
                  </tr>
                  <tr>
                    <td>🟢 14 oct 2026, 18:43</td>
                    <td>Cobro por exceso de tiempo (12 min viaje BIC-002)</td>
                    <td><span className={styles.tagTipoPago}>COBRO POR EXCESO</span></td>
                    <td><strong>$1.200 COP</strong></td>
                    <td><span className="insignia insignia--activa">PAGADO</span></td>
                  </tr>
                  <tr>
                    <td>🟢 01 oct 2026, 10:15</td>
                    <td>Adquisición Plan Mensual Estudiantil / Ciudadano</td>
                    <td><span className={styles.tagTipoPago}>COMPRA DE PLAN</span></td>
                    <td><strong>$32.000 COP</strong></td>
                    <td><span className="insignia insignia--activa">PAGADO</span></td>
                  </tr>
                  <tr>
                    <td>🟢 01 oct 2026, 09:40</td>
                    <td>Recarga de saldo en billetera digital (PSE)</td>
                    <td><span className={styles.tagTipoPago}>RECARGA DE SALDO</span></td>
                    <td><strong>$50.000 COP</strong></td>
                    <td><span className="insignia insignia--activa">PAGADO</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.pieTabla}>
              <span className={styles.contadorInfo}>Mostrando 4 registros en el rango seleccionado</span>
              <div className={styles.botonesDescarga}>
                <button type="button" className="boton boton--secundario">📄 Descargar comprobante PDF</button>
                <button type="button" className="boton boton--secundario">📥 Descargar CSV</button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className={styles.notaFooterState}>
        <span>ℹ️ Filtro activo: Si ningún viaje o pago coincide, el sistema informará: «No hay registros para el rango seleccionado».</span>
        <span className="insignia insignia--activa">ESTADO: 4 ENCONTRADOS</span>
      </div>
    </div>
  );
}

export default HistorialPage;