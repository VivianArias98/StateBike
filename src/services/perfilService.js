// Servicio del perfil y la tarjeta NFC. HOY usa datos de ejemplo; cuando exista la API,
// cada función pasa a hacer fetch y el backend responde con estos mismos errores
// (las páginas no cambian).
// TODO: conectar con los endpoints de usuarios y tarjetas.

const ESPERA_MS = 300;
const esperar = () => new Promise((resolver) => setTimeout(resolver, ESPERA_MS));

// Requisito de la contraseña nueva: mínimo 8 caracteres, con letras y números
const PATRON_CONTRASENA = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

let contrasena = 'Camila2026'; // solo para la simulación

// Escenario inicial. Para probar los errores de la tarjeta cambia estos valores:
//  - tarjeta: null        -> «No tiene una tarjeta NFC vinculada»
//  - viajeEnCurso: true   -> «No puede bloquear la tarjeta con un viaje en curso»
let perfil = {
  nombre: 'Camila Rojas',
  correo: 'camila.rojas@uptc.edu.co',
  telefono: '3001234567',
  documento: '1049882',
  tarjeta: { ultimosDigitos: '8831', estado: 'ACTIVA', fechaCambio: null }, // estado: 'ACTIVA' | 'BLOQUEADA'
  viajeEnCurso: false,
};

export async function obtenerPerfil() {
  await esperar();
  return structuredClone(perfil);
}

// Actualiza nombre y teléfono (el documento y el correo no se editan).
// Si se envía contrasenaNueva, verifica la actual y los requisitos de la nueva.
export async function actualizarPerfil({ nombre, telefono, contrasenaActual, contrasenaNueva }) {
  await esperar();
  if (contrasenaNueva) {
    if (contrasenaActual !== contrasena) throw new Error('La contraseña actual es incorrecta');
    if (!PATRON_CONTRASENA.test(contrasenaNueva)) {
      throw new Error('La contraseña nueva no cumple los requisitos');
    }
    contrasena = contrasenaNueva;
  }
  perfil = { ...perfil, nombre, telefono };
  return { mensaje: 'PERFIL ACTUALIZADO CORRECTAMENTE', perfil: structuredClone(perfil) };
}

// Bloquear o desbloquear la tarjeta. Bloquear no cancela el plan ni detiene su vigencia.
// accion: 'bloquear' | 'desbloquear'
export async function cambiarEstadoTarjeta(accion, confirmacion) {
  await esperar();
  if (!perfil.tarjeta) throw new Error('No tiene una tarjeta NFC vinculada');
  if (accion === 'bloquear' && perfil.viajeEnCurso) {
    throw new Error('No puede bloquear la tarjeta con un viaje en curso');
  }
  if (!confirmacion) throw new Error('No se pudo procesar la solicitud');

  const bloquear = accion === 'bloquear';
  perfil = {
    ...perfil,
    tarjeta: {
      ...perfil.tarjeta,
      estado: bloquear ? 'BLOQUEADA' : 'ACTIVA',
      fechaCambio: new Date().toISOString(),
    },
  };
  return {
    mensaje: bloquear ? 'TARJETA BLOQUEADA CORRECTAMENTE' : 'TARJETA DESBLOQUEADA CORRECTAMENTE',
    perfil: structuredClone(perfil),
  };
}
