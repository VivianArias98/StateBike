import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { leerSesion, borrarSesion } from '../../../utils/sesion.js';

const UsuarioContext = createContext(null);
const INTERVALO_VIAJE_MS = 5000; // cada cuánto se consulta si hay un viaje en curso

function leerToken() {
  try {
    const sesion = leerSesion();
    return sesion?.acceso || null;
  } catch {
    return null;
  }
}

async function peticionAutenticada(url, opciones = {}) {
  const token = leerToken();
  const headers = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opciones.headers || {}),
  };

  if (opciones.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const respuesta = await fetch(url, {
    ...opciones,
    headers,
  });

  const resJson = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    const error = new Error(resJson.mensaje || resJson.error || 'Error en la petición');
    error.status = respuesta.status;
    error.codigo = resJson.error;
    error.detalles = resJson;
    throw error;
  }

  return resJson;
}

export function UsuarioProvider({ children }) {
  const navigate = useNavigate();
  const sesion = leerSesion();

  // Estados reales conectados al backend (sin datos quemados)
  const [cargando, setCargando] = useState(true);
  const [errorConexion, setErrorConexion] = useState('');

  const [perfil, setPerfil] = useState({
    id: sesion?.usuario?.id || null,
    nombreCompleto: sesion?.usuario?.nombre || '',
    correo: sesion?.usuario?.email || sesion?.usuario?.correo || '',
    telefono: '',
    fechaNacimiento: '',
    tarjeta: null,
  });

  const [billetera, setBilletera] = useState({
    saldo: 0,
    tieneCobroPendiente: false,
    cobroPendiente: null,
    movimientos: [],
  });

  const [plan, setPlan] = useState({
    tienePlan: false,
    planActivo: null,
  });

  const [planesCatalogo, setPlanesCatalogo] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [viajeActivo, setViajeActivo] = useState(null);
  const [ultimoViaje, setUltimoViaje] = useState(null); // resumen del viaje recién devuelto
  const viajeIdRef = useRef(undefined); // undefined = todavía no se ha consultado
  const [historialViajes, setHistorialViajes] = useState([]);
  const [historialPagos, setHistorialPagos] = useState([]);
  const [incidencias, setIncidencias] = useState([]);

  // Cargar toda la información desde el backend (igual que en Administrador)
  const cargarDatosUsuario = useCallback(async () => {
    const token = leerToken();
    if (!token) {
      setCargando(false);
      return;
    }

    try {
      setErrorConexion('');

      // 1. Estaciones públicas y Catálogo de Planes
      const [estacionesRes, planesRes] = await Promise.all([
        fetch('/api/estaciones').then((r) => r.json()).catch(() => ({ estaciones: [] })),
        fetch('/api/planes').then((r) => r.json()).catch(() => ({ planes: [] })),
      ]);

      const listaEstaciones = Array.isArray(estacionesRes)
        ? estacionesRes
        : estacionesRes.estaciones || [];
      const listaPlanes = Array.isArray(planesRes) ? planesRes : planesRes.planes || [];

      setEstaciones(listaEstaciones);
      setPlanesCatalogo(listaPlanes);

      // 2. Perfil y Tarjeta del usuario en sesión
      const [perfilRes, tarjetaRes] = await Promise.all([
        peticionAutenticada('/api/perfil').catch(() => null),
        peticionAutenticada('/api/tarjeta').catch(() => null),
      ]);

      if (perfilRes) {
        setPerfil({
          id: perfilRes.id,
          nombreCompleto: perfilRes.nombreCompleto || perfilRes.nombre,
          correo: perfilRes.correo || perfilRes.email,
          telefono: perfilRes.telefono || '',
          fechaNacimiento: perfilRes.fechaNacimiento || '',
          tarjeta: tarjetaRes?.tarjeta || perfilRes.tarjeta || null,
        });
      }

      // 3. Billetera y Movimientos
      const billeteraRes = await peticionAutenticada('/api/billetera').catch(() => null);
      if (billeteraRes) {
        setBilletera({
          saldo: billeteraRes.saldo ?? 0,
          tieneCobroPendiente: Boolean(billeteraRes.tieneCobroPendiente),
          cobroPendiente: billeteraRes.cobroPendiente || null,
          movimientos: billeteraRes.movimientos || [],
        });
      }

      // 4. Mi Plan Activo
      const miPlanRes = await peticionAutenticada('/api/planes/mi-plan').catch(() => null);
      if (miPlanRes) {
        setPlan({
          tienePlan: Boolean(miPlanRes.tienePlan),
          planActivo: miPlanRes.plan || null,
        });
      }

      //. Historiales e Incidencias
      const [viajesHistRes, pagosHistRes, incidenciasRes] = await Promise.all([
        peticionAutenticada('/api/historial/viajes').catch(() => ({ viajes: [] })),
        peticionAutenticada('/api/historial/pagos').catch(() => ({ pagos: [] })),
        peticionAutenticada('/api/incidencias').catch(() => ({ incidencias: [] })),
      ]);

      setHistorialViajes(viajesHistRes.viajes || (Array.isArray(viajesHistRes) ? viajesHistRes : []));
      setHistorialPagos(pagosHistRes.pagos || (Array.isArray(pagosHistRes) ? pagosHistRes : []));
      setIncidencias(
        incidenciasRes.incidencias || (Array.isArray(incidenciasRes) ? incidenciasRes : [])
      );
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        borrarSesion();
        navigate('/login');
        return;
      }
      setErrorConexion('No se pudo sincronizar con el servidor');
    } finally {
      setCargando(false);
    }
  }, [navigate]);

  useEffect(() => {
    cargarDatosUsuario();
  }, [cargarDatosUsuario]);

    // El viaje lo inicia y lo cierra el tótem (API NFC): aquí solo se consulta al backend.
    const sincronizarViaje = useCallback(async () => {
      if (!leerToken()) return;
      try {
        const res = await peticionAutenticada('/api/viajes/en-curso');
        const viaje = res.enCurso && res.viaje ? { ...res.viaje, recibidoEn: Date.now() } : null;
        const idAnterior = viajeIdRef.current;
        const idNuevo = viaje?.id ?? null;
  
        viajeIdRef.current = idNuevo;
        setViajeActivo(viaje);
  
        if (idAnterior === undefined) return; // primera consulta: no hay cambio que avisar
  
        if (idAnterior === null && idNuevo) {
          // El viaje empezó en el tótem
          setUltimoViaje(null);
          cargarDatosUsuario();
        } else if (idAnterior && !idNuevo) {
          // La bicicleta se devolvió en el tótem: se trae el resumen y se refrescan saldo y plan
          const ultimo = await peticionAutenticada('/api/viajes/ultimo').catch(() => null);
          if (ultimo?.viaje) setUltimoViaje(ultimo);
          cargarDatosUsuario();
        } else if (viaje) {
          // Viaje en curso: se mantienen al día las bicicletas y anclajes de las estaciones
          const resEstaciones = await fetch('/api/estaciones').then((r) => r.json()).catch(() => null);
          if (resEstaciones) {
            setEstaciones(Array.isArray(resEstaciones) ? resEstaciones : resEstaciones.estaciones || []);
          }
        }
      } catch (err) {
        if (err.status === 401 || err.status === 403) {
          borrarSesion();
          navigate('/login');
        }
      }
    }, [cargarDatosUsuario, navigate]);
  
    useEffect(() => {
      sincronizarViaje();
      const intervalo = setInterval(() => {
        if (document.visibilityState === 'visible') sincronizarViaje();
      }, INTERVALO_VIAJE_MS);
      return () => clearInterval(intervalo);
    }, [sincronizarViaje]);
  
    const descartarUltimoViaje = () => setUltimoViaje(null);

  // ==========================================
  // OPERACIONES CONECTADAS AL BACKEND REAL
  // ==========================================

  // Sincronización en vivo exclusiva de la billetera
  const actualizarBilletera = useCallback(async () => {
    try {
      const billeteraRes = await peticionAutenticada('/api/billetera').catch(() => null);
      if (billeteraRes) {
        setBilletera({
          saldo: billeteraRes.saldo ?? 0,
          tieneCobroPendiente: Boolean(billeteraRes.tieneCobroPendiente),
          cobroPendiente: billeteraRes.cobroPendiente || null,
          movimientos: billeteraRes.movimientos || [],
        });
      }
    } catch {
      // Ignorar fallos de red silenciosos
    }
  }, []);

  // Actualizar perfil (HU_1 -> PUT /api/perfil)
  const actualizarPerfil = async ({ nombreCompleto, telefono, contrasenaActual, nuevaContrasena }) => {
    try {
      const cuerpo = {
        nombreCompleto,
        telefono,
        ...(nuevaContrasena ? { contrasenaActual, nuevaContrasena } : {}),
      };

      const respuesta = await peticionAutenticada('/api/perfil', {
        method: 'PUT',
        body: JSON.stringify(cuerpo),
      });

      await cargarDatosUsuario();
      return { exito: true, mensaje: respuesta.mensaje || 'PERFIL ACTUALIZADO CORRECTAMENTE' };
    } catch (err) {
      throw err;
    }
  };

  // Bloquear / Desbloquear Tarjeta NFC (HU_1 -> PATCH /api/tarjeta/bloquear / desbloquear)
  const toggleBloqueoTarjeta = async () => {
    try {
      const estadoActual = perfil?.tarjeta?.estado;
      const accion = estadoActual === 'ACTIVA' ? 'bloquear' : 'desbloquear';

      const respuesta = await peticionAutenticada(`/api/tarjeta/${accion}`, {
        method: 'PATCH',
      });

      await cargarDatosUsuario();
      return respuesta.mensaje || (accion === 'bloquear' ? 'TARJETA BLOQUEADA CORRECTAMENTE' : 'TARJETA DESBLOQUEADA CORRECTAMENTE');
    } catch (err) {
      throw err;
    }
  };

  // Recargar saldo en billetera (HU_24 -> POST /api/billetera/recargar)
  const recargarSaldo = async (monto) => {
    try {
      const num = Number(monto);
      const respuesta = await peticionAutenticada('/api/billetera/recargar', {
        method: 'POST',
        body: JSON.stringify({ monto: num }),
      });

      await cargarDatosUsuario();
      return {
        mensaje: respuesta.mensaje || 'RECARGA EXITOSA',
        montoRecargado: num,
        nuevoSaldo: respuesta.nuevoSaldo,
        saldoAnterior: respuesta.saldoAnterior,
      };
    } catch (err) {
      throw err;
    }
  };

  // Pagar cobro pendiente (HU_25 -> POST /api/billetera/pagar-cobro)
  const pagarCobroPendiente = async () => {
    try {
      const respuesta = await peticionAutenticada('/api/billetera/pagar-cobro', {
        method: 'POST',
      });

      await cargarDatosUsuario();
      return {
        mensaje: respuesta.mensaje || 'COBRO PENDIENTE PAGADO CORRECTAMENTE',
        nuevoSaldo: respuesta.cobro?.saldoRestante,
        cobro: respuesta.cobro,
      };
    } catch (err) {
      throw err;
    }
  };

  // Adquirir Plan (HU_2 -> POST /api/planes/adquirir)
  const adquirirPlan = async (planSeleccionado) => {
    try {
      const respuesta = await peticionAutenticada('/api/planes/adquirir', {
        method: 'POST',
        body: JSON.stringify({ planId: planSeleccionado.id }),
      });

      await cargarDatosUsuario();
      return {
        mensaje: respuesta.mensaje || 'PLAN ADQUIRIDO CON ÉXITO',
        suscripcion: respuesta.suscripcion,
      };
    } catch (err) {
      throw err;
    }
  };

  // Cancelar Plan (HU_2 -> POST /api/planes/cancelar)
  const cancelarPlan = async () => {
    try {
      const respuesta = await peticionAutenticada('/api/planes/cancelar', {
        method: 'POST',
      });

      await cargarDatosUsuario();
      return {
        mensaje: respuesta.mensaje || 'PLAN CANCELADO CORRECTAMENTE',
        suscripcion: respuesta.suscripcion,
      };
    } catch (err) {
      throw err;
    }
  };

  // Reportar Incidencia (HU_6 -> POST /api/incidencias)
  const reportarIncidencia = async ({ tipo, bicicleta, estacion, descripcion }) => {
    try {
      const estObj = estaciones.find((e) => e.nombre === estacion || e.id === Number(estacion));
      const cuerpo = {
        tipo: tipo === 'nfc' ? 'TARJETA' : tipo === 'estacion' ? 'ANCLAJE' : tipo === 'bicicleta' ? 'BICICLETA' : 'OTRO',
        codigoBicicleta: tipo === 'bicicleta' || tipo === 'otro' ? bicicleta : undefined,
        estacionId: (tipo === 'estacion' || tipo === 'otro') && estObj ? estObj.id : undefined,
        descripcion,
      };

      const respuesta = await peticionAutenticada('/api/incidencias', {
        method: 'POST',
        body: JSON.stringify(cuerpo),
      });

      await cargarDatosUsuario();
      return {
        mensaje: respuesta.mensaje || 'REPORTE ENVIADO CON ÉXITO',
        incidencia: respuesta.incidencia,
      };
    } catch (err) {
      throw err;
    }
  };

  return (
    <UsuarioContext.Provider
      value={{
        cargando,
        errorConexion,
        perfil,
        billetera,
        plan,
        viajeActivo,
        historialViajes,
        historialPagos,
        incidencias,
        estaciones,
        planesCatalogo,
        cargarDatosUsuario,
        actualizarBilletera,
        actualizarPerfil,
        toggleBloqueoTarjeta,
        recargarSaldo,
        pagarCobroPendiente,
        adquirirPlan,
        cancelarPlan,
        ultimoViaje,
        descartarUltimoViaje,
        reportarIncidencia,
      }}
    >
      {children}
    </UsuarioContext.Provider>
  );
}

export function useUsuario() {
  const context = useContext(UsuarioContext);
  if (!context) {
    return {
      cargando: false,
      errorConexion: '',
      perfil: { nombreCompleto: '', correo: '', telefono: '', tarjeta: null },
      billetera: { saldo: 0, tieneCobroPendiente: false, cobroPendiente: null, movimientos: [] },
      plan: { tienePlan: false, planActivo: null },
      planesCatalogo: [],
      estaciones: [],
      viajeActivo: null,
      historialViajes: [],
      historialPagos: [],
      incidencias: [],
      cargarDatosUsuario: async () => {},
      actualizarBilletera: async () => {},
      actualizarPerfil: async () => {},
      toggleBloqueoTarjeta: async () => {},
      recargarSaldo: async () => {},
      pagarCobroPendiente: async () => {},
      adquirirPlan: async () => {},
      cancelarPlan: async () => {},
      reportarIncidencia: async () => {},
      ultimoViaje: null,
      descartarUltimoViaje: () => {},
    };
  }
  return context;
}
