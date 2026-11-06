import Etiqueta from '../../../../components/Etiqueta/Etiqueta.jsx';
import { formatearPesos } from '../../formato.js';
import styles from './TablaPagos.module.css';

// Componente de presentación: dibuja la tabla de pagos recibida por props.
// La lógica de filtrado vive en HistorialPagosPage.
function TablaPagos({ pagos }) {
  if (pagos.length === 0) {
    return <p className={styles.vacio}>No hay registros para el rango seleccionado.</p>;
  }

  return (
    <div className={`tabla ${styles.raiz}`}>
      <table>
        <thead>
          <tr>
            <th className={styles.colFecha}>Fecha y hora</th>
            <th className={styles.colConcepto}>Concepto / detalle</th>
            <th className={styles.colTipo}>Tipo de pago</th>
            <th className={styles.colMonto}>Monto (COP)</th>
            <th className={styles.colEstado}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {pagos.map((pago) => (
            <tr key={pago.id}>
              <td>{pago.fechaHora}</td>
              <td>{pago.concepto}</td>
              <td>
                <Etiqueta texto={pago.tipo} color={pago.tipo === 'Cobro por exceso' ? 'amarilla' : 'menta'} />
              </td>
              <td className={styles.monto}>{formatearPesos(pago.monto)} COP</td>
              <td>
                <span className={pago.estado === 'Pagado' ? 'insignia insignia--activa' : 'insignia insignia--neutra'}>
                  {pago.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaPagos;
