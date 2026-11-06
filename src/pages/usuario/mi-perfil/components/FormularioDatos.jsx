import { useState } from 'react';
import BarraProgreso from '../../../../components/BarraProgreso/BarraProgreso.jsx';
import Etiqueta from '../../../../components/Etiqueta/Etiqueta.jsx';
import { IconoCandado, IconoCheck, IconoOjo } from '../../../../components/Iconos/Iconos.jsx';
import styles from './FormularioDatos.module.css';

const LONGITUD_MINIMA = 8;

// Formulario del perfil: datos editables, campos de solo lectura y cambio de contraseña.
// Los valores se guardan aquí porque son solo de maquetación; el envío queda pendiente.
function FormularioDatos({ perfil }) {
  const [nombre, setNombre] = useState(perfil.nombre);
  const [telefono, setTelefono] = useState(perfil.telefono);
  const [claveActual, setClaveActual] = useState('');
  const [claveNueva, setClaveNueva] = useState('');
  const [mostrarActual, setMostrarActual] = useState(false);
  const [mostrarNueva, setMostrarNueva] = useState(false);

  // Pendiente: guardar los cambios en el backend
  const guardar = (evento) => evento.preventDefault();

  const longitud = claveNueva.length;

  return (
    <form className={`tarjeta ${styles.raiz}`} onSubmit={guardar}>
      <header className={styles.cabecera}>
        <div className={styles.textoCabecera}>
          <h2 className={styles.titulo}>Datos de usuario</h2>
          <p className={styles.subtitulo}>Información de contacto y credenciales de acceso</p>
        </div>
        <Etiqueta texto="Verificado" color="verde" />
      </header>

      <div className={styles.rejilla}>
        <div className="campo">
          <label htmlFor="perfil-nombre">Nombre completo</label>
          <input id="perfil-nombre" className="input" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>

        <div className="campo">
          <label htmlFor="perfil-telefono">Teléfono celular</label>
          <input
            id="perfil-telefono"
            className="input"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        <div className="campo">
          <div className={styles.filaCampo}>
            <label htmlFor="perfil-documento">Documento de identidad</label>
            <span className="insignia insignia--neutra">
              <IconoCandado /> Solo lectura
            </span>
          </div>
          <input id="perfil-documento" className={`input ${styles.soloLectura}`} value={perfil.documento} readOnly />
          <p className={styles.ayuda}>Cédula de Ciudadanía colombiana</p>
        </div>

        <div className="campo">
          <div className={styles.filaCampo}>
            <label htmlFor="perfil-nacimiento">Fecha de nacimiento</label>
            <span className="insignia insignia--neutra">
              <IconoCandado /> Solo lectura
            </span>
          </div>
          <input
            id="perfil-nacimiento"
            className={`input ${styles.soloLectura}`}
            value={perfil.fechaNacimiento}
            readOnly
          />
          <p className={styles.ayuda}>Edad validada: {perfil.edad} años</p>
        </div>
      </div>

      <div className={styles.seccion}>
        <div className={styles.cabeceraCredenciales}>
          <p className={styles.tituloCredenciales}>
            <IconoCandado /> Credenciales de seguridad
          </p>
          <p className={styles.ayuda}>Última actualización: hace 3 meses</p>
        </div>

        <div className={styles.rejilla}>
          <div className="campo">
            <label htmlFor="perfil-clave-actual">Contraseña actual</label>
            <div className={styles.conBoton}>
              <input
                id="perfil-clave-actual"
                type={mostrarActual ? 'text' : 'password'}
                className={`input ${styles.inputConBoton}`}
                value={claveActual}
                onChange={(e) => setClaveActual(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.botonOjo}
                aria-label={mostrarActual ? 'Ocultar contraseña actual' : 'Mostrar contraseña actual'}
                onClick={() => setMostrarActual(!mostrarActual)}
              >
                <IconoOjo />
              </button>
            </div>
            <p className={styles.ayuda}>Requerida únicamente para validar cambios</p>
          </div>

          <div className="campo">
            <label htmlFor="perfil-clave-nueva">Nueva contraseña</label>
            <div className={styles.conBoton}>
              <input
                id="perfil-clave-nueva"
                type={mostrarNueva ? 'text' : 'password'}
                className={`input ${styles.inputConBoton}`}
                placeholder={`Mínimo ${LONGITUD_MINIMA} caracteres`}
                value={claveNueva}
                onChange={(e) => setClaveNueva(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.botonOjo}
                aria-label={mostrarNueva ? 'Ocultar nueva contraseña' : 'Mostrar nueva contraseña'}
                onClick={() => setMostrarNueva(!mostrarNueva)}
              >
                <IconoOjo />
              </button>
            </div>
            <div className={styles.fuerza}>
              <BarraProgreso
                valor={Math.min(longitud, LONGITUD_MINIMA)}
                maximo={LONGITUD_MINIMA}
                etiqueta="Fuerza de la nueva contraseña"
              />
              {longitud >= LONGITUD_MINIMA && <span className={styles.textoFuerza}>Fuerza: Segura</span>}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.acciones}>
        <button type="submit" className={`boton boton--acento ${styles.guardar}`}>
          <IconoCheck /> Guardar cambios
        </button>
        <button type="button" className="boton">
          Cancelar
        </button>
        <p className={styles.cifrado}>Cambios encriptados de extremo a extremo</p>
      </div>
    </form>
  );
}

export default FormularioDatos;
