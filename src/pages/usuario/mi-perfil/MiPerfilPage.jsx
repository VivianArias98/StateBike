import { useState } from 'react';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import Etiqueta from '../../../components/Etiqueta/Etiqueta.jsx';
import Aviso from '../../../components/Avisos/Aviso.jsx';
import { IconoInfo } from '../../../components/Iconos/Iconos.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import FormularioDatos from './components/FormularioDatos.jsx';
import TarjetaNfcPerfil from './components/TarjetaNfcPerfil.jsx';
import { useUsuario } from '../context/UsuarioContext.jsx';
import styles from './MiPerfilPage.module.css';

function MiPerfilPage() {
  const { perfil, actualizarPerfil, toggleBloqueoTarjeta } = useUsuario();
  const [aviso, setAviso] = useState('');
  const [errorTarjeta, setErrorTarjeta] = useState('');
  const [procesandoTarjeta, setProcesandoTarjeta] = useState(false);

  const guardarPerfil = async (datos) => {
    const res = await actualizarPerfil({
      nombreCompleto: datos.nombreCompleto,
      telefono: datos.telefono,
      contrasenaActual: datos.contrasenaActual,
      nuevaContrasena: datos.nuevaContrasena,
    });
    const mensaje = res?.mensaje || 'PERFIL ACTUALIZADO CORRECTAMENTE';
    setAviso(mensaje);
    return res;
  };

  const cambiarEstadoTarjeta = async () => {
    setProcesandoTarjeta(true);
    setErrorTarjeta('');
    try {
      const mensajeResultado = await toggleBloqueoTarjeta();
      setAviso(mensajeResultado);
    } catch (err) {
      setErrorTarjeta(err.message);
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
        />

        <section className={`tarjeta ${styles.aviso}`} aria-label="Reglas del perfil">
          <span className={styles.iconoAviso} aria-hidden="true">
            <IconoInfo />
          </span>
          <p className={styles.textoAviso}>
            Puedes editar tu nombre y teléfono. La fecha de nacimiento y el correo no se pueden modificar por políticas de seguridad de la red.
          </p>
        </section>

        {aviso && (
          <div className={styles.avisoExito} role="status">
            <span className={styles.iconoExito} aria-hidden="true">✓</span>
            <span className={styles.textoExito}>{aviso}</span>
            <button
              type="button"
              className={styles.cerrarExito}
              onClick={() => setAviso('')}
              aria-label="Cerrar aviso"
            >
              ×
            </button>
          </div>
        )}

        <div className={styles.contenido}>
          <FormularioDatos
            key={`${perfil.nombreCompleto}-${perfil.telefono}`}
            perfil={perfil}
            onGuardar={guardarPerfil}
          />
          <TarjetaNfcPerfil
            estado={perfil.tarjeta?.estado ?? 'SIN VINCULAR'}
            titular={perfil.nombreCompleto || 'Usuario'}
            fechaVinculacion={perfil.tarjeta?.fechaVinculacion}
            procesando={procesandoTarjeta}
            error={errorTarjeta}
            onBloquear={cambiarEstadoTarjeta}
            onDesbloquear={cambiarEstadoTarjeta}
          />
        </div>
      </div>

      <Aviso mensaje={aviso} onCerrar={() => setAviso('')} />
    </UsuarioLayout>
  );
}

export default MiPerfilPage;
