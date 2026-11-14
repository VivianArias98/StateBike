import { useId } from 'react';
import styles from './AvatarAdmin.module.css';

/**
 * Componente SVG para renderizar avatares ejecutivos oficiales del Administrador.
 * Vestimenta formal y elegante para la gestión central de StationBike.
 */
function AvatarAdmin({ id = 'admin-mujer-1', tamano = 'm', className = '' }) {
  const uid = useId();
  const clipId = `admin-avatar-clip-${uid}`;

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
        <circle cx="50" cy="50" r="48" fill="#f8fafc" />

        {/* Personaje enmascarado */}
        <g clipPath={`url(#${clipId})`}>
          {id === 'admin-mujer-1' && <AvatarAdminMujerValentina />}
          {id === 'admin-mujer-2' && <AvatarAdminMujerCarolina />}
          {id === 'admin-mujer-3' && <AvatarAdminMujerMariana />}
          {id === 'admin-hombre-1' && <AvatarAdminHombreAlejandro />}
          {id === 'admin-hombre-2' && <AvatarAdminHombreGabriel />}
          {id === 'admin-hombre-3' && <AvatarAdminHombreCamilo />}
          {!['admin-mujer-1', 'admin-mujer-2', 'admin-mujer-3', 'admin-hombre-1', 'admin-hombre-2', 'admin-hombre-3'].includes(id) && (
            <AvatarAdminMujerValentina />
          )}
        </g>

        {/* Aro perimetral fino */}
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" opacity="0.15" fill="none" />
      </svg>
    </span>
  );
}

// 1. Mujer - Valentina (Blazer azul marino, blusa en V blanca, recogido formal y perlas)
function AvatarAdminMujerValentina() {
  return (
    <>
      <circle cx="50" cy="50" r="48" fill="#f1f5f9" />
      {/* Moño / recogido bajo formal */}
      <circle cx="50" cy="34" r="19" fill="#18181b" />
      {/* Hombros y blazer azul marino */}
      <path d="M16 100 C 16 76, 32 68, 50 68 C 68 68, 84 76, 84 100 Z" fill="#1e293b" />
      {/* Blusa de seda blanca con cuello en V */}
      <path d="M42 68 L50 86 L58 68 Z" fill="#ffffff" />
      <circle cx="50" cy="74" r="1.5" fill="#f59e0b" />
      {/* Solapas estructuradas de sastrería */}
      <path d="M30 70 L44 88 L34 100 Z" fill="#0f172a" />
      <path d="M70 70 L56 88 L66 100 Z" fill="#0f172a" />
      {/* Cuello y rostro */}
      <path d="M43 56 L43 72 C43 76 57 76 57 72 L57 56 Z" fill="#fed7aa" />
      <circle cx="33" cy="53" r="3.2" fill="#fed7aa" />
      <circle cx="67" cy="53" r="3.2" fill="#fed7aa" />
      {/* Pendientes de perla */}
      <circle cx="33" cy="55" r="1.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
      <circle cx="67" cy="55" r="1.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
      <ellipse cx="50" cy="50" rx="16" ry="17.5" fill="#fed7aa" />
      {/* Peinado formal con raya lateral */}
      <path d="M34 46 C 34 32, 66 30, 66 46 C 62 38, 48 37, 34 46 Z" fill="#18181b" />
      {/* Ojos definidos y sonrisa cálida ejecutiva */}
      <circle cx="44" cy="51" r="1.8" fill="#0f172a" />
      <circle cx="56" cy="51" r="1.8" fill="#0f172a" />
      <ellipse cx="41" cy="54" rx="2.5" ry="1.5" fill="#fca5a5" opacity="0.6" />
      <ellipse cx="59" cy="54" rx="2.5" ry="1.5" fill="#fca5a5" opacity="0.6" />
      <path d="M46 59 Q50 62 54 59" stroke="#9a3412" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </>
  );
}

// 2. Mujer - Carolina (Blazer carbón, blusa verde esmeralda y gafas ejecutivas)
function AvatarAdminMujerCarolina() {
  return (
    <>
      <circle cx="50" cy="50" r="48" fill="#ecfdf5" />
      {/* Melena lisa castaña hasta los hombros */}
      <path d="M32 46 C 26 56, 26 78, 30 88 C 34 89, 36 78, 36 62 Z" fill="#78350f" />
      <path d="M68 46 C 74 56, 74 78, 70 88 C 66 89, 64 78, 64 62 Z" fill="#78350f" />
      {/* Blazer carbón grafito */}
      <path d="M16 100 C 16 76, 32 68, 50 68 C 68 68, 84 76, 84 100 Z" fill="#334155" />
      {/* Blusa verde esmeralda institucional */}
      <path d="M41 68 L50 86 L59 68 Z" fill="#059669" />
      {/* Solapas elegantes */}
      <path d="M29 70 L43 88 L33 100 Z" fill="#1e293b" />
      <path d="M71 70 L57 88 L67 100 Z" fill="#1e293b" />
      {/* Cuello y rostro */}
      <path d="M43 56 L43 72 C43 76 57 76 57 72 L57 56 Z" fill="#fde68a" />
      <circle cx="33" cy="53" r="3.2" fill="#fde68a" />
      <circle cx="67" cy="53" r="3.2" fill="#fde68a" />
      <ellipse cx="50" cy="50" rx="16" ry="17.5" fill="#fde68a" />
      {/* Flequillo / peinado pulcro */}
      <path d="M34 46 C 35 32, 65 32, 66 46 C 58 39, 44 40, 34 46 Z" fill="#78350f" />
      {/* Gafas ejecutivas con montura fina dorada */}
      <rect x="36" y="47" width="11" height="7" rx="2" fill="none" stroke="#d97706" strokeWidth="1.4" />
      <rect x="53" y="47" width="11" height="7" rx="2" fill="none" stroke="#d97706" strokeWidth="1.4" />
      <line x1="47" y1="50" x2="53" y2="50" stroke="#d97706" strokeWidth="1.4" />
      <circle cx="41.5" cy="50.5" r="1.6" fill="#1e293b" />
      <circle cx="58.5" cy="50.5" r="1.6" fill="#1e293b" />
      {/* Sonrisa */}
      <path d="M46 60 Q50 63 54 60" stroke="#9a3412" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </>
  );
}

// 3. Mujer - Mariana (Traje sastre negro con solapa de seda y ondas caoba)
function AvatarAdminMujerMariana() {
  return (
    <>
      <circle cx="50" cy="50" r="48" fill="#fefce8" />
      {/* Ondas caoba a los lados */}
      <path d="M30 46 C 24 55, 25 76, 32 86 C 36 78, 35 62, 36 50 Z" fill="#451a03" />
      <path d="M70 46 C 76 55, 75 76, 68 86 C 64 78, 65 62, 64 50 Z" fill="#451a03" />
      {/* Traje sastre negro de alta dirección */}
      <path d="M16 100 C 16 76, 32 68, 50 68 C 68 68, 84 76, 84 100 Z" fill="#18181b" />
      {/* Blusa blanca impecable */}
      <path d="M42 68 L50 84 L58 68 Z" fill="#ffffff" />
      <path d="M30 70 L43 88 L34 100 Z" fill="#09090b" />
      <path d="M70 70 L57 88 L66 100 Z" fill="#09090b" />
      {/* Cuello y rostro */}
      <path d="M43 56 L43 72 C43 76 57 76 57 72 L57 56 Z" fill="#fed7aa" />
      <circle cx="33" cy="53" r="3.2" fill="#fed7aa" />
      <circle cx="67" cy="53" r="3.2" fill="#fed7aa" />
      <ellipse cx="50" cy="50" rx="16" ry="17.5" fill="#fed7aa" />
      {/* Peinado ondulado */}
      <path d="M34 45 C 36 31, 64 31, 66 45 C 56 38, 42 39, 34 45 Z" fill="#451a03" />
      {/* Ojos y sonrisa */}
      <circle cx="44" cy="51" r="1.8" fill="#0f172a" />
      <circle cx="56" cy="51" r="1.8" fill="#0f172a" />
      <path d="M46 59 Q50 63 54 59" stroke="#9a3412" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </>
  );
}

// 4. Hombre - Alejandro (Traje azul marino, camisa blanca y corbata verde esmeralda)
function AvatarAdminHombreAlejandro() {
  return (
    <>
      <circle cx="50" cy="50" r="48" fill="#f0f9ff" />
      {/* Hombros y saco azul marino formal */}
      <path d="M16 100 C 16 76, 32 68, 50 68 C 68 68, 84 76, 84 100 Z" fill="#1e3a8a" />
      {/* Camisa blanca formal */}
      <path d="M40 68 L50 82 L60 68 Z" fill="#ffffff" />
      {/* Cuello de la camisa */}
      <polygon points="41,68 47,74 44,68" fill="#f8fafc" />
      <polygon points="59,68 53,74 56,68" fill="#f8fafc" />
      {/* Corbata esmeralda / menta ejecutiva */}
      <polygon points="48,72 52,72 53,92 50,96 47,92" fill="#059669" />
      <circle cx="50" cy="80" r="1" fill="#fbbf24" />
      {/* Solapas de saco formal */}
      <path d="M28 70 L42 88 L34 100 Z" fill="#172554" />
      <path d="M72 70 L58 88 L66 100 Z" fill="#172554" />
      {/* Cuello y rostro */}
      <path d="M43 56 L43 72 C43 76 57 76 57 72 L57 56 Z" fill="#fde68a" />
      <circle cx="33" cy="53" r="3.4" fill="#fde68a" />
      <circle cx="67" cy="53" r="3.4" fill="#fde68a" />
      <ellipse cx="50" cy="51" rx="16.5" ry="17.5" fill="#fde68a" />
      {/* Peinado clásico formal con raya al lado */}
      <path d="M33 46 C 33 30, 67 29, 67 46 C 65 37, 48 34, 33 46 Z" fill="#451a03" />
      <rect x="33" y="47" width="2" height="6" rx="1" fill="#451a03" />
      <rect x="65" y="47" width="2" height="6" rx="1" fill="#451a03" />
      {/* Ojos y sonrisa */}
      <circle cx="44" cy="51" r="1.8" fill="#1e293b" />
      <circle cx="56" cy="51" r="1.8" fill="#1e293b" />
      <path d="M45 60 Q50 63 55 60" stroke="#9a3412" strokeWidth="1.7" strokeLinecap="round" fill="none" />
    </>
  );
}

// 5. Hombre - Gabriel (Traje carbón, camisa celeste, corbata grafito y gafas ejecutivas)
function AvatarAdminHombreGabriel() {
  return (
    <>
      <circle cx="50" cy="50" r="48" fill="#f8fafc" />
      {/* Saco carbón oscuro */}
      <path d="M16 100 C 16 76, 32 68, 50 68 C 68 68, 84 76, 84 100 Z" fill="#1f2937" />
      {/* Camisa celeste ejecutiva */}
      <path d="M40 68 L50 82 L60 68 Z" fill="#bae6fd" />
      {/* Corbata grafito */}
      <polygon points="48,72 52,72 53,92 50,96 47,92" fill="#334155" />
      {/* Solapas de corte moderno */}
      <path d="M28 70 L42 88 L34 100 Z" fill="#111827" />
      <path d="M72 70 L58 88 L66 100 Z" fill="#111827" />
      {/* Cuello y rostro */}
      <path d="M43 56 L43 72 C43 76 57 76 57 72 L57 56 Z" fill="#fed7aa" />
      <circle cx="33" cy="53" r="3.4" fill="#fed7aa" />
      <circle cx="67" cy="53" r="3.4" fill="#fed7aa" />
      <ellipse cx="50" cy="51" rx="16.5" ry="17.5" fill="#fed7aa" />
      {/* Cabello oscuro recortado */}
      <path d="M33 46 C 33 30, 67 30, 67 46 C 63 37, 45 37, 33 46 Z" fill="#18181b" />
      {/* Gafas ejecutivas rectangulares */}
      <rect x="36" y="47" width="11" height="7" rx="2" fill="none" stroke="#0f172a" strokeWidth="1.5" />
      <rect x="53" y="47" width="11" height="7" rx="2" fill="none" stroke="#0f172a" strokeWidth="1.5" />
      <line x1="47" y1="50" x2="53" y2="50" stroke="#0f172a" strokeWidth="1.5" />
      <circle cx="41.5" cy="50.5" r="1.6" fill="#1e293b" />
      <circle cx="58.5" cy="50.5" r="1.6" fill="#1e293b" />
      {/* Sonrisa */}
      <path d="M45 60 Q50 63 55 60" stroke="#9a3412" strokeWidth="1.7" strokeLinecap="round" fill="none" />
    </>
  );
}

// 6. Hombre - Camilo (Blazer negro italiano, pañuelo de bolsillo, camisa blanca y barba prolija)
function AvatarAdminHombreCamilo() {
  return (
    <>
      <circle cx="50" cy="50" r="48" fill="#f1f5f9" />
      {/* Blazer negro de corte sastre italiano */}
      <path d="M16 100 C 16 76, 32 68, 50 68 C 68 68, 84 76, 84 100 Z" fill="#0f172a" />
      {/* Camisa blanca formal */}
      <path d="M41 68 L50 82 L59 68 Z" fill="#ffffff" />
      {/* Corbata delgada negra */}
      <polygon points="48.5,72 51.5,72 52.5,92 50,96 47.5,92" fill="#1e293b" />
      {/* Pañuelo de bolsillo blanco */}
      <rect x="25" y="77" width="6" height="1.5" rx="0.5" fill="#ffffff" />
      {/* Solapas */}
      <path d="M28 70 L42 88 L34 100 Z" fill="#020617" />
      <path d="M72 70 L58 88 L66 100 Z" fill="#020617" />
      {/* Cuello y rostro */}
      <path d="M43 56 L43 72 C43 76 57 76 57 72 L57 56 Z" fill="#fed7aa" />
      <circle cx="33" cy="53" r="3.4" fill="#fed7aa" />
      <circle cx="67" cy="53" r="3.4" fill="#fed7aa" />
      <ellipse cx="50" cy="51" rx="16.5" ry="17.5" fill="#fed7aa" />
      {/* Barba ejecutiva recortada y cuidada */}
      <path d="M37 53 C 37 66, 63 66, 63 53 C 60 62, 40 62, 37 53 Z" fill="#3f3f46" />
      {/* Cabello ejecutivo moderno */}
      <path d="M33 46 C 33 29, 67 29, 67 46 C 62 36, 45 35, 33 46 Z" fill="#27272a" />
      {/* Ojos y sonrisa */}
      <circle cx="44" cy="50" r="1.8" fill="#1e293b" />
      <circle cx="56" cy="50" r="1.8" fill="#1e293b" />
      <path d="M46 59 Q50 62 54 59" stroke="#fed7aa" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </>
  );
}

export default AvatarAdmin;

