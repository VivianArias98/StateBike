import React from 'react';
import { useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import TarjetaSaldo from './components/TarjetaSaldo.jsx';
import TarjetaCobroPendiente from './components/TarjetaCobroPendiente.jsx';
import TablaMovimientos from './components/TablaMovimientos.jsx';
import { useUsuario } from '../context/UsuarioContext.jsx';
import styles from './MiBilleteraPage.module.css';

// Mi billetera (HU_23): saldo, cobro pendiente y movimientos.
function MiBilleteraPage() {
  const navegar = useNavigate();
  const { billetera } = useUsuario();

  return (
    <UsuarioLayout itemActivo="Mi billetera">
      <div className={styles.raiz}>
        <header className={styles.cabecera}>
          <h1 className={styles.titulo}>Mi Billetera</h1>
          <p className={styles.subtitulo}>
            Consulta tu saldo disponible, cobros pendientes y registro de movimientos de tu cuenta.
          </p>
        </header>

        <div className={styles.principales}>
          <TarjetaSaldo saldo={billetera.saldo} onRecargar={() => navegar('/billetera/recargar')} />
          <TarjetaCobroPendiente
            cobro={billetera.cobroPendiente}
            onPagar={() => navegar('/billetera/pagar')}
          />
        </div>
        <TablaMovimientos movimientos={billetera.movimientos ?? []} />
      </div>
    </UsuarioLayout>
  );
}

export default MiBilleteraPage;
