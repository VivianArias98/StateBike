import BicicletaEstadoBadge from './BicicletaEstadoBadge.jsx';
import './BicicletasTable.css';

function BicicletasTable({ bicicletas }) {
  return (
    <div className="tabla-bicicletas">
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Estación</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {bicicletas.map((bicicleta) => (
            <tr key={bicicleta.id}>
              <td>{bicicleta.codigo}</td>
              <td>{bicicleta.estacion}</td>
              <td>
                <BicicletaEstadoBadge estado={bicicleta.estado} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BicicletasTable;
