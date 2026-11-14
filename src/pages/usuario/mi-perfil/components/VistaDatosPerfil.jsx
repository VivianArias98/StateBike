import { useState } from 'react';
import { IconoCandado } from '../../../../components/Iconos/Iconos.jsx';
import AvatarCiclista from '../../../../components/AvataresCiclistas/AvatarCiclista.jsx';
import ModalSelectorAvatar from '../../../../components/AvataresCiclistas/ModalSelectorAvatar.jsx';
import { useUsuario } from '../../context/UsuarioContext.jsx';
import { formatearFechaCorta } from '../../formato.js';
import styles from './VistaDatosPerfil.module.css';

// Edad cumplida a partir de "YYYY-MM-DD"
function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return null;
  const [anio, mes, dia] = fechaNacimiento.split('-').map(Number);
  const hoy = new Date();
  let edad = hoy.getFullYear() - anio;
  if (hoy.getMonth() + 1 < mes || (hoy.getMonth() + 1 === mes && hoy.getDate() < dia)) edad -= 1;
  return edad;
}

// Vista de solo lectura de los datos de perfil del usuario (HU_1)
function VistaDatosPerfil({ perfil, onEditar }) {
  const { cambiarAvatar } = useUsuario();
  const [modalAvatarAbierto, setModalAvatarAbierto] = useState(false);
  const edad = calcularEdad(perfil.fechaNacimiento);

  return (
    <article className={`tarjeta ${styles.raiz}`} aria-labelledby="perfil-datos-titulo">
      <header className={styles.cabecera}>
        <div className={styles.textoCabecera}>
          <button
            type="button"
            className={styles.botonCambiarAvatar}
            onClick={() => setModalAvatarAbierto(true)}
            title="Cambiar avatar ciclista"
            aria-label="Cambiar avatar ciclista"
          >
            <AvatarCiclista id={perfil.avatar || 'mujer-casco-1'} tamano="xl" />
            <span className={styles.insigniaCamara} aria-hidden="true">
              ✎
            </span>
          </button>
          <div>
            <h2 id="perfil-datos-titulo" className={styles.titulo}>
              Datos de usuario
            </h2>
            <p className={styles.subtitulo}>Información personal y de contacto registrada en StationBike</p>
            <button
              type="button"
              className={styles.linkCambiarAvatar}
              onClick={() => setModalAvatarAbierto(true)}
            >
              Cambiar avatar ciclista
            </button>
          </div>
        </div>
      </header>

      <div className={styles.rejilla}>
        <div className={styles.campoDato}>
          <span className={styles.etiqueta}>Nombre completo</span>
          <p className={styles.valor}>{perfil.nombreCompleto || 'Sin registrar'}</p>
        </div>

        <div className={styles.campoDato}>
          <span className={styles.etiqueta}>Teléfono celular</span>
          <p className={styles.valor}>{perfil.telefono || 'Sin registrar'}</p>
        </div>

        <div className={styles.campoDato}>
          <div className={styles.filaEtiqueta}>
            <span className={styles.etiqueta}>Correo electrónico</span>
            <span className="insignia insignia--neutra">
              <IconoCandado /> Solo lectura
            </span>
          </div>
          <p className={styles.valor}>{perfil.correo || 'Sin registrar'}</p>
          <span className={styles.notaSeguridad}>No modificable por políticas de seguridad</span>
        </div>

        <div className={styles.campoDato}>
          <div className={styles.filaEtiqueta}>
            <span className={styles.etiqueta}>Fecha de nacimiento</span>
            <span className="insignia insignia--neutra">
              <IconoCandado /> Solo lectura
            </span>
          </div>
          <p className={styles.valor}>{formatearFechaCorta(perfil.fechaNacimiento) || 'Sin registrar'}</p>
          {edad !== null && <span className={styles.notaSeguridad}>Edad: {edad} años</span>}
        </div>
      </div>

      <div className={styles.seccionSeguridad}>
        <div className={styles.cabeceraSeguridad}>
          <div className={styles.iconoCandado} aria-hidden="true">
            <IconoCandado />
          </div>
          <div className={styles.textoSeguridad}>
            <span className={styles.etiqueta}>Contraseña de acceso</span>
            <p className={styles.claveMascara}>••••••••••••</p>
            <span className={styles.notaSeguridad}>Protegida y cifrada. Puedes cambiarla haciendo clic en "Editar información de perfil"</span>
          </div>
        </div>
      </div>

      <footer className={styles.pieAcciones}>
        <button
          type="button"
          className={`boton boton--primario ${styles.botonEditarLargo}`}
          onClick={onEditar}
        >
          Editar información de perfil
        </button>
      </footer>

      <ModalSelectorAvatar
        abierto={modalAvatarAbierto}
        avatarActual={perfil.avatar || 'mujer-casco-1'}
        onCerrar={() => setModalAvatarAbierto(false)}
        onSeleccionar={cambiarAvatar}
      />
    </article>
  );
}

export default VistaDatosPerfil;

