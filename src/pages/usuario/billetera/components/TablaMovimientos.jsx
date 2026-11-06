import Etiqueta from '../../../../components/Etiqueta/Etiqueta.jsx';
import { formatearCOP, formatearFechaHora } from '../../../../utils/formatoMoneda.js';
import styles from './TablaMovimientos.module.css';

// Historial de movimientos de la billetera (los más recientes primero)
function TablaMovimientos({ movimientos, hayMas, onVerMas }) {
  return (
    <section className={`tarjeta ${styles.raiz}`}>
      <header className={styles.encabezado}>
        <h2 className={styles.titulo}>Historial de Movimientos</h2>
        <p className={styles.subtitulo}>Mostrando movimientos del más reciente al más antiguo</p>
      </header>

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
                <th>Monto</th>
                <th>Saldo resultante</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((mov) => (
                <tr key={mov.id}>
                  <td>
                    <Etiqueta
                      texto={mov.tipo === 'RECARGA' ? '+ RECARGA' : '- COBRO'}
                      color={mov.tipo === 'RECARGA' ? 'verde' : 'amarilla'}
                    />
                  </td>
                  <td>
                    <span className={styles.concepto}>{mov.concepto}</span>
                    <span className={styles.detalle}>{mov.detalle}</span>
                  </td>
                  <td>{formatearFechaHora(mov.fecha)}</td>
                  <td className={mov.monto < 0 ? styles.egreso : styles.ingreso}>
                    {mov.monto < 0 ? '-' : '+'}
                    {formatearCOP(Math.abs(mov.monto))} COP
                  </td>
                  <td>{formatearCOP(mov.saldoResultante)} COP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hayMas && (
        <button type="button" className={`boton boton--s ${styles.verMas}`} onClick={onVerMas}>
          Ver más movimientos
        </button>
      )}
    </section>
  );
}

export default TablaMovimientos;
