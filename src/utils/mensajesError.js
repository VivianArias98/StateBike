// Texto que ve la persona cuando el servidor responde con error.
// Si el servidor manda "mensaje" se usa ese; si solo manda el código, aquí va el texto.
const TEXTOS = {
  campos_vacios: 'Hay campos obligatorios vacíos',
  credenciales_invalidas: 'Correo o contraseña incorrectos',
  usuario_inactivo: 'La cuenta se encuentra inactiva. Contacte al administrador',
  tunja_no_responde: 'El servicio externo (TunjaAPI) no responde. Revisa tu conexión a internet o intenta más tarde',
  clave_tunja_invalida: 'La clave de TunjaAPI configurada en el servidor es inválida',
  error_interno: 'Error interno del servidor. Intenta de nuevo',
  sin_permisos: 'No tienes permisos para acceder a esta sección',
  correo_ya_registrado: 'El correo ya se encuentra registrado',
  contrasena_debil: 'La contraseña debe tener mínimo 8 caracteres e incluir letras y números',
  correo_invalido: 'El correo electrónico no es válido',
  token_requerido: 'Debes iniciar sesión para continuar',
  token_expirado: 'Tu sesión expiró. Vuelve a iniciar sesión',
  refresco_invalido: 'Tu sesión ya no es válida. Vuelve a iniciar sesión',
  fecha_invalida: 'La fecha de nacimiento no es válida',
  monto_fuera_rango: 'El monto debe estar entre $100 y $500.000 COP',
  recarga_supera_maximo: 'La recarga supera el saldo máximo permitido de $2.000.000 COP',
  sin_conexion: 'No se pudo conectar con el servidor. Intenta de nuevo',
  error_servidor: 'Ocurrió un error inesperado. Intenta de nuevo',
};

export function textoError(error) {
  if (
    error?.codigo === 'contrasena_debil' ||
    error?.mensaje === 'La contraseña no cumple los requisitos' ||
    error?.mensaje === 'La contraseña no cumple los requisitos mínimos'
  ) {
    return 'La contraseña debe tener mínimo 8 caracteres e incluir letras y números';
  }
  return error?.mensaje || TEXTOS[error?.codigo] || TEXTOS.error_servidor;
}
