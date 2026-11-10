// Mismas reglas y mensajes que el backend (auth.service.js), en el mismo orden.
const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LARGO_MAX_CORREO = 100;
const LARGO_MIN_CONTRASENA = 8;
const EDAD_MINIMA = 18;

const vacio = (valor) => typeof valor !== 'string' || valor.trim() === '';

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
  if (vacio(correo) || vacio(contrasena)) return 'Hay campos obligatorios vacíos';
  return null;
}

export function validarRegistro(datos) {
  const { nombreCompleto, fechaNacimiento, correo, contrasena, confirmacion, aceptaTerminos } = datos;

  if ([nombreCompleto, fechaNacimiento, correo, contrasena, confirmacion].some(vacio)) {
    return 'Hay campos obligatorios vacíos';
  }
  const email = correo.trim();
  if (email.length > LARGO_MAX_CORREO || !FORMATO_CORREO.test(email)) {
    return 'Correo inválido';
  }
  if (contrasena.length < LARGO_MIN_CONTRASENA) {
    return 'La contraseña no cumple los requisitos';
  }
  if (contrasena !== confirmacion) return 'Las contraseñas no coinciden';
  if (!esFechaValida(fechaNacimiento)) return 'La fecha de nacimiento no es válida';
  if (!esMayorDeEdad(fechaNacimiento)) return 'Debe ser mayor de edad para registrarse';
  if (aceptaTerminos !== true) return 'Debe aceptar los términos y condiciones para registrarse';
  return null;
}
