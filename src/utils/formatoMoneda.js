// Utilidades de formato para dinero (COP) y fechas. Compartidas por los módulos de usuario.

// 15000 -> "$15.000"
export function formatearCOP(valor) {
  return `$${Number(valor).toLocaleString('es-CO')}`;
}

// "2026-11-02T10:15:00" -> "02 nov 2026, 10:15 a. m."
export function formatearFechaHora(iso) {
  return new Date(iso).toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// El backend guarda las fechas en UTC con el formato "YYYY-MM-DD HH:MM:SS".
// Convierte ese texto a la hora de Colombia. conHora=false muestra solo la fecha.
// "2026-11-07 15:20:00" -> "07 nov 2026, 10:20 a. m."
export function formatearFechaBogota(fechaUtc, { conHora = true } = {}) {
  if (!fechaUtc) return '';
  const texto = String(fechaUtc).trim();
  const tieneZona = /([zZ]|[+-]\d{2}:\d{2})$/.test(texto);
  const fecha = new Date(tieneZona ? texto : `${texto.replace(' ', 'T')}Z`);
  if (Number.isNaN(fecha.getTime())) return '';

  const opciones = { timeZone: 'America/Bogota', day: '2-digit', month: 'short', year: 'numeric' };
  if (conHora) {
    opciones.hour = '2-digit';
    opciones.minute = '2-digit';
  }
  return fecha.toLocaleString('es-CO', opciones);
}
