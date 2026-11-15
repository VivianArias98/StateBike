import React from 'react';
import EstadoBadge from './EstadoBadge.jsx';
import styles from './EstacionesTable.module.css';

function EstacionesTable({ estaciones, onEditar, onInactivar, onActivar }) {
  return (
    <div className={`tabla ${styles.raiz}`}>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Capacidad / Disponibilidad</th>
            <th style={{ textAlign: 'center' }}>Estado</th>
            <th style={{ textAlign: 'right' }}>Acciones</th>
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
                <td>
                  <div className={styles.capacidadBadge}>
                    <span style={{ color: 'var(--color-secundario)' }}>🚲 {bicis} bicis</span>
                    <span>·</span>
                    <span style={{ opacity: 0.75 }}>🔒 {anclajes} anclajes</span>
                  </div>
                </td>
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
                    >
                      Editar
                    </button>
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
