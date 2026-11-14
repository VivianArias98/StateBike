import { pedir, ErrorApi } from './apiClient.js';
import { leerSesion, guardarSesion, borrarSesion } from './sesion.js';

export async function registrar(datos) {
  return pedir('/auth/register', { metodo: 'POST', cuerpo: datos });
}

export async function iniciarSesion(correo, contrasena) {
  const datos = await pedir('/auth/login', {
    metodo: 'POST',
    cuerpo: { correo, contrasena },
  });
  guardarSesion(datos);
  return datos.usuario;
}

// Pide un nuevo acceso con el refresco guardado. El refresco rota: se guarda el nuevo.
export async function refrescarSesion() {
  const sesion = leerSesion();
  if (!sesion?.refresco) throw new ErrorApi(401, 'refresco_invalido');
  try {
    const datos = await pedir('/auth/refresh', {
      metodo: 'POST',
      cuerpo: { refresco: sesion.refresco },
    });
    guardarSesion(datos);
    return datos;
  } catch (error) {
    borrarSesion();
    throw error;
  }
}

export async function cerrarSesion() {
  const sesion = leerSesion();
  borrarSesion();
  if (sesion?.refresco) {
    try {
      await pedir('/auth/logout', { metodo: 'POST', cuerpo: { refresco: sesion.refresco } });
    } catch {
      // La sesión local ya está borrada; un fallo al avisar al servidor no cambia nada para la persona.
    }
  }
}

// Petición con sesión. Si el acceso venció, lo renueva una vez y reintenta.
export async function pedirAutenticado(ruta, opciones = {}) {
  const sesion = leerSesion();
  if (!sesion?.acceso) throw new ErrorApi(401, 'token_requerido');
  try {
    return await pedir(ruta, { ...opciones, token: sesion.acceso });
  } catch (error) {
    if (error.codigo !== 'token_expirado') throw error;
    const nueva = await refrescarSesion();
    return pedir(ruta, { ...opciones, token: nueva.acceso });
  }
}

export async function obtenerUsuarioActual() {
  const datos = await pedirAutenticado('/auth/me');
  return datos.usuario;
}
