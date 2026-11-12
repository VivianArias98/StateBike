import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import TarjetaSaldo from './components/TarjetaSaldo.jsx';
import TarjetaCobroPendiente from './components/TarjetaCobroPendiente.jsx';
import TablaMovimientos from './components/TablaMovimientos.jsx';
import { useUsuario } from '../context/UsuarioContext.jsx';
import styles from './MiBilleteraPage.module.css';

// Mi billetera (HU_23): saldo, cobro pendiente y movimientos sincronizados con TunjaAPI.
function MiBilleteraPage() {
  const navegar = useNavigate();
  const { billetera, actualizarBilletera, perfil } = useUsuario();
  const [sincronizando, setSincronizando] = useState(false);

  // 1. Sincronizar inmediatamente al entrar a la página
  useEffect(() => {
    actualizarBilletera();
  }, [actualizarBilletera]);

  // 2. Sincronizar cada vez que el usuario vuelve a enfocar la pestaña del navegador
  useEffect(() => {
    function alEnfocarVentana() {
      actualizarBilletera();
    }
    window.addEventListener('focus', alEnfocarVentana);
    return () => window.removeEventListener('focus', alEnfocarVentana);
  }, [actualizarBilletera]);

  // 3. Sondeo en vivo cada 3 segundos para reflejar recargas de taquilla al instante
  useEffect(() => {
    const temporizador = setInterval(() => {
      actualizarBilletera();
    }, 3000);
    return () => clearInterval(temporizador);
  }, [actualizarBilletera]);

  const handleRefrescarManual = async () => {
    setSincronizando(true);
    await actualizarBilletera();
    setTimeout(() => setSincronizando(false), 500);
  };

  return (
    <UsuarioLayout itemActivo="Mi billetera">
      <div className={styles.raiz}>
        <header className={styles.cabecera}>
          <div className={styles.encabezadoTexto}>
            <h1 className={styles.titulo}>Mi Billetera</h1>
            <p className={styles.subtitulo}>
              Consulta tu saldo disponible, cobros pendientes y registro de movimientos de tu cuenta.
            </p>
          </div>
          <button
            type="button"
            className={styles.botonSincronizar}
            onClick={handleRefrescarManual}
            disabled={sincronizando}
            title="Sincronizar saldo con TunjaAPI en vivo"
          >
            <span className={sincronizando ? styles.girando : ''}>↻</span>
            <span>{sincronizando ? 'Sincronizando...' : 'Actualizar saldo'}</span>
          </button>
        </header>

        <div className={styles.principales}>
          <TarjetaSaldo saldo={billetera.saldo} />
          <TarjetaCobroPendiente
            cobro={billetera.cobroPendiente}
            onPagar={() => navegar('/billetera/pagar')}
          />
        </div>
        <TablaMovimientos
          movimientos={billetera.movimientos ?? []}
          perfil={perfil}
          saldo={billetera.saldo}
        />
      </div>
    </UsuarioLayout>
  );
}

export default MiBilleteraPage;
