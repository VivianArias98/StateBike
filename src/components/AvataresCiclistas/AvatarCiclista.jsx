import { useId } from 'react';
import styles from './AvatarCiclista.module.css';

/**
 * Componente SVG para renderizar avatares ciclistas oficiales con casco.
 * HU_1: Representación visual del usuario ciclista en StationBike.
 */
function AvatarCiclista({ id = 'mujer-casco-1', tamano = 'm', className = '' }) {
  const uid = useId();
  const clipId = `avatar-clip-${uid}`;

  const claseTamano = {
    s: styles.tamanoS,
    m: styles.tamanoM,
    l: styles.tamanoL,
    xl: styles.tamanoXl,
  }[tamano] || styles.tamanoM;

  return (
    <span className={`${styles.contenedor} ${claseTamano} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id={clipId}>
            <circle cx="50" cy="50" r="48" />
          </clipPath>
        </defs>

        {/* Fondo circular */}
        <circle cx="50" cy="50" r="48" fill="#f1f5f9" />

        {/* Contenido enmascarado al círculo */}
        <g clipPath={`url(#${clipId})`}>
          {id === 'mujer-casco-1' && <AvatarMujerElena />}
          {id === 'mujer-casco-2' && <AvatarMujerSofia />}
          {id === 'mujer-casco-3' && <AvatarMujerCamila />}
          {id === 'hombre-casco-1' && <AvatarHombreMateo />}
          {id === 'hombre-casco-2' && <AvatarHombreSebastian />}
          {id === 'hombre-casco-3' && <AvatarHombreLucas />}
          {!['mujer-casco-1', 'mujer-casco-2', 'mujer-casco-3', 'hombre-casco-1', 'hombre-casco-2', 'hombre-casco-3'].includes(id) && (
            <AvatarMujerElena />
          )}
        </g>

        {/* Borde sutil del marco */}
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" opacity="0.12" fill="none" />
      </svg>
    </span>
  );
}

// 1. Mujer - Elena (Casco Lima, coleta deportiva)
function AvatarMujerElena() {
  return (
    <>
      <circle cx="50" cy="50" r="48" fill="#e8f5e9" />
      {/* Coleta lateral */}
      <path d="M35 50 C 23 56, 21 76, 26 86 C 30 87, 34 78, 36 64 Z" fill="#78350f" />
      {/* Torso / Jersey ciclista verde azulado */}
      <path d="M18 100 C 18 78, 32 70, 50 70 C 68 70, 82 78, 82 100 Z" fill="#0d9488" />
      <path d="M44 70 L50 82 L56 70" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Cuello */}
      <path d="M43 56 L43 72 C43 76 57 76 57 72 L57 56 Z" fill="#fed7aa" />
      {/* Rostro y orejas */}
      <circle cx="34" cy="53" r="3.2" fill="#fed7aa" />
      <circle cx="66" cy="53" r="3.2" fill="#fed7aa" />
      <ellipse cx="50" cy="52" rx="16" ry="17" fill="#fed7aa" />
      {/* Cabello bajo casco */}
      <path d="M34 43 Q 44 47 48 44" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Ojos y sonrisa */}
      <circle cx="44" cy="53" r="1.8" fill="#1e293b" />
      <circle cx="56" cy="53" r="1.8" fill="#1e293b" />
      <ellipse cx="41" cy="56" rx="2.5" ry="1.5" fill="#fca5a5" opacity="0.6" />
      <ellipse cx="59" cy="56" rx="2.5" ry="1.5" fill="#fca5a5" opacity="0.6" />
      <path d="M46 61 Q50 64 54 61" stroke="#9a3412" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* Correa de casco en Y */}
      <path d="M35 48 L44 63 L50 64 L56 63 L65 48" stroke="#334155" strokeWidth="1.6" fill="none" />
      <rect x="47.5" y="63" width="5" height="3" rx="1" fill="#64748b" />
      {/* Casco bicicleta verde lima */}
      <path d="M26 42 C 26 18, 74 18, 74 42 C 74 44, 67 46, 50 46 C 33 46, 26 44, 26 42 Z" fill="#84cc16" />
      {/* Visera aerodinámica */}
      <path d="M24 42 C 34 39, 66 39, 76 42 C 77 44, 69 47, 50 47 C 31 47, 23 44, 24 42 Z" fill="#4d7c0f" />
      {/* Ventilas reflectivas */}
      <path d="M35 25 Q 41 33 38 40" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" opacity="0.85" />
      <path d="M47 22 Q 50 31 50 38" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
      <path d="M65 25 Q 59 33 62 40" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" opacity="0.85" />
    </>
  );
}

// 2. Mujer - Sofía (Casco Menta, gafas deportivas)
function AvatarMujerSofia() {
  return (
    <>
      <circle cx="50" cy="50" r="48" fill="#ecfdf5" />
      {/* Trenza lateral oscura */}
      <path d="M64 49 C 74 58, 72 78, 75 88 C 71 89, 67 80, 64 66 Z" fill="#18181b" />
      {/* Jersey azul océano */}
      <path d="M18 100 C 18 78, 32 70, 50 70 C 68 70, 82 78, 82 100 Z" fill="#0284c7" />
      <path d="M44 70 L50 82 L56 70" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Cuello y rostro */}
      <path d="M43 56 L43 72 C43 76 57 76 57 72 L57 56 Z" fill="#fde68a" />
      <circle cx="34" cy="53" r="3.2" fill="#fde68a" />
      <circle cx="66" cy="53" r="3.2" fill="#fde68a" />
      <ellipse cx="50" cy="52" rx="16" ry="17" fill="#fde68a" />
      {/* Gafas de ciclismo de velocidad */}
      <path
        d="M35 47 C 35 44, 65 44, 65 47 C 66 54, 53 56, 50 51 C 47 56, 34 54, 35 47 Z"
        fill="#0f172a"
      />
      <path d="M37 48 L46 51" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M54 51 L63 48" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" />
      {/* Sonrisa */}
      <path d="M46 62 Q50 65 54 62" stroke="#9a3412" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* Correa de casco */}
      <path d="M35 48 L44 63 L50 64 L56 63 L65 48" stroke="#0f172a" strokeWidth="1.6" fill="none" />
      <rect x="47.5" y="63" width="5" height="3" rx="1" fill="#10b981" />
      {/* Casco menta esmeralda */}
      <path d="M26 42 C 26 18, 74 18, 74 42 C 74 44, 67 46, 50 46 C 33 46, 26 44, 26 42 Z" fill="#10b981" />
      <path d="M24 42 C 34 39, 66 39, 76 42 C 77 44, 69 47, 50 47 C 31 47, 23 44, 24 42 Z" fill="#047857" />
      {/* Ventilas blancas aerodinámicas */}
      <path d="M35 25 Q 41 33 38 40" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" opacity="0.9" />
      <path d="M47 22 Q 50 31 50 38" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <path d="M65 25 Q 59 33 62 40" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" opacity="0.9" />
    </>
  );
}

// 3. Mujer - Camila (Casco Turquesa, rizos castaños)
function AvatarMujerCamila() {
  return (
    <>
      <circle cx="50" cy="50" r="48" fill="#f0fdfa" />
      {/* Cabello rizado que enmarca el rostro */}
      <path d="M33 45 C 26 49, 27 64, 34 68 C 34 60, 33 52, 33 45 Z" fill="#451a03" />
      <path d="M67 45 C 74 49, 73 64, 66 68 C 66 60, 67 52, 67 45 Z" fill="#451a03" />
      {/* Jersey coral vibrante */}
      <path d="M18 100 C 18 78, 32 70, 50 70 C 68 70, 82 78, 82 100 Z" fill="#f43f5e" />
      <path d="M44 70 L50 82 L56 70" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Cuello y rostro cálido */}
      <path d="M43 56 L43 72 C43 76 57 76 57 72 L57 56 Z" fill="#fed7aa" />
      <circle cx="34" cy="53" r="3.2" fill="#fed7aa" />
      <circle cx="66" cy="53" r="3.2" fill="#fed7aa" />
      <ellipse cx="50" cy="52" rx="16" ry="17" fill="#fed7aa" />
      {/* Ojos expresivos y mejillas */}
      <circle cx="44" cy="53" r="1.8" fill="#1e293b" />
      <circle cx="56" cy="53" r="1.8" fill="#1e293b" />
      <ellipse cx="41" cy="56" rx="2.5" ry="1.5" fill="#fca5a5" opacity="0.7" />
      <ellipse cx="59" cy="56" rx="2.5" ry="1.5" fill="#fca5a5" opacity="0.7" />
      <path d="M46 61 Q50 65 54 61" stroke="#9a3412" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* Correa de casco */}
      <path d="M35 48 L44 63 L50 64 L56 63 L65 48" stroke="#334155" strokeWidth="1.6" fill="none" />
      <rect x="47.5" y="63" width="5" height="3" rx="1" fill="#06b6d4" />
      {/* Casco turquesa */}
      <path d="M26 42 C 26 18, 74 18, 74 42 C 74 44, 67 46, 50 46 C 33 46, 26 44, 26 42 Z" fill="#06b6d4" />
      <path d="M24 42 C 34 39, 66 39, 76 42 C 77 44, 69 47, 50 47 C 31 47, 23 44, 24 42 Z" fill="#0e7490" />
      {/* Ventilas reflectivas */}
      <path d="M35 25 Q 41 33 38 40" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" opacity="0.9" />
      <path d="M47 22 Q 50 31 50 38" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <path d="M65 25 Q 59 33 62 40" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" opacity="0.9" />
    </>
  );
}

// 4. Hombre - Mateo (Casco Lima, estilo urbano)
function AvatarHombreMateo() {
  return (
    <>
      <circle cx="50" cy="50" r="48" fill="#f7fee7" />
      {/* Jersey verde esmeralda */}
      <path d="M18 100 C 18 78, 32 70, 50 70 C 68 70, 82 78, 82 100 Z" fill="#15803d" />
      <path d="M44 70 L50 82 L56 70" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Cuello y rostro */}
      <path d="M43 56 L43 72 C43 76 57 76 57 72 L57 56 Z" fill="#fde68a" />
      <circle cx="33" cy="53" r="3.4" fill="#fde68a" />
      <circle cx="67" cy="53" r="3.4" fill="#fde68a" />
      <ellipse cx="50" cy="52" rx="16.5" ry="17.5" fill="#fde68a" />
      {/* Patillas cortas de cabello castaño */}
      <rect x="33" y="47" width="2.5" height="7" rx="1" fill="#78350f" />
      <rect x="64.5" y="47" width="2.5" height="7" rx="1" fill="#78350f" />
      {/* Ojos y sonrisa activa */}
      <circle cx="44" cy="52" r="1.8" fill="#1e293b" />
      <circle cx="56" cy="52" r="1.8" fill="#1e293b" />
      <path d="M45 61 Q50 64 55 61" stroke="#9a3412" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      {/* Correa de casco */}
      <path d="M35 48 L44 63 L50 64 L56 63 L65 48" stroke="#334155" strokeWidth="1.6" fill="none" />
      <rect x="47.5" y="63" width="5" height="3" rx="1" fill="#84cc16" />
      {/* Casco lima con visera urbana extendida */}
      <path d="M26 42 C 26 18, 74 18, 74 42 C 74 44, 67 46, 50 46 C 33 46, 26 44, 26 42 Z" fill="#84cc16" />
      {/* Visera urbana */}
      <path d="M22 42 C 33 39, 67 39, 78 42 C 79 45, 69 48, 50 48 C 31 48, 21 45, 22 42 Z" fill="#3f6212" />
      {/* Ventilas frontales */}
      <path d="M35 25 Q 41 33 38 39" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" opacity="0.85" />
      <path d="M47 22 Q 50 31 50 38" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
      <path d="M65 25 Q 59 33 62 39" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" opacity="0.85" />
    </>
  );
}

// 5. Hombre - Sebastián (Ruta aerodinámico con gafas deportivas)
function AvatarHombreSebastian() {
  return (
    <>
      <circle cx="50" cy="50" r="48" fill="#f8fafc" />
      {/* Jersey neón amarillo ciclista */}
      <path d="M18 100 C 18 78, 32 70, 50 70 C 68 70, 82 78, 82 100 Z" fill="#ca8a04" />
      <path d="M44 70 L50 82 L56 70" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Cuello y rostro */}
      <path d="M43 56 L43 72 C43 76 57 76 57 72 L57 56 Z" fill="#fed7aa" />
      <circle cx="33" cy="53" r="3.4" fill="#fed7aa" />
      <circle cx="67" cy="53" r="3.4" fill="#fed7aa" />
      <ellipse cx="50" cy="52" rx="16.5" ry="17.5" fill="#fed7aa" />
      {/* Gafas deportivas envolventes reflectivas */}
      <path
        d="M34 46 C 34 43, 66 43, 66 46 C 67 54, 53 56, 50 51 C 47 56, 33 54, 34 46 Z"
        fill="#0f172a"
      />
      <path d="M36 48 L46 51" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
      <path d="M54 51 L64 48" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
      {/* Sonrisa de ruta */}
      <path d="M45 61 Q50 64 55 61" stroke="#9a3412" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      {/* Correa de casco */}
      <path d="M35 48 L44 63 L50 64 L56 63 L65 48" stroke="#0f172a" strokeWidth="1.6" fill="none" />
      <rect x="47.5" y="63" width="5" height="3" rx="1" fill="#38bdf8" />
      {/* Casco grafito y menta */}
      <path d="M26 42 C 26 18, 74 18, 74 42 C 74 44, 67 46, 50 46 C 33 46, 26 44, 26 42 Z" fill="#334155" />
      <path d="M24 42 C 34 39, 66 39, 76 42 C 77 44, 69 47, 50 47 C 31 47, 23 44, 24 42 Z" fill="#1e293b" />
      {/* Ventilas menta pro */}
      <path d="M35 25 Q 41 33 38 40" stroke="#10b981" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M47 22 Q 50 31 50 38" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
      <path d="M65 25 Q 59 33 62 40" stroke="#10b981" strokeWidth="2.6" strokeLinecap="round" />
    </>
  );
}

// 6. Hombre - Lucas (Casco Carbón, barba prolija)
function AvatarHombreLucas() {
  return (
    <>
      <circle cx="50" cy="50" r="48" fill="#f1f5f9" />
      {/* Jersey azul marino petróleo */}
      <path d="M18 100 C 18 78, 32 70, 50 70 C 68 70, 82 78, 82 100 Z" fill="#1e3a8a" />
      <path d="M44 70 L50 82 L56 70" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Cuello y rostro */}
      <path d="M43 56 L43 72 C43 76 57 76 57 72 L57 56 Z" fill="#fed7aa" />
      <circle cx="33" cy="53" r="3.4" fill="#fed7aa" />
      <circle cx="67" cy="53" r="3.4" fill="#fed7aa" />
      <ellipse cx="50" cy="52" rx="16.5" ry="17.5" fill="#fed7aa" />
      {/* Barba recortada de ciclista urbano */}
      <path d="M37 54 C 37 67, 63 67, 63 54 C 60 63, 40 63, 37 54 Z" fill="#3f3f46" />
      {/* Ojos y sonrisa */}
      <circle cx="44" cy="51" r="1.8" fill="#1e293b" />
      <circle cx="56" cy="51" r="1.8" fill="#1e293b" />
      <path d="M46 60 Q50 63 54 60" stroke="#fed7aa" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* Correa de casco */}
      <path d="M35 48 L44 63 L50 64 L56 63 L65 48" stroke="#1e293b" strokeWidth="1.6" fill="none" />
      <rect x="47.5" y="63" width="5" height="3" rx="1" fill="#84cc16" />
      {/* Casco carbón oscuro */}
      <path d="M26 42 C 26 18, 74 18, 74 42 C 74 44, 67 46, 50 46 C 33 46, 26 44, 26 42 Z" fill="#18181b" />
      <path d="M24 42 C 34 39, 66 39, 76 42 C 77 44, 69 47, 50 47 C 31 47, 23 44, 24 42 Z" fill="#09090b" />
      {/* Ventilas con toques lima */}
      <path d="M35 25 Q 41 33 38 40" stroke="#84cc16" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M47 22 Q 50 31 50 38" stroke="#84cc16" strokeWidth="3" strokeLinecap="round" />
      <path d="M65 25 Q 59 33 62 40" stroke="#84cc16" strokeWidth="2.6" strokeLinecap="round" />
    </>
  );
}

export default AvatarCiclista;

