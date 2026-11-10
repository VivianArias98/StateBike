import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { leerSesion, borrarSesion, rutaInicio } from '../../utils/sesion.js';
import { obtenerUsuarioActual } from '../../utils/auth.js';

// Deja pasar solo a usuarios con sesión válida y del rol indicado.
// Confirma la sesión con el servidor (/auth/me) una vez al entrar.
function RutaProtegida({ rol, children }) {
  const ubicacion = useLocation();
  const [estado, setEstado] = useState('verificando');
  const sesion = leerSesion();
  const rolSesion = sesion?.usuario?.rol;

  useEffect(() => {
    let activo = true;
    if (!sesion?.usuario) return undefined;

    obtenerUsuarioActual()
      .then((usuario) => {
        if (!activo) return;
        setEstado(usuario.rol === rol ? 'ok' : 'rol_distinto');
      })
      .catch((error) => {
        if (!activo) return;
        // Solo expulsar si el servidor confirma que el token venció o es inválido (401/403)
        if (error?.status === 401 || error?.status === 403) {
          borrarSesion();
          setEstado('fuera');
        } else {
          // Si es fallo temporal de red o conexión, conservar la sesión local
          setEstado(rolSesion === rol ? 'ok' : 'rol_distinto');
        }
      });

    return () => {
      activo = false;
    };
    // La verificación se hace una sola vez por montaje de la ruta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!sesion?.usuario || estado === 'fuera') {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }
  if (rolSesion !== rol) {
    return <Navigate to={rutaInicio(rolSesion)} replace />;
  }
  if (estado === 'rol_distinto') {
    return <Navigate to={rutaInicio(rolSesion)} replace />;
  }
  if (estado !== 'ok') return null;
  return children;
}

export default RutaProtegida;
