import VisitanteLayout from '../../../layouts/VisitanteLayout/VisitanteLayout.jsx';
import LoginBienvenida from './components/LoginBienvenida.jsx';
import LoginForm from './components/LoginForm.jsx';
import styles from './LoginPage.module.css';

function LoginPage() {
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

export default LoginPage;