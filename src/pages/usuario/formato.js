// Formato de cifras y fechas para las pantallas de usuario.
const formatoPesos = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

// Ejemplo: 32000 -> "$32.000"
export function formatearPesos(valor) {
  return `$${formatoPesos.format(valor)}`;
}

// Ejemplo: "2026-10-01" -> "01 Oct 2026"
export function formatearFechaCorta(fechaIso) {
  if (!fechaIso) return '';
  const [anio, mes, dia] = fechaIso.split('-');
  const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${dia} ${MESES[parseInt(mes, 10) - 1]} ${anio}`;
}
