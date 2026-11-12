import { formatearPesos } from '../../formato.js';
import { formatearFechaBogota } from '../../../../utils/formatoMoneda.js';
import { IconoDocumento, IconoDescarga } from '../../../../components/Iconos/Iconos.jsx';
import { descargarCSV, generarComprobantePDF } from '../../../../utils/descargas.js';
import styles from './TablaMovimientos.module.css';

// Tipos que suman al saldo; el resto (compras de plan, cobros) restan
const TIPOS_INGRESO = ['RECARGA', 'TOPUP'];

// Historial de movimientos de la billetera, del más reciente al más antiguo (HU_23).
// El orden ya lo entrega el backend.
function TablaMovimientos({ movimientos = [], perfil = {}, saldo = 0 }) {
  const handleDescargarCSV = () => {
    const encabezados = ['ID', 'Tipo', 'Concepto', 'Fecha y hora', 'Monto', 'Saldo resultante'];
    const filas = movimientos.map((m) => {
      const ingreso = TIPOS_INGRESO.includes(String(m.tipo).toUpperCase());
      return [
        `#${m.id}`,
        m.tipo,
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
        const ingreso = TIPOS_INGRESO.includes(String(m.tipo).toUpperCase());
        return [
          `#${m.id}`,
          m.tipo,
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
          <p className={styles.subtitulo}>Del más reciente al más antiguo</p>
        </div>

        {movimientos.length > 0 && (
          <div className={styles.accionesDescarga}>
            <button
              type="button"
              className={styles.botonExportar}
              onClick={handleDescargarPDF}
              title="Descargar comprobante en PDF"
            >
              <IconoDocumento /> Descargar comprobante PDF
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
        <p className={styles.vacio}>No hay movimientos registrados</p>
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
                const ingreso = TIPOS_INGRESO.includes(String(mov.tipo).toUpperCase());
                const pendiente = mov.estado === 'PENDIENTE';
                return (
                  <tr key={mov.id}>
                    <td>
                      <span className={ingreso ? styles.tipoIngreso : styles.tipoEgreso}>{mov.tipo}</span>
                    </td>
                    <td>
                      <p className={styles.concepto}>{mov.concepto}</p>
                      {pendiente && <p className={styles.pendiente}>PENDIENTE</p>}
                    </td>
                    <td>{formatearFechaBogota(mov.fecha)}</td>
                    <td className={`${styles.derecha} ${ingreso ? styles.montoIngreso : styles.montoEgreso}`}>
                      {ingreso ? '+' : '-'}
                      {formatearPesos(mov.monto)}
                    </td>
                    <td className={styles.derecha}>
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
