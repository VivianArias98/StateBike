import styles from './Logo.module.css';

function Logo({ altura = '2.5rem', soloIcono = false, variante = 'claro' }) {
  const colorSecundario = variante === 'oscuro' ? '#FFFFFF' : '#050607';
  const viewBox = soloIcono ? '0 0 160 85' : '0 0 160 130';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      aria-label="StationBike"
      role="img"
      className={styles.raiz}
      style={{ height: altura, width: 'auto' }}
    >
      {/* Rueda izquierda (Verde) */}
      <circle cx="35" cy="45" r="30" fill="none" stroke="#5FD34A" strokeWidth="9" />

      {/* Rueda derecha (Color según contexto: blanco o negro) */}
      <circle cx="125" cy="45" r="30" fill="none" stroke={colorSecundario} strokeWidth="9" />

      {/* Cuadro de la bicicleta y manillar entrelazados */}
      <line x1="55" y1="45" x2="95" y2="15" stroke={colorSecundario} strokeWidth="7" strokeLinecap="round" />
      <line x1="95" y1="15" x2="105" y2="45" stroke={colorSecundario} strokeWidth="7" strokeLinecap="round" />
      <line x1="75" y1="30" x2="120" y2="30" stroke={colorSecundario} strokeWidth="6" strokeLinecap="round" />
      
      {/* Sillín */}
      <rect x="65" y="10" width="18" height="5" rx="2" fill={colorSecundario} />
      {/* Manillar superior */}
      <rect x="98" y="8" width="16" height="5" rx="2" fill={colorSecundario} />

      {/* Texto inferior (solo si no es soloIcono) */}
      {!soloIcono && (
        <text
          x="5"
          y="118"
          fontFamily="'Inter', Arial, sans-serif"
          fontSize="24"
          fontWeight="900"
          fontStyle="italic"
        >
          <tspan fill={colorSecundario}>Station </tspan>
          <tspan fill="#5FD34A">Bike</tspan>
        </text>
      )}
    </svg>
  );
}

export default Logo;