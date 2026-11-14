import BicicletaEstadoBadge from './BicicletaEstadoBadge.jsx';
import styles from './BicicletasTable.module.css';

function BicicletasTable({ bicicletas, onCambiarEstado, onInactivar, onActivar }) {
  return (
    <div className={`tabla ${styles.raiz}`}>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Estación</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {bicicletas.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--color-texto-suave)' }}>
                No hay bicicletas registradas
              </td>
            </tr>
          ) : (
            bicicletas.map((bicicleta) => {
              const enUso = bicicleta.estado === 'EN_USO';
              const inactiva = bicicleta.estado === 'INACTIVA';
              const deshabilitado = enUso || inactiva;

              const nuevoEstado = bicicleta.estado === 'DISPONIBLE' ? 'MANTENIMIENTO' : 'DISPONIBLE';
              const textoBotonEstado = bicicleta.estado === 'DISPONIBLE' ? 'Mantenimiento' : 'Habilitar';

              return (
                <tr key={bicicleta.id}>
                  <td><strong>{bicicleta.codigo}</strong></td>
                  <td>{bicicleta.estacion || '–'}</td>
                  <td>
                    <BicicletaEstadoBadge estado={bicicleta.estado} />
                  </td>
                  <td>
                    <div className={styles.acciones}>
                      <button
                        type="button"
                        className={`boton boton--secundario ${styles.botonAccion}`}
                        disabled={deshabilitado}
                        onClick={() => onCambiarEstado(bicicleta.id, nuevoEstado)}
                        title={enUso ? 'La bicicleta está en uso' : inactiva ? 'No se puede alternar el estado de una bicicleta inactiva' : undefined}
                      >
                        {textoBotonEstado}
                      </button>
                      {inactiva ? (
                        <button
                          type="button"
                          className={`boton boton--primario ${styles.botonAccion}`}
                          onClick={() => onActivar(bicicleta)}
                          title="Activar bicicleta y asignarla a una estación con anclajes libres"
                        >
                          Activar
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={`boton ${styles.botonAccion}`}
                          disabled={enUso}
                          onClick={() => onInactivar(bicicleta)}
                          title={enUso ? 'La bicicleta está en uso' : 'Inactivar bicicleta y liberar su anclaje'}
                        >
                          Inactivar
                        </button>
                      )}
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

export default BicicletasTable;
