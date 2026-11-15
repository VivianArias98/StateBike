import { formatearPesos } from '../../formato.js';
import { formatearFechaBogota } from '../../../../utils/formatoMoneda.js';
import {
  IconoDocumento,
  IconoDescarga,
  IconoBilletera,
} from '../../../../components/Iconos/Iconos.jsx';
import { descargarCSV, generarComprobantePDF } from '../../../../utils/descargas.js';
import styles from './TablaMovimientos.module.css';

// Tipos que suman al saldo; el resto (compras de plan, cobros) restan
const TIPOS_INGRESO = ['RECARGA', 'TOPUP'];

function clasificarTipoBilletera(tipo, concepto = '') {
  const tipoUpper = String(tipo || '').toUpperCase();
  const conceptoLower = String(concepto).toLowerCase();

  if (
    tipoUpper === 'COMPRA_PLAN' ||
    tipoUpper === 'PLAN' ||
    conceptoLower.includes('plan') ||
    conceptoLower.includes('adquisición') ||
    conceptoLower.includes('adquisicion')
  ) {
    return 'Compra de plan';
  }
  if (tipoUpper === 'COBRO_EXCESO' || conceptoLower.includes('exceso')) {
    return 'Cobro por exceso';
  }
  if (tipoUpper === 'RECARGA' || tipoUpper === 'TOPUP' || conceptoLower.includes('recarga')) {
    return 'Recarga de saldo';
  }
  if (tipoUpper === 'COBRO' || tipoUpper === 'CHARGE') {
    return 'Cobro de servicio';
  }
  return tipo || 'Movimiento';
}

function esIngreso(tipo, concepto = '') {
  const conceptoLower = String(concepto).toLowerCase();
  if (
    conceptoLower.includes('plan') ||
    conceptoLower.includes('adquisición') ||
    conceptoLower.includes('adquisicion') ||
    conceptoLower.includes('exceso')
  ) {
    return false;
  }
  return TIPOS_INGRESO.includes(String(tipo).toUpperCase()) || conceptoLower.includes('recarga');
}

// Historial de movimientos de la billetera (HU_23)
function TablaMovimientos({ movimientos = [], perfil = {}, saldo = 0 }) {
  const handleDescargarCSV = () => {
    const encabezados = ['ID', 'Tipo', 'Concepto', 'Fecha y hora', 'Monto', 'Saldo resultante'];
    const filas = movimientos.map((m) => {
      const ingreso = esIngreso(m.tipo, m.concepto);
      return [
        `#${m.id}`,
        clasificarTipoBilletera(m.tipo, m.concepto),
        m.concepto,
        formatearFechaBogota(m.fecha),
        (ingreso ? '+' : '-') + formatearPesos(m.monto) + ' COP',
        m.saldoResultante != null ? formatearPesos(m.saldoResultante) + ' COP' : '—',
      ];
    });
    const fechaHoy = new Date().toISOString().slice(0, 10);
    descargarCSV(`movimientos_billetera_stationbike_${fechaHoy}.csv`, encabezados, filas);
  };

  const handleDescargarPDF = () => {
    generarComprobantePDF({
      titulo: 'Comprobante Oficial de Movimientos de Billetera',
      usuario: perfil,
      periodo: 'Histórico completo registrado',
      metricas: [
        { etiqueta: 'Saldo disponible', valor: `${formatearPesos(saldo)} COP` },
        { etiqueta: 'Total movimientos', valor: movimientos.length },
      ],
      columnas: ['ID', 'Tipo', 'Concepto', 'Fecha y hora', 'Monto', 'Saldo Resultante'],
      filas: movimientos.map((m) => {
        const ingreso = esIngreso(m.tipo, m.concepto);
        return [
          `#${m.id}`,
          clasificarTipoBilletera(m.tipo, m.concepto),
          m.concepto,
          formatearFechaBogota(m.fecha),
          (ingreso ? '+' : '-') + `${formatearPesos(m.monto)} COP`,
          m.saldoResultante != null ? `${formatearPesos(m.saldoResultante)} COP` : '—',
        ];
      }),
    });
  };

  return (
    <section className={styles.raiz} aria-labelledby="movimientos-titulo">
      <div className={styles.cabecera}>
        <div>
          <h2 id="movimientos-titulo" className={styles.titulo}>
            Historial de Movimientos
          </h2>
          <p className={styles.subtitulo}>
            Registro cronológico ordenado del más reciente al más antiguo
          </p>
        </div>

        {movimientos.length > 0 && (
          <div className={styles.accionesDescarga}>
            <button
              type="button"
              className={styles.botonExportar}
              onClick={handleDescargarPDF}
              title="Descargar comprobante en PDF"
            >
              <IconoDocumento /> Descargar PDF
            </button>
            <button
              type="button"
              className={styles.botonExportar}
              onClick={handleDescargarCSV}
              title="Descargar movimientos en CSV"
            >
              <IconoDescarga /> Descargar CSV
            </button>
          </div>
        )}
      </div>

      {movimientos.length === 0 ? (
        <div className={styles.vacioContenedor}>
          <div className={styles.vacioIcono} aria-hidden="true">
            <IconoBilletera />
          </div>
          <p className={styles.vacioTitulo}>No hay movimientos registrados</p>
          <p className={styles.vacioTexto}>
            Tus recargas en taquilla y compras de planes se reflejarán automáticamente en esta tabla.
          </p>
        </div>
      ) : (
        <div className={`tabla ${styles.tabla}`}>
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Concepto</th>
                <th>Fecha y hora</th>
                <th className={styles.derecha}>Monto</th>
                <th className={styles.derecha}>Saldo resultante</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((mov) => {
                const ingreso = esIngreso(mov.tipo, mov.concepto);
                const etiquetaTipo = clasificarTipoBilletera(mov.tipo, mov.concepto);
                const pendiente = mov.estado === 'PENDIENTE';
                return (
                  <tr key={mov.id}>
                    <td>
                      <span className={ingreso ? styles.tipoIngreso : styles.tipoEgreso}>
                        {etiquetaTipo}
                      </span>
                    </td>
                    <td>
                      <p className={styles.concepto}>{mov.concepto}</p>
                      {pendiente && <span className={styles.pendiente}>PENDIENTE</span>}
                    </td>
                    <td className={styles.fecha}>{formatearFechaBogota(mov.fecha)}</td>
                    <td className={`${styles.derecha} ${ingreso ? styles.montoIngreso : styles.montoEgreso}`}>
                      {ingreso ? '+' : '-'}
                      {formatearPesos(mov.monto)}
                    </td>
                    <td className={`${styles.derecha} ${styles.saldoResultante}`}>
                      {mov.saldoResultante !== null && mov.saldoResultante !== undefined
                        ? formatearPesos(mov.saldoResultante)
                        : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default TablaMovimientos;
