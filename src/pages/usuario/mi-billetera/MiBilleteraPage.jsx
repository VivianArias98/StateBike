import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import EstadoCarga from '../components/EstadoCarga.jsx';
import TarjetaSaldo from './components/TarjetaSaldo.jsx';
import TarjetaCobroPendiente from './components/TarjetaCobroPendiente.jsx';
import TablaMovimientos from './components/TablaMovimientos.jsx';
import { mensajeError } from '../../../utils/mensajeError.js';
import { obtenerBilletera } from './billeteraApi.js';
import styles from './MiBilleteraPage.module.css';

// Mi billetera (HU_23): saldo, cobro pendiente y movimientos.
// La página trae los datos; las tarjetas y la tabla solo los dibujan.
function MiBilleteraPage() {
  const navegar = useNavigate();
  const [billetera, setBilletera] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  // intento sube al pulsar "Reintentar" y vuelve a disparar la carga
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;
    obtenerBilletera()
      .then((datos) => {
        if (!activo) return;
        setBilletera(datos);
        setError('');
      })
      .catch((errorApi) => {
        if (activo) setError(mensajeError(errorApi));
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [intento]);

  const reintentar = () => {
    setCargando(true);
    setError('');
    setIntento(intento + 1);
  };

  return (
    <UsuarioLayout itemActivo="Mi billetera">
      <div className={styles.raiz}>
        <header className={styles.cabecera}>
          <h1 className={styles.titulo}>Mi Billetera</h1>
          <p className={styles.subtitulo}>
            Consulta tu saldo disponible, cobros pendientes y registro de movimientos de tu cuenta.
          </p>
        </header>

        <EstadoCarga cargando={cargando} error={error} onReintentar={reintentar} />

        {!cargando && billetera && (
          <>
            <div className={styles.principales}>
              <TarjetaSaldo saldo={billetera.saldo} onRecargar={() => navegar('/billetera/recargar')} />
              <TarjetaCobroPendiente
                cobro={billetera.cobroPendiente}
                onPagar={() => navegar('/billetera/pagar')}
              />
            </div>
            <TablaMovimientos movimientos={billetera.movimientos ?? []} />
          </>
        )}
      </div>
    </UsuarioLayout>
  );
}

export default MiBilleteraPage;
