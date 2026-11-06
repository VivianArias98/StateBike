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

  // Iconos añadidos para las pantallas de usuario
  export function IconoCheck() {
    return (
      <Icono>
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </Icono>
    );
  }

  export function IconoAlerta() {
    return (
      <Icono>
        <path d="M12 3 2.5 20h19L12 3z" />
        <path d="M12 10v4M12 17.5v.01" />
      </Icono>
    );
  }

  export function IconoCandado() {
    return (
      <Icono>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </Icono>
    );
  }

  export function IconoReloj() {
    return (
      <Icono>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </Icono>
    );
  }

  export function IconoBilletera() {
    return (
      <Icono>
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18M16 14.5h2" />
      </Icono>
    );
  }

  export function IconoDescarga() {
    return (
      <Icono>
        <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
      </Icono>
    );
  }

  export function IconoFlecha() {
    return (
      <Icono>
        <path d="M9 6l6 6-6 6" />
      </Icono>
    );
  }

  export function IconoTarjeta() {
    return (
      <Icono>
        <rect x="2.5" y="5" width="19" height="14" rx="2" />
        <path d="M2.5 10h19" />
      </Icono>
    );
  }

  export function IconoCalendario() {
    return (
      <Icono>
        <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
        <path d="M3.5 10h17M8 3v4M16 3v4" />
      </Icono>
    );
  }

  export function IconoInfo() {
    return (
      <Icono>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8v.01" />
      </Icono>
    );
  }

  export function IconoOjo() {
    return (
      <Icono>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </Icono>
    );
  }

  export function IconoBloqueo() {
    return (
      <Icono>
        <circle cx="12" cy="12" r="9" />
        <path d="M5.6 5.6l12.8 12.8" />
      </Icono>
    );
  }
