import { useEffect, useRef } from 'react';

/**
 * Hook para modales accesibles (WCAG 2.1 AA - RT-01)
 * - Cierre con tecla Escape.
 * - Foco inicial en el primer elemento interactivo o elementoInicialRef.
 * - Trampa de foco (Tab / Shift+Tab no escapan del modal).
 * - Retorno de foco al elemento que activó el modal al cerrarse.
 * - Bloqueo de scroll de fondo.
 */
export function useModalA11y({ abierto, onCerrar, contenedorRef, elementoInicialRef }) {
  const elementoPrevioRef = useRef(null);

  useEffect(() => {
    if (!abierto) return;

    elementoPrevioRef.current = document.activeElement;

    const scrollOriginal = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const temporizador = setTimeout(() => {
      if (elementoInicialRef?.current) {
        elementoInicialRef.current.focus();
        return;
      }
      if (contenedorRef?.current) {
        const elementosEnfocables = contenedorRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (elementosEnfocables.length > 0) {
          elementosEnfocables[0].focus();
        }
      }
    }, 50);

    function manejarKeydown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCerrar?.();
        return;
      }

      if (e.key === 'Tab' && contenedorRef?.current) {
        const elementosEnfocables = Array.from(
          contenedorRef.current.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );

        if (elementosEnfocables.length === 0) return;

        const primerElemento = elementosEnfocables[0];
        const ultimoElemento = elementosEnfocables[elementosEnfocables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === primerElemento || !contenedorRef.current.contains(document.activeElement)) {
            e.preventDefault();
            ultimoElemento.focus();
          }
        } else {
          if (document.activeElement === ultimoElemento || !contenedorRef.current.contains(document.activeElement)) {
            e.preventDefault();
            primerElemento.focus();
          }
        }
      }
    }

    document.addEventListener('keydown', manejarKeydown);

    return () => {
      clearTimeout(temporizador);
      document.removeEventListener('keydown', manejarKeydown);
      document.body.style.overflow = scrollOriginal;

      if (elementoPrevioRef.current && typeof elementoPrevioRef.current.focus === 'function') {
        elementoPrevioRef.current.focus();
      }
    };
  }, [abierto, onCerrar, contenedorRef, elementoInicialRef]);
}

export default useModalA11y;
