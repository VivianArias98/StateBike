import { formatearPesos } from '../../formato.js';
import { formatearFechaBogota } from '../../../../utils/formatoMoneda.js';
import styles from './TablaMovimientos.module.css';

// Tipos que suman al saldo; el resto (compras de plan, cobros) restan
const TIPOS_INGRESO = ['RECARGA', 'TOPUP'];

// Historial de movimientos de la billetera, del más reciente al más antiguo (HU_23).
// El orden ya lo entrega el backend.
function TablaMovimientos({ movimientos }) {
  return (
    <section className={styles.raiz} aria-labelledby="movimientos-titulo">
      <div className={styles.cabecera}>
        <h2 id="movimientos-titulo" className={styles.titulo}>
          Historial de Movimientos
        </h2>
        <p className={styles.subtitulo}>Del más reciente al más antiguo</p>
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
