import { pedirAutenticado } from '../../../services/authService.js';

// Llamadas al backend del módulo Mi perfil (HU_1).
// pedirAutenticado envía el token y lo renueva solo si vence.

// GET /api/perfil -> { id, nombreCompleto, correo, fechaNacimiento, telefono, tarjeta, ... }
export function obtenerPerfil() {
  return pedirAutenticado('/perfil');
}

// PUT /api/perfil con { nombreCompleto, telefono, contrasenaActual?, nuevaContrasena? }
// -> { mensaje, usuario }
export function actualizarPerfil(datos) {
  return pedirAutenticado('/perfil', { metodo: 'PUT', cuerpo: datos });
}

// GET /api/tarjeta -> { estadoTarjeta: 'ACTIVA' | 'BLOQUEADA' | 'SIN VINCULAR', tarjeta }
export function obtenerTarjeta() {
  return pedirAutenticado('/tarjeta');
}

// PATCH /api/tarjeta/bloquear -> { mensaje, tarjeta }
export function bloquearTarjeta() {
  return pedirAutenticado('/tarjeta/bloquear', { metodo: 'PATCH' });
}

// PATCH /api/tarjeta/desbloquear -> { mensaje, tarjeta }
export function desbloquearTarjeta() {
  return pedirAutenticado('/tarjeta/desbloquear', { metodo: 'PATCH' });
}
