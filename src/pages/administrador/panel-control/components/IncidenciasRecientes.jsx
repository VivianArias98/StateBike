import { useNavigate } from 'react-router-dom';
import Etiqueta from '../../../../components/Etiqueta/Etiqueta.jsx';
import styles from './IncidenciasRecientes.module.css';

// incidencias: [{ id, tipo, detalle, estado }]
function IncidenciasRecientes({ incidencias, filtro }) {
  const navigate = useNavigate();
  return (
    <section className={`tarjeta ${styles.raiz}`} aria-labelledby="titulo-incidencias">
      <header className={styles.cabecera}>
        <h2 id="titulo-incidencias" className={styles.titulo}>
          Incidencias recientes
        </h2>
        <Etiqueta texto={`Filtro: ${filtro}`} color="menta" />
      </header>

      <div className={`tabla ${styles.tabla}`}>
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Detalle</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {incidencias.map((incidencia) => (
              <tr key={incidencia.id}>
                <td>{incidencia.tipo}</td>
                <td className={styles.detalle}>{incidencia.detalle}</td>
                <td>
                  <span className="insignia insignia--activa">{incidencia.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className={styles.pie}>
        <span className={styles.nota}>Solo consulta operacional</span>
        <button
          type="button"
          className={`enlace ${styles.enlace}`}
          onClick={() => navigate('/admin/incidencias')}
        >
          Ver todas las incidencias abiertas →
        </button>
      </footer>
    </section>
  );
}

export default IncidenciasRecientes;