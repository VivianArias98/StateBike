// Servicio de incidencias. HOY simula el registro; cuando exista la API, hace un POST y el
// backend guarda la incidencia con estado ABIERTA y notifica al administrador.
// TODO: conectar con el endpoint de incidencias.

const ESPERA_MS = 300;
const esperar = () => new Promise((resolver) => setTimeout(resolver, ESPERA_MS));

// Tipos de incidencia del requisito «Reportar daño o incidencia»
export const TIPO_NFC = 'Tarjeta NFC perdida o dañada';
export const TIPOS_INCIDENCIA = ['Daño en bicicleta', 'Daño en estación', TIPO_NFC, 'Otro'];

export async function registrarIncidencia({ tipo, idBicicleta, idEstacion, descripcion }) {
  await esperar();
  return {
    mensaje: 'REPORTE ENVIADO CON ÉXITO',
    incidencia: {
      radicado: `INC-${Date.now().toString().slice(-6)}`,
      estado: 'ABIERTA',
      tipo,
      idBicicleta,
      idEstacion,
      descripcion,
      fecha: new Date().toISOString(),
    },
  };
}
