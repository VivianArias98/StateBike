import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Mapeo de rutas a títulos descriptivos según RT-08 (WCAG 2.4.2)
 */
const TITULOS_RUTAS = {
  '/': 'Estaciones · StationBike Tunja',
  '/planes': 'Planes y Tarifas · StationBike Tunja',
  '/acerca': 'Acerca de Nosotros · StationBike Tunja',
  '/como-usar': 'Cómo usar el servicio · StationBike Tunja',
  '/login': 'Iniciar Sesión · StationBike Tunja',
  '/registro': 'Crear Cuenta · StationBike Tunja',
  '/inicio': 'Inicio · StationBike Tunja',
  '/viajes': 'Viajes · StationBike Tunja',
  '/perfil': 'Mi Perfil · StationBike Tunja',
  '/billetera': 'Mi Billetera · StationBike Tunja',
  '/billetera/pagar': 'Pagar Cobro Pendiente · StationBike Tunja',
  '/billetera/pagar/comprobante': 'Comprobante de Pago · StationBike Tunja',
  '/plan': 'Mi Plan · StationBike Tunja',
  '/plan/adquirir': 'Verificación de Tarjeta · Adquirir Plan · StationBike',
  '/plan/adquirir/elegir': 'Selección de Plan · Adquirir Plan · StationBike',
  '/plan/adquirir/resumen': 'Resumen de Compra · Adquirir Plan · StationBike',
  '/plan/adquirir/activado': 'Plan Activado con Éxito · StationBike',
  '/plan/cancelar': 'Cancelar Plan · StationBike Tunja',
  '/plan/cancelar/listo': 'Plan Cancelado · StationBike Tunja',
  '/historial': 'Historial de Viajes · StationBike Tunja',
  '/incidencias': 'Reportar Incidencia · StationBike Tunja',
  '/admin': 'Panel de Control · Administración · StationBike',
  '/admin/estaciones': 'Gestión de Estaciones · Administración · StationBike',
  '/admin/bicicletas': 'Gestión de Bicicletas · Administración · StationBike',
  '/admin/planes': 'Planes y Tarifas · Administración · StationBike',
  '/admin/tarjetas': 'Tarjetas NFC · Administración · StationBike',
  '/admin/incidencias': 'Gestión de Incidencias · Administración · StationBike',
  '/admin/cuentas': 'Cuentas de Usuario · Administración · StationBike',
  '/admin/billetera': 'Billetera y Taquilla · Administración · StationBike',
};

/**
 * Componente que gestiona el foco accesible, título y desplazamiento al navegar (RT-08)
 */
export function ManejadorNavegacionA11y() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Resetear desplazamiento al inicio de la página
    window.scrollTo(0, 0);

    // 2. Título de página específico y descriptivo
    const titulo = TITULOS_RUTAS[pathname] || 'StationBike · Sistema de Bicicletas Compartidas de Tunja';
    document.title = titulo;

    // 3. Llevar el foco al h1 principal de la nueva ruta para anuncio de lector de pantalla
    const temporizador = setTimeout(() => {
      const h1 = document.querySelector('h1');
      if (h1) {
        if (!h1.hasAttribute('tabindex')) {
          h1.setAttribute('tabindex', '-1');
          h1.style.outline = 'none';
        }
        h1.focus({ preventScroll: true });
      }
    }, 100);

    return () => clearTimeout(temporizador);
  }, [pathname]);

  return null;
}

export default ManejadorNavegacionA11y;
