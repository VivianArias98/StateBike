import AdminLayout from '../../../layouts/AdminLayout/AdminLayout.jsx';
import BicicletasTable from './components/BicicletasTable.jsx';
import BicicletaForm from './components/BicicletaForm.jsx';
import styles from './BicicletasPage.module.css';

// Datos de ejemplo (solo maquetación)
const BICICLETAS = [
  { id: 1, codigo: 'BIC-001', estacion: 'Central', estado: 'DISPONIBLE' },
  { id: 2, codigo: 'BIC-002', estacion: 'Plaza', estado: 'EN_USO' },
  { id: 3, codigo: 'BIC-003', estacion: 'Terminal', estado: 'DISPONIBLE' },
  { id: 4, codigo: 'BIC-004', estacion: 'Universidad', estado: 'NO_DISPONIBLE' },
  { id: 5, codigo: 'BIC-005', estacion: 'Central', estado: 'DISPONIBLE' },
];

function BicicletasPage() {
  return (
    <AdminLayout itemActivo="Bicicletas">
      <h1 className="titulo-pagina">Bicicletas</h1>

      <div className={styles.contenido}>
        <input
          type="text"
          className={`input ${styles.buscador}`}
          placeholder="Buscar por código"
          aria-label="Buscar por código"
        />
        <div className={styles.tabla}>
          <BicicletasTable bicicletas={BICICLETAS} />
        </div>
        <div className={styles.formulario}>
          <BicicletaForm />
        </div>
      </div>
    </AdminLayout>
  );
}

export default BicicletasPage;
