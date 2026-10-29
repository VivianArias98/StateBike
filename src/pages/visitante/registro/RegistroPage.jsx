import VisitanteLayout from '../../../layouts/VisitanteLayout/VisitanteLayout.jsx';
import RegistroBienvenida from './components/RegistroBienvenida.jsx';
import RegistroForm from './components/RegistroForm.jsx';
import styles from './RegistroPage.module.css';

function RegistroPage() {
  return (
    <VisitanteLayout>
      <div className={`contexto-oscuro ${styles.tarjeta}`}>
        <RegistroBienvenida />
        <RegistroForm />
      </div>
    </VisitanteLayout>
  );
}

export default RegistroPage;