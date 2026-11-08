import { formatearCOP } from '../../../../utils/formatoMoneda.js';
import styles from './PlanesTable.module.css';

function PlanesTable({ planes = [], onEditar, onCambiarEstado }) {
  return (
    <div className={`tabla ${styles.raiz}`}>
      <table>
        <thead>
          <tr>
            <th>Plan</th>
            <th>Costo base</th>
            <th>Vigencia</th>
            <th>Viajes/día</th>
            <th>Tiempo máx</th>
            <th>Min. exceso</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {planes.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--color-texto-suave)' }}>
                No hay planes registrados en el catálogo
              </td>
            </tr>
          ) : (
            planes.map((plan) => {
              const activo = plan.estado === 'ACTIVO';

              return (
                <tr key={plan.id}>
                  <td><strong>{plan.nombre}</strong></td>
                  <td>{formatearCOP(plan.costoBase)}</td>
                  <td>{plan.vigenciaDias} {plan.vigenciaDias === 1 ? 'día' : 'días'}</td>
                  <td>{plan.viajesPorDia}</td>
                  <td>{plan.tiempoViajeMin} min</td>
                  <td>{plan.valorMinutoExceso > 0 ? formatearCOP(plan.valorMinutoExceso) : '$0'}</td>
                  <td>
                    <span className={`insignia ${activo ? 'insignia--activa' : 'insignia--inactiva'}`}>
                      {activo ? '✓ ACTIVO' : '– INACTIVO'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.acciones}>
                      <button
                        type="button"
                        className={`boton boton--secundario ${styles.botonAccion}`}
                        onClick={() => onEditar(plan)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className={`boton ${styles.botonAccion}`}
                        onClick={() => onCambiarEstado(plan.id, activo ? 'INACTIVO' : 'ACTIVO')}
                      >
                        {activo ? 'Inactivar' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PlanesTable;
