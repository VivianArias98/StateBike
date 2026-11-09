import { textoError } from '../services/mensajesError.js';
import { formatearCOP } from './formatoMoneda.js';

// Códigos que genera el propio front (sin conexión o sesión vencida); su texto ya existe en mensajesError.js
const CODIGOS_DEL_CLIENTE = ['sin_conexion', 'token_requerido', 'token_expirado', 'refresco_invalido'];

// Texto que se muestra cuando el backend responde con error ({ error, mensaje }).
// - Si llega "mensaje", se muestra tal cual. Si trae el marcador "$X" (saldo insuficiente),
//   se reemplaza por el faltante que calcula la pantalla.
// - Si no llega "mensaje", la HU no define texto: se muestra solo el código, sin inventar uno.
export function mensajeError(error, { faltante } = {}) {
  if (error?.mensaje) {
    if (faltante !== undefined && faltante !== null) {
      return error.mensaje.replace('$X', formatearCOP(faltante));
    }
    return error.mensaje;
  }
  if (CODIGOS_DEL_CLIENTE.includes(error?.codigo)) return textoError(error);
  return error?.codigo ?? '';
}
