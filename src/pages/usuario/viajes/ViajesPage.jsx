import { useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import { useUsuario } from '../context/UsuarioContext.jsx';
import { useCronometro } from './useCronometro.js';
import EsperaTotem from './components/EsperaTotem.jsx';
import ViajeEnCurso from './components/ViajeEnCurso.jsx';
import ResumenViaje from './components/ResumenViaje.jsx';
import styles from './ViajesPage.module.css';

// El viaje lo inician y lo cierran en el tótem de la estación: esta pantalla solo lo acompaña
function ViajesPage() {
  const navigate = useNavigate();
  const { perfil, plan, billetera, viajeActivo, ultimoViaje, descartarUltimoViaje, estaciones } =
    useUsuario();
  const segundos = useCronometro(viajeActivo);

  const irAPagarCobro = () => navigate('/billetera/pagar');

  return (
    <UsuarioLayout itemActivo="Viajes">
      <div className={styles.raiz}>
        <EncabezadoPagina
          etiqueta="Usuario / Operación del servicio / Gestión de viajes"
          titulo="Viajes"
          subtitulo="Inicia y finaliza tu viaje acercando tu tarjeta NFC al tótem de una estación."
        />

        {viajeActivo && (
          <ViajeEnCurso
            viaje={viajeActivo}
            segundos={segundos}
            estaciones={estaciones}
            onReportar={() => navigate('/incidencias', { state: { bicicleta: viajeActivo.bicicleta } })}
          />
        )}

        {!viajeActivo && ultimoViaje && (
          <ResumenViaje
            mensaje={ultimoViaje.mensaje}
            aviso={ultimoViaje.aviso}
            viaje={ultimoViaje.viaje}
            onCerrar={descartarUltimoViaje}
            onHistorial={() => navigate('/historial')}
            onPagarCobro={irAPagarCobro}
          />
        )}

        {!viajeActivo && !ultimoViaje && (
          <EsperaTotem
            tarjeta={perfil?.tarjeta}
            plan={plan?.tienePlan ? plan.planActivo : null}
            cobroPendiente={billetera?.tieneCobroPendiente ? billetera.cobroPendiente : null}
            estaciones={estaciones}
            onPagarCobro={irAPagarCobro}
          />
        )}
      </div>
    </UsuarioLayout>
  );
}

export default ViajesPage;