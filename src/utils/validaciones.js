// Mismas reglas y mensajes que el backend (auth.service.js), en el mismo orden.
const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LARGO_MAX_CORREO = 100;
const LARGO_MIN_CONTRASENA = 8;
const TIENE_LETRAS = /[a-zA-Z]/;
const TIENE_NUMEROS = /[0-9]/;
const EDAD_MINIMA = 18;

function esMayorDeEdad(fechaTexto) {
  const [anio, mes, dia] = fechaTexto.split('-').map(Number);
  const hoy = new Date();
  let edad = hoy.getFullYear() - anio;
  const mesActual = hoy.getMonth() + 1;
  const yaCumplio = mesActual > mes || (mesActual === mes && hoy.getDate() >= dia);
  if (!yaCumplio) edad -= 1;
  return edad >= EDAD_MINIMA;
}

function esFechaValida(fechaTexto) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaTexto)) return false;
  const fecha = new Date(`${fechaTexto}T00:00:00`);
  return !Number.isNaN(fecha.getTime()) && fecha <= new Date();
}

// Devuelve el mensaje del primer error o null si todo está bien.
export function validarLogin({ correo, contrasena }) {
  const c = typeof correo === 'string' ? correo.trim() : '';
  const p = typeof contrasena === 'string' ? contrasena.trim() : '';
  if (!c || !p) return 'Hay campos obligatorios vacíos';
  return null;
}

export function validarCamposRegistro(datos = {}) {
  const errores = {};
  const nombreCompleto = typeof datos.nombreCompleto === 'string' ? datos.nombreCompleto.trim().replace(/\s+/g, ' ') : '';
  const fechaNacimiento = typeof datos.fechaNacimiento === 'string' ? datos.fechaNacimiento.trim() : '';
  const correo = typeof datos.correo === 'string' ? datos.correo.trim().toLowerCase() : '';
  const telefono = typeof datos.telefono === 'string' || typeof datos.telefono === 'number' ? String(datos.telefono).trim().replace(/\s+/g, '') : '';
  const contrasena = typeof datos.contrasena === 'string' ? datos.contrasena.trim() : '';
  const confirmacion = typeof datos.confirmacion === 'string' ? datos.confirmacion.trim() : '';
  const aceptaTerminos = datos.aceptaTerminos;

  if (!nombreCompleto) {
    errores.nombreCompleto = 'El nombre completo es obligatorio';
  }

  if (!fechaNacimiento) {
    errores.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
  } else if (!esFechaValida(fechaNacimiento)) {
    errores.fechaNacimiento = 'La fecha de nacimiento no es válida';
  } else if (!esMayorDeEdad(fechaNacimiento)) {
    errores.fechaNacimiento = 'Debe ser mayor de edad para poder registrarse';
  }

  if (!correo) {
    errores.correo = 'El correo electrónico es obligatorio';
  } else if (correo.length > LARGO_MAX_CORREO || !FORMATO_CORREO.test(correo)) {
    errores.correo = 'Correo electrónico inválido';
  }

  if (!telefono) {
    errores.telefono = 'El teléfono celular es obligatorio';
  } else if (!/^\+?\d{7,15}$/.test(telefono)) {
    errores.telefono = 'El número de teléfono o celular no es válido';
  }

  if (!contrasena) {
    errores.contrasena = 'La contraseña es obligatoria';
  } else if (
    contrasena.length < LARGO_MIN_CONTRASENA ||
    !TIENE_LETRAS.test(contrasena) ||
    !TIENE_NUMEROS.test(contrasena)
  ) {
    errores.contrasena = 'La contraseña debe tener mínimo 8 caracteres e incluir letras y números';
  }

  if (!confirmacion) {
    errores.confirmacion = 'Debe confirmar su contraseña';
  } else if (contrasena !== confirmacion) {
    errores.confirmacion = 'Las contraseñas no coinciden';
  }

  if (aceptaTerminos !== true) {
    errores.aceptaTerminos = 'Debe aceptar los términos y condiciones para registrarse';
  }

  return errores;
}

export function validarRegistro(datos = {}) {
  const nombreCompleto = typeof datos.nombreCompleto === 'string' ? datos.nombreCompleto.trim().replace(/\s+/g, ' ') : '';
  const fechaNacimiento = typeof datos.fechaNacimiento === 'string' ? datos.fechaNacimiento.trim() : '';
  const correo = typeof datos.correo === 'string' ? datos.correo.trim().toLowerCase() : '';
  const telefono = typeof datos.telefono === 'string' || typeof datos.telefono === 'number' ? String(datos.telefono).trim().replace(/\s+/g, '') : '';
  const contrasena = typeof datos.contrasena === 'string' ? datos.contrasena.trim() : '';
  const confirmacion = typeof datos.confirmacion === 'string' ? datos.confirmacion.trim() : '';
  const aceptaTerminos = datos.aceptaTerminos;

  if (
    !nombreCompleto ||
    !fechaNacimiento ||
    !correo ||
    !telefono ||
    !contrasena ||
    !confirmacion
  ) {
    return 'Hay campos obligatorios vacíos';
  }

  if (correo.length > LARGO_MAX_CORREO || !FORMATO_CORREO.test(correo)) {
    return 'Correo inválido';
  }

  if (!/^\+?\d{7,15}$/.test(telefono)) {
    return 'El número de teléfono o celular no es válido';
  }

  if (
    contrasena.length < LARGO_MIN_CONTRASENA ||
    !TIENE_LETRAS.test(contrasena) ||
    !TIENE_NUMEROS.test(contrasena)
  ) {
    return 'La contraseña debe tener mínimo 8 caracteres e incluir letras y números';
  }

  if (contrasena !== confirmacion) return 'Las contraseñas no coinciden';
  if (!esFechaValida(fechaNacimiento)) return 'La fecha de nacimiento no es válida';
  if (!esMayorDeEdad(fechaNacimiento)) return 'Debe ser mayor de edad para poder crear una cuenta';
  if (aceptaTerminos !== true) return 'Debe aceptar los términos y condiciones para registrarse';
  return null;
}
