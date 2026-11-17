import React from 'react';
import { formatearCOP } from '../../../../utils/formatoMoneda.js';
import styles from './PlanesTable.module.css';

function PlanesTable({ planes = [], onEditar, onCambiarEstado, onSolicitarInactivar }) {
  return (
    <div className={`tabla ${styles.raiz}`}>
      <table>
        <caption className="sr-only">Catálogo de planes y tarifas del servicio</caption>
        <thead>
          <tr>
            <th scope="col" className={styles.colPlan}>Plan</th>
            <th scope="col" className={styles.colCosto}>Costo base</th>
            <th scope="col" className={styles.colVigencia}>Vigencia</th>
            <th scope="col" className={styles.colViajes}>Viajes/día</th>
            <th scope="col" className={styles.colTiempo}>Tiempo máx</th>
            <th scope="col" className={styles.colExceso}>Min. exceso</th>
            <th scope="col" className={styles.colEstado}>Estado</th>
            <th scope="col" className={styles.colAcciones}>Acciones</th>
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
                  <td className={styles.colPlan}>
                    <strong>{plan.nombre}</strong>
                  </td>
                  <td className={styles.colCosto}>
                    {formatearCOP(plan.costoBase)}
                  </td>
                  <td className={styles.colVigencia}>
                    {plan.vigenciaDias} {plan.vigenciaDias === 1 ? 'día' : 'días'}
                  </td>
                  <td className={styles.colViajes}>
                    {plan.viajesPorDia}
                  </td>
                  <td className={styles.colTiempo}>
                    {plan.tiempoViajeMin} min
                  </td>
                  <td className={styles.colExceso}>
                    {plan.valorMinutoExceso > 0 ? formatearCOP(plan.valorMinutoExceso) : '$0'}
                  </td>
                  <td className={styles.colEstado}>
                    <span className={`insignia ${activo ? 'insignia--activa' : 'insignia--inactiva'}`}>
                      {activo ? '✓ ACTIVO' : '– INACTIVO'}
                    </span>
                  </td>
                  <td className={styles.colAcciones}>
                    <div className={styles.acciones}>
                      <button
                        type="button"
                        className={`boton boton--secundario ${styles.botonAccion}`}
                        onClick={() => onEditar(plan)}
                        title="Modificar parámetros del plan"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className={`boton ${styles.botonAccion}`}
                        onClick={() => {
                          if (activo) {
                            if (onSolicitarInactivar) {
                              onSolicitarInactivar(plan);
                            } else {
                              onCambiarEstado(plan.id, 'INACTIVO');
                            }
                          } else {
                            onCambiarEstado(plan.id, 'ACTIVO');
                          }
                        }}
                        title={activo ? 'Inactivar plan' : 'Activar plan'}
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
