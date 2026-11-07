import { useState } from 'react';
import styles from './FormularioPerfil.module.css';

const PATRON_CONTRASENA = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

// Valida los datos del perfil. Devuelve un objeto { campo: mensaje }.
function validar({ nombre, telefono, contrasenaNueva }) {
  const errores = {};
  if (!nombre.trim()) errores.nombre = 'El nombre es obligatorio';
  if (!/^\d{7,15}$/.test(telefono)) errores.telefono = 'El teléfono debe tener entre 7 y 15 dígitos';
  if (contrasenaNueva && !PATRON_CONTRASENA.test(contrasenaNueva)) {
    errores.contrasenaNueva = 'La contraseña nueva no cumple los requisitos';
  }
  return errores;
}

// Formulario de datos personales. El documento y el correo se muestran pero no se editan.
// La contraseña solo se envía si el usuario escribe una nueva.
function FormularioPerfil({ perfil, enviando, onGuardar }) {
  const [datos, setDatos] = useState({
    nombre: perfil.nombre,
    telefono: perfil.telefono,
    contrasenaActual: '',
    contrasenaNueva: '',
  });
  const [errores, setErrores] = useState({});

  function cambiar(campo, valor) {
    setDatos((anterior) => ({ ...anterior, [campo]: valor }));
  }

  async function enviar() {
    const encontrados = validar(datos);
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) return;
    const guardado = await onGuardar({ ...datos, nombre: datos.nombre.trim() });
    // Tras guardar bien, se limpian los campos de contraseña
    if (guardado) setDatos((anterior) => ({ ...anterior, contrasenaActual: '', contrasenaNueva: '' }));
  }

  return (
    <section className={`tarjeta ${styles.raiz}`}>
      <h2 className={styles.titulo}>Datos personales</h2>

      <div className="campo">
        <label htmlFor="perfil-nombre">Nombre completo</label>
        <input
          id="perfil-nombre"
          className="input"
          maxLength={100}
          value={datos.nombre}
          onChange={(e) => cambiar('nombre', e.target.value)}
        />
        {errores.nombre && <span className={styles.error} role="alert">{errores.nombre}</span>}
      </div>

      <div className="campo">
        <label htmlFor="perfil-telefono">Teléfono</label>
        <input
          id="perfil-telefono"
          className="input"
          inputMode="numeric"
          maxLength={15}
          value={datos.telefono}
          onChange={(e) => cambiar('telefono', e.target.value.replace(/\D/g, ''))}
        />
        {errores.telefono && <span className={styles.error} role="alert">{errores.telefono}</span>}
      </div>

      <div className="campo">
        <label htmlFor="perfil-correo">Correo electrónico</label>
        <input id="perfil-correo" className="input" value={perfil.correo} disabled />
      </div>

      <div className="campo">
        <label htmlFor="perfil-documento">Documento de identidad</label>
        <input id="perfil-documento" className="input" value={perfil.documento} disabled />
      </div>

      <fieldset className={styles.contrasena}>
        <legend className={styles.leyenda}>Cambiar contraseña (opcional)</legend>
        <div className="campo">
          <label htmlFor="perfil-contrasena-actual">Contraseña actual</label>
          <input
            id="perfil-contrasena-actual"
            type="password"
            autoComplete="current-password"
            className="input"
            value={datos.contrasenaActual}
            onChange={(e) => cambiar('contrasenaActual', e.target.value)}
          />
        </div>
        <div className="campo">
          <label htmlFor="perfil-contrasena-nueva">Contraseña nueva</label>
          <input
            id="perfil-contrasena-nueva"
            type="password"
            autoComplete="new-password"
            className="input"
            value={datos.contrasenaNueva}
            onChange={(e) => cambiar('contrasenaNueva', e.target.value)}
          />
          <span className={styles.ayuda}>Mínimo 8 caracteres, con letras y números.</span>
          {errores.contrasenaNueva && (
            <span className={styles.error} role="alert">{errores.contrasenaNueva}</span>
          )}
        </div>
      </fieldset>

      <div className={styles.acciones}>
        <button type="button" className="boton boton--secundario" onClick={enviar} disabled={enviando}>
          {enviando ? 'Guardando…' : 'GUARDAR CAMBIOS'}
        </button>
      </div>
    </section>
  );
}

export default FormularioPerfil;
