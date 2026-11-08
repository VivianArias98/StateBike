// Texto que ve la persona cuando el servidor responde con error.
// Si el servidor manda "mensaje" se usa ese; si solo manda el código, aquí va el texto.
const TEXTOS = {
  campos_vacios: 'Hay campos obligatorios vacíos',
  token_requerido: 'Debes iniciar sesión para continuar',
  token_expirado: 'Tu sesión expiró. Vuelve a iniciar sesión',
  refresco_invalido: 'Tu sesión ya no es válida. Vuelve a iniciar sesión',
  fecha_invalida: 'La fecha de nacimiento no es válida',
  sin_conexion: 'No se pudo conectar con el servidor. Intenta de nuevo',
  error_servidor: 'Ocurrió un error inesperado. Intenta de nuevo',
};

export function textoError(error) {
  return error?.mensaje || TEXTOS[error?.codigo] || TEXTOS.error_servidor;
}
