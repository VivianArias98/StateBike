// Iconos SVG provisionales: heredan el color (currentColor) y el tamaño (1em) del texto.
// Se pueden reemplazar cuando existan los iconos definitivos.
function Icono({ children }) {
    return (
      <svg
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        {children}
      </svg>
    );
  }
  
  export function IconoBicicleta() {
    return (
      <Icono>
        <circle cx="6" cy="16" r="3.5" />
        <circle cx="18" cy="16" r="3.5" />
        <path d="M6 16 9.5 9 15.5 9 18 16M9.5 9 12 16 15.5 9M6 16H12M8 7H11M15.5 9 14.5 6H17" />
      </Icono>
    );
  }
  
  export function IconoUsuario() {
    return (
      <Icono>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c0-3.9 3.1-6 7-6s7 2.1 7 6" />
      </Icono>
    );
  }
  
  export function IconoUbicacion() {
    return (
      <Icono>
        <path d="M12 21s6-5.6 6-11a6 6 0 1 0-12 0c0 5.4 6 11 6 11z" />
        <circle cx="12" cy="10" r="2.2" />
      </Icono>
    );
  }
  
  export function IconoNfc() {
    return (
      <Icono>
        <path d="M8.5 8.5a5 5 0 0 1 0 7" />
        <path d="M12 6a9 9 0 0 1 0 12" />
        <path d="M15.5 3.5a13 13 0 0 1 0 17" />
      </Icono>
    );
  }