import { useEffect, useState } from 'react';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import Aviso from '../../../components/Avisos/Aviso.jsx';
import FormularioPerfil from './components/FormularioPerfil.jsx';
import TarjetaNfc from './components/TarjetaNfc.jsx';
import { obtenerPerfil, actualizarPerfil, cambiarEstadoTarjeta } from '../../../services/perfilService.js';
import styles from './PerfilPage.module.css';

// Página de Mi perfil: consultar y actualizar datos, y bloquear o desbloquear la tarjeta NFC.
// Guarda el estado y la lógica; los componentes solo dibujan.
function PerfilPage() {
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    obtenerPerfil()
      .then(setPerfil)
      .catch(() => setError('No se pudo cargar tu perfil. Intenta de nuevo.'))
      .finally(() => setCargando(false));
  }, []);

  // Devuelve true si se guardó, para que el formulario limpie los campos de contraseña
  async function guardar(datos) {
    setEnviando(true);
    setError('');
    try {
      const resultado = await actualizarPerfil(datos);
      setPerfil(resultado.perfil);
      setAviso(resultado.mensaje);
      return true;
    } catch (fallo) {
      setError(fallo.message);
      return false;
    } finally {
      setEnviando(false);
    }
  }

  // accion: 'bloquear' | 'desbloquear' (el usuario ya confirmó en la tarjeta)
  async function cambiarEstado(accion) {
    setEnviando(true);
    setError('');
    try {
      const resultado = await cambiarEstadoTarjeta(accion, true);
      setPerfil(resultado.perfil);
      setAviso(resultado.mensaje);
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <UsuarioLayout itemActivo="Mi Perfil">
      <div className={styles.raiz}>
        <header className={styles.encabezado}>
          <h1 className={styles.titulo}>Mi perfil</h1>
          <p className={styles.subtitulo}>Consulta y actualiza tus datos de contacto y tu contraseña, y administra tu tarjeta NFC.</p>
        </header>

        {cargando && <p className={styles.estado}>Cargando tu perfil…</p>}
        {error && (
          <p className="mensaje-error" role="alert">
            {error}
          </p>
        )}

        {perfil && (
          <div className={styles.contenido}>
            <FormularioPerfil perfil={perfil} enviando={enviando} onGuardar={guardar} />
            <TarjetaNfc tarjeta={perfil.tarjeta} enviando={enviando} onCambiarEstado={cambiarEstado} />
          </div>
        )}
      </div>
      <Aviso mensaje={aviso} onCerrar={() => setAviso('')} />
    </UsuarioLayout>
  );
}

export default PerfilPage;
