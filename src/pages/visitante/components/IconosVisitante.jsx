// Íconos de línea del visitante. Heredan color (currentColor) y tamaño del contenedor.
const TRAZOS = {
  usuario: [['circle', { cx: 12, cy: 8, r: 4 }], ['path', { d: 'M4 21a8 8 0 0 1 16 0' }]],
  usuarioMas: [['circle', { cx: 10, cy: 8, r: 4 }], ['path', { d: 'M2 21a8 8 0 0 1 16 0M19 8v6M16 11h6' }]],
  rayo: [['path', { d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' }]],
  escudo: [['path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' }]],
  pin: [['path', { d: 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z' }], ['circle', { cx: 12, cy: 9.5, r: 2.5 }]],
  etiqueta: [['path', { d: 'M20 12l-8 8-9-9V3h8l9 9z' }], ['circle', { cx: 7.5, cy: 7.5, r: 1.2 }]],
  billetera: [['rect', { x: 3, y: 6, width: 18, height: 14, rx: 2 }], ['path', { d: 'M3 10h18M16 15h2' }]],
  candado: [['rect', { x: 5, y: 11, width: 14, height: 10, rx: 2 }], ['path', { d: 'M8 11V7a4 4 0 0 1 8 0v4' }]],
  check: [['path', { d: 'M20 6L9 17l-5-5' }]],
  flecha: [['path', { d: 'M5 12h14M13 6l6 6-6 6' }]],
  flechaDerecha: [['path', { d: 'M5 12h14M13 6l6 6-6 6' }]],
  buscar: [['circle', { cx: 11, cy: 11, r: 7 }], ['path', { d: 'M21 21l-4.3-4.3' }]],
  bici: [['circle', { cx: 6, cy: 16, r: 4 }], ['circle', { cx: 18, cy: 16, r: 4 }], ['path', { d: 'M6 16l4-8h6l2 8M10 8h4' }]],
  nfc: [['path', { d: 'M6 8a6 6 0 0 1 0 8M10 5a10 10 0 0 1 0 14M14 3a14 14 0 0 1 0 18' }]],
  reloj: [['circle', { cx: 12, cy: 12, r: 9 }], ['path', { d: 'M12 7v5l3 2' }]],
  tarjeta: [['rect', { x: 2, y: 5, width: 20, height: 14, rx: 2 }], ['path', { d: 'M2 10h20' }]],
  alerta: [['circle', { cx: 12, cy: 12, r: 9 }], ['path', { d: 'M12 8v5M12 16h.01' }]],
  mapa: [['path', { d: 'M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14' }]],
  calendario: [['rect', { x: 3, y: 5, width: 18, height: 16, rx: 2 }], ['path', { d: 'M3 10h18M8 3v4M16 3v4' }]],
  cancelar: [['circle', { cx: 12, cy: 12, r: 9 }], ['path', { d: 'M5.6 5.6l12.8 12.8' }]],
  wifi: [['path', { d: 'M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 20h.01' }]],
  info: [['circle', { cx: 12, cy: 12, r: 9 }], ['path', { d: 'M12 11v6M12 7h.01' }]],
  recarga: [['path', { d: 'M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5' }]],
  sobre: [['rect', { x: 3, y: 5, width: 18, height: 14, rx: 2 }], ['path', { d: 'M3 7l9 6 9-6' }]],
  ojo: [['path', { d: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z' }], ['circle', { cx: 12, cy: 12, r: 3 }]],
  cuadricula: [['rect', { x: 3, y: 3, width: 7, height: 7, rx: 1 }], ['rect', { x: 14, y: 3, width: 7, height: 7, rx: 1 }], ['rect', { x: 3, y: 14, width: 7, height: 7, rx: 1 }], ['rect', { x: 14, y: 14, width: 7, height: 7, rx: 1 }]],
  candadoAbierto: [['rect', { x: 5, y: 11, width: 14, height: 10, rx: 2 }], ['path', { d: 'M8 11V7a4 4 0 0 1 7.8-1.2' }]],
};

export function Icono({ nombre, className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {(TRAZOS[nombre] ?? []).map(([etiqueta, atributos], indice) => {
        const Etiqueta = etiqueta;
        return <Etiqueta key={indice} {...atributos} />;
      })}
    </svg>
  );
}

export default Icono;
