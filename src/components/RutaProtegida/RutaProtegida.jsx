import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { leerSesion, borrarSesion, rutaInicio } from '../../utils/sesion.js';
import { obtenerUsuarioActual } from '../../utils/auth.js';

// Deja pasar solo a usuarios con sesión válida y del rol indicado.
// Confirma la sesión con el servidor (/auth/me) en segundo plano una vez al entrar.
function RutaProtegida({ rol, children }) {
  const ubicacion = useLocation();
  const sesion = leerSesion();
  const rolSesion = sesion?.usuario?.rol;
  const esRolValido = Boolean(sesion?.usuario && rolSesion === rol);

  // Si ya tenemos una sesión local válida con el rol correspondiente, iniciamos en 'ok'
  // para evitar pantallas en verde/en blanco y renderizar el panel inmediatamente.
  const [estado, setEstado] = useState(() => (esRolValido ? 'ok' : 'verificando'));

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
  if (rolSesion !== rol || estado === 'rol_distinto') {
    return <Navigate to={rutaInicio(rolSesion)} replace />;
  }
  if (estado !== 'ok') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 'var(--espacio-3)',
          color: 'var(--color-texto)',
        }}
      >
        <span className="punto-vivo" style={{ width: '1.25rem', height: '1.25rem' }} aria-hidden="true" />
        <p style={{ fontSize: 'var(--texto-s)', fontWeight: 600 }}>Cargando...</p>
      </div>
    );
  }
  return children;
}

export default RutaProtegida;
