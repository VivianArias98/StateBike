import './PlanesTable.css';

function PlanesTable({ planes }) {
  return (
    <div className="tabla-planes">
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
                <button type="button" className="tabla-planes__editar">
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
