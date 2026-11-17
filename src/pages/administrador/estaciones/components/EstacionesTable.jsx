import React from 'react';
import EstadoBadge from './EstadoBadge.jsx';
import styles from './EstacionesTable.module.css';

function EstacionesTable({ estaciones, onEditar, onInactivar, onActivar }) {
  return (
    <div className={`tabla ${styles.raiz}`}>
      <table>
        <caption className="sr-only">Listado de estaciones del sistema</caption>
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Dirección</th>
            <th scope="col" style={{ textAlign: 'center' }}>Bicicletas</th>
            <th scope="col" style={{ textAlign: 'center' }}>Anclajes libres</th>
            <th scope="col" style={{ textAlign: 'center' }}>Estado</th>
            <th scope="col" style={{ textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estaciones.map((estacion) => {
            const inactiva = estacion.estado === 'INACTIVE';
            const bicis = Number(estacion.bicicletas) || 0;
            const anclajes = Number(estacion.capacidad_maxima || estacion.anclajes) || 0;

            return (
              <tr key={estacion.id}>
                <td className={styles.nombreCelda}>{estacion.nombre}</td>
                <td className={styles.direccionCelda}>{estacion.direccion}</td>
                <td className={styles.numeroCelda}>{bicis}</td>
                <td className={styles.numeroCelda}>{anclajes}</td>
                <td style={{ textAlign: 'center' }}>
                  <EstadoBadge estado={estacion.estado} />
                </td>
                <td>
                  <div className={styles.acciones}>
                    <button
                      type="button"
                      className={`boton boton--secundario ${styles.botonAccion}`}
                      disabled={inactiva}
                      onClick={() => onEditar(estacion.id)}
                      title={inactiva ? 'No se puede editar una estación inactiva' : 'Editar nombre, dirección y coordenadas'}
                      aria-describedby={inactiva ? `motivo-inactiva-${estacion.id}` : undefined}
                    >
                      Editar
                    </button>
                    {inactiva && (
                      <span id={`motivo-inactiva-${estacion.id}`} className="sr-only">
                        No se puede editar una estación inactiva
                      </span>
                    )}
                    {inactiva ? (
                      <button
                        type="button"
                        className={`boton boton--primario ${styles.botonAccion}`}
                        onClick={() => onActivar(estacion.id)}
                        title="Activar estación para habilitar retiros y devoluciones"
                      >
                        Activar
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={`boton ${styles.botonAccion}`}
                        onClick={() => onInactivar(estacion.id)}
                        title="Inactivar estación si no tiene bicicletas"
                      >
                        Inactivar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default EstacionesTable;
