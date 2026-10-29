import AdminLayout from '../../../layouts/AdminLayout/AdminLayout.jsx';
import PlanesTable from './components/PlanesTable.jsx';
import PlanForm from './components/PlanForm.jsx';
import styles from './PlanesTarifasPage.module.css';

// Datos de ejemplo (solo maquetación)
const PLANES = [
  { id: 1, nombre: 'Viaje Único', costo: '$3.000', tiempo: 15 },
  { id: 2, nombre: 'Pase Diario', costo: '$8.000', tiempo: 30 },
  { id: 3, nombre: 'Plan Mensual', costo: '$40.000', tiempo: 45 },
  { id: 4, nombre: 'Plan Trimestral', costo: '$100.000', tiempo: 60 },
];

function PlanesTarifasPage() {
  return (
    <AdminLayout itemActivo="Planes y tarifas">
      <h1 className="titulo-pagina">Planes y tarifas</h1>

      <div className={styles.contenido}>
        <PlanesTable planes={PLANES} />
        <PlanForm />
      </div>
    </AdminLayout>
  );
}

export default PlanesTarifasPage;
