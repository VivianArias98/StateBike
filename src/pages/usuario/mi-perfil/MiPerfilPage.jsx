import { useEffect, useState } from 'react';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import Etiqueta from '../../../components/Etiqueta/Etiqueta.jsx';
import Aviso from '../../../components/Avisos/Aviso.jsx';
import { IconoInfo } from '../../../components/Iconos/Iconos.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import EstadoCarga from '../components/EstadoCarga.jsx';
import FormularioDatos from './components/FormularioDatos.jsx';
import TarjetaNfcPerfil from './components/TarjetaNfcPerfil.jsx';
import { mensajeError } from '../../../utils/mensajeError.js';
import {
  obtenerPerfil,
  actualizarPerfil,
  obtenerTarjeta,
  bloquearTarjeta,
  desbloquearTarjeta,
} from './perfilApi.js';
import styles from './MiPerfilPage.module.css';

const SIN_VINCULAR = 'SIN VINCULAR';

// Perfil del usuario (HU_1): datos personales, cambio de contraseña y tarjeta NFC.
// La página guarda el estado y habla con el backend; los componentes solo dibujan.
function MiPerfilPage() {
  const [perfil, setPerfil] = useState(null);
  const [estadoTarjeta, setEstadoTarjeta] = useState(SIN_VINCULAR);
  const [tarjeta, setTarjeta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');
  const [aviso, setAviso] = useState('');
  const [errorTarjeta, setErrorTarjeta] = useState('');
  const [procesandoTarjeta, setProcesandoTarjeta] = useState(false);

  // intento sube al pulsar "Reintentar" y vuelve a disparar la carga
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;
    Promise.all([obtenerPerfil(), obtenerTarjeta()])
      .then(([datosPerfil, datosTarjeta]) => {
        if (!activo) return;
        setPerfil(datosPerfil);
        setEstadoTarjeta(datosTarjeta.estadoTarjeta);
        setTarjeta(datosTarjeta.tarjeta);
        setErrorCarga('');
      })
      .catch((error) => {
        if (activo) setErrorCarga(mensajeError(error));
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
    setErrorCarga('');
    setIntento(intento + 1);
  };

  // Lo llama el formulario. Si falla, el error se lanza para que el formulario lo muestre.
  const guardarPerfil = async (datos) => {
    const respuesta = await actualizarPerfil(datos);
    setPerfil(respuesta.usuario);
    setAviso(respuesta.mensaje);
  };

  const cambiarEstadoTarjeta = async (bloquear) => {
    setProcesandoTarjeta(true);
    setErrorTarjeta('');
    try {
      const respuesta = bloquear ? await bloquearTarjeta() : await desbloquearTarjeta();
      setTarjeta(respuesta.tarjeta);
      setEstadoTarjeta(respuesta.tarjeta?.estado ?? SIN_VINCULAR);
      setAviso(respuesta.mensaje);
    } catch (error) {
      setErrorTarjeta(mensajeError(error));
    } finally {
      setProcesandoTarjeta(false);
    }
  };

  return (
    <UsuarioLayout itemActivo="Mi perfil">
      <div className={styles.raiz}>
        <EncabezadoPagina
          titulo={
            <>
              Mi Perfil <Etiqueta texto="Titular" color="menta" />
            </>
          }
          subtitulo="Gestión centralizada de credenciales, datos de identidad y acceso NFC a estaciones"
          acciones={
            perfil && (
              <span className={styles.idPerfil}>
                <span className={styles.punto} aria-hidden="true" />
                ID: {perfil.id}
              </span>
            )
          }
        />

        <EstadoCarga cargando={cargando} error={errorCarga} onReintentar={reintentar} />

        {!cargando && perfil && (
          <>
            <section className={`tarjeta ${styles.aviso}`} aria-label="Reglas del perfil">
              <span className={styles.iconoAviso} aria-hidden="true">
                <IconoInfo />
              </span>
              <p className={styles.textoAviso}>
                Puedes editar tu nombre, teléfono y contraseña. La fecha de nacimiento y el correo no se pueden
                modificar.
              </p>
            </section>

            <div className={styles.contenido}>
              {/* key: si el perfil cambia en el servidor, el formulario vuelve a tomar sus valores */}
              <FormularioDatos key={`${perfil.nombreCompleto}-${perfil.telefono}`} perfil={perfil} onGuardar={guardarPerfil} />
              <TarjetaNfcPerfil
                estado={estadoTarjeta}
                ultimos={tarjeta?.ultimosDigitos}
                titular={perfil.nombreCompleto}
                fechaVinculacion={tarjeta?.fechaVinculacion}
                procesando={procesandoTarjeta}
                error={errorTarjeta}
                onBloquear={() => cambiarEstadoTarjeta(true)}
                onDesbloquear={() => cambiarEstadoTarjeta(false)}
              />
            </div>
          </>
        )}
      </div>

      <Aviso mensaje={aviso} onCerrar={() => setAviso('')} />
    </UsuarioLayout>
  );
}

export default MiPerfilPage;
