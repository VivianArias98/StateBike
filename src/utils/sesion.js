// Sesión del usuario guardada en el navegador (acceso + refresco + datos del perfil).
// Cada acceso al almacenamiento va protegido: puede fallar en navegación privada o con datos bloqueados.
const CLAVE = 'stationbike.sesion';

export const ROLES = {
  ADMINISTRADOR: 'ADMINISTRADOR',
  USUARIO: 'USUARIO',
};

export function leerSesion() {
  try {
    const crudo = localStorage.getItem(CLAVE);
    return crudo ? JSON.parse(crudo) : null;
  } catch {
    return null;
  }
}

export function guardarSesion(sesion) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(sesion));
  } catch {
    // Sin almacenamiento disponible la sesión dura solo mientras la pestaña esté abierta en memoria.
  }
}

export function borrarSesion() {
  try {
    localStorage.removeItem(CLAVE);
  } catch {
    // Nada que borrar si el almacenamiento no está disponible.
  }
}

// Ruta de inicio según el rol del usuario autenticado.
export function rutaInicio(rol) {
  if (rol === ROLES.ADMINISTRADOR) return '/admin';
  if (rol === ROLES.USUARIO) return '/inicio';
  return '/login';
}
