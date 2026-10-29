import EstadoBadge from './EstadoBadge';
import styles from './EstacionesTable.module.css';

function EstacionesTable({ estaciones, onEditar, onInactivar }) {
  return (
    <div className={`tabla ${styles.raiz}`}>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estaciones.map((estacion) => {
            const inactiva = estacion.estado === 'INACTIVE';

            return (
              <tr key={estacion.id}>
                <td>{estacion.nombre}</td>
                <td>{estacion.direccion}</td>
                <td>
                  <EstadoBadge estado={estacion.estado} />
                </td>
                <td>
                  <div className={styles.acciones}>
                    <button
                      type="button"
                      className="boton"
                      disabled={inactiva}
                      onClick={() => onEditar(estacion.id)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="boton"
                      disabled={inactiva}
                      onClick={() => onInactivar(estacion.id)}
                    >
                      Inactivar
                    </button>
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