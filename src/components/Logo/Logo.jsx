import styles from './Logo.module.css';

/*
 * Logo SVG inline de StationBike.
 *
 * Props:
 *   variante  → 'oscuro'  (navbar y footer oscuros) | 'claro' (fondos claros, por defecto)
 *   altura    → altura del SVG (default: '2.5rem')
 *   soloIcono → true = solo el icono, sin el texto "Station Bike"
 *
 * Diseño del logo:
 *   Rueda izquierda  → siempre verde (#5FD34A)
 *   Rueda derecha    → oscuro: blanco | claro: negro (#050607)
 *   Cuadro bicicleta → mismo que rueda derecha
 *   Texto "Station"  → mismo que rueda derecha
 *   Texto "Bike"     → siempre verde (#5FD34A)
 */
function Logo({ altura = '2.5rem', soloIcono = false, variante = 'claro' }) {
  const colorSecundario = variante === 'oscuro' ? '#FFFFFF' : '#050607';
  const viewBox = soloIcono ? '0 0 140 100' : '0 0 262 148';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      aria-label="StationBike"
      role="img"
      className={styles.raiz}
      style={{ height: altura, width: 'auto' }}
    >
      {/* ── Icono: infinity-bicicleta ───────────────────────── */}

      {/* Rueda izquierda — verde siempre */}
      <circle cx="57" cy="54" r="40" fill="none" stroke="#5FD34A" strokeWidth="11" />

      {/* Rueda derecha — blanco en oscuro, negro en claro */}
      <circle cx="141" cy="54" r="40" fill="none" stroke={colorSecundario} strokeWidth="11" />

      {/* Sillín */}
      <rect x="85" y="14" width="22" height="6" rx="3" fill={colorSecundario} />

      {/* Tija del sillín */}
      <line x1="96" y1="20" x2="96" y2="38"
        stroke={colorSecundario} strokeWidth="7" strokeLinecap="round" />

      {/* Manillar */}
      <rect x="146" y="14" width="20" height="6" rx="3" fill={colorSecundario} />

      {/* Tubo diagonal: sillín → rueda izquierda */}
      <line x1="96" y1="36" x2="57" y2="84"
        stroke={colorSecundario} strokeWidth="9" strokeLinecap="round" />

      {/* Tubo superior: sillín → horquilla */}
      <line x1="96" y1="20" x2="154" y2="20"
        stroke={colorSecundario} strokeWidth="7" strokeLinecap="round" />

      {/* Horquilla: manillar → rueda derecha */}
      <line x1="154" y1="20" x2="141" y2="84"
        stroke={colorSecundario} strokeWidth="7" strokeLinecap="round" />

      {/* ── Texto (solo si no es soloIcono) ──────────────────── */}
      {!soloIcono && (
        <>
          <text
            x="0" y="138"
            fontFamily="'Inter', Arial, sans-serif"
            fontSize="34"
            fontWeight="900"
            fontStyle="italic"
            fill={colorSecundario}
          >
            Station
          </text>

          <text
            x="172" y="138"
            fontFamily="'Inter', Arial, sans-serif"
            fontSize="34"
            fontWeight="900"
            fontStyle="italic"
            fill="#5FD34A"
          >
            Bike
          </text>
        </>
      )}
    </svg>
  );
}

export default Logo;
