// Cliente HTTP único para hablar con el servidor (Express en /api).
// En desarrollo Vite redirige /api al servidor (ver vite.config.js).
const BASE = import.meta.env.VITE_API_URL ?? '/api';

export class ErrorApi extends Error {
  constructor(status, codigo, mensaje) {
    super(mensaje ?? codigo);
    this.name = 'ErrorApi';
    this.status = status;
    this.codigo = codigo;
    this.mensaje = mensaje;
  }
}

export async function pedir(ruta, { metodo = 'GET', cuerpo, token } = {}) {
  const cabeceras = { Accept: 'application/json' };
  if (cuerpo !== undefined) cabeceras['Content-Type'] = 'application/json';
  if (token) cabeceras.Authorization = `Bearer ${token}`;

  let respuesta;
  try {
    respuesta = await fetch(`${BASE}${ruta}`, {
      method: metodo,
      headers: cabeceras,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    throw new ErrorApi(0, 'sin_conexion');
  }

  if (respuesta.status === 204) return null;

  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    throw new ErrorApi(respuesta.status, datos.error ?? 'error_servidor', datos.mensaje);
  }
  return datos;
}
