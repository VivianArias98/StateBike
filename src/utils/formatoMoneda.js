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
