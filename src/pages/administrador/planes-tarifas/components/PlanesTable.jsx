import styles from './PlanesTable.module.css';

function PlanesTable({ planes }) {
  return (
    <div className={`tabla ${styles.raiz}`}>
      <table>
        <thead>
          <tr>
            <th>Plan</th>
            <th>Costo base (COP)</th>
            <th>Tiempo de referencia (min)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {planes.map((plan) => (
            <tr key={plan.id}>
              <td>{plan.nombre}</td>
              <td>{plan.costo}</td>
              <td>{plan.tiempo}</td>
              <td>
                <button type="button" className={`boton boton--secundario ${styles.editar}`}>
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlanesTable;
