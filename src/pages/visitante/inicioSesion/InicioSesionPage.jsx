import VisitanteLayout from '../../../layouts/VisitanteLayout/VisitanteLayout.jsx';
import LoginBienvenida from './components/LoginBienvenida.jsx';
import LoginForm from './components/LoginForm.jsx';
import styles from './InicioSesionPage.module.css';

function InicioSesionPage() {
  return (
    <VisitanteLayout>
      <div className={styles.pagina}>
        <div className={styles.tarjeta}>
          <LoginBienvenida />
          <LoginForm />
        </div>
      </div>
    </VisitanteLayout>
  );
}

export default InicioSesionPage;
