import Etiqueta from '../../../../components/Etiqueta/Etiqueta.jsx';
import { formatearPesos } from '../../formato.js';
import styles from './TablaPagos.module.css';

// Componente de presentación: dibuja la tabla de pagos recibida por props.
// La lógica de filtrado vive en HistorialPagosPage.
function TablaPagos({ pagos, hayFiltro = false }) {
  if (pagos.length === 0) {
    return (
      <p className={styles.vacio}>
        {hayFiltro
          ? 'No se encontraron registros de pagos ni recargas en el rango seleccionado.'
          : 'Aún no tienes pagos ni recargas registradas en tu cuenta.'}
      </p>
    );
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
              <td className={styles.celdaFecha}>
                <span className={`punto-vivo ${styles.punto}`} aria-hidden="true" />
                <span className={styles.fecha}>{pago.fechaHora}</span>
              </td>
              <td className={styles.celdaConcepto}>{pago.concepto}</td>
              <td className={styles.celdaTipo}>
                <Etiqueta
                  texto={pago.tipo}
                  color={
                    pago.tipo === 'Cobro por exceso'
                      ? 'amarilla'
                      : pago.tipo === 'Compra de plan'
                      ? 'verde'
                      : 'menta'
                  }
                />
              </td>
              <td className={styles.monto}>{formatearPesos(pago.monto)} COP</td>
              <td className={styles.celdaEstado}>
                {pago.estado === 'Pendiente' ? (
                  <Etiqueta texto="Pendiente" color="amarilla" />
                ) : (
                  <span className="insignia insignia--activa">{pago.estado}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaPagos;
