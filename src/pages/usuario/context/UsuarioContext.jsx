import React, { createContext, useContext, useState, useEffect } from 'react';
import { leerSesion } from '../../../services/sesion.js';

const UsuarioContext = createContext(null);

const ESTACIONES_BASE = [
  { id: 1, nombre: 'Estación Centro / Plaza de Bolívar', direccion: 'Cra. 10 #20-15', lat: 5.5353, lng: -73.3678, bicicletas: 7, anclajesLibres: 5 },
  { id: 2, nombre: 'Universidad de Boyacá', direccion: 'Carrera 2ª Este #64-169', lat: 5.5528, lng: -73.3562, bicicletas: 2, anclajesLibres: 8 },
  { id: 3, nombre: 'Centro comercial Viva', direccion: 'Avenida Universitaria', lat: 5.5455, lng: -73.3505, bicicletas: 6, anclajesLibres: 4 },
  { id: 4, nombre: 'Estación Terminal', direccion: 'Transversal 19 Bis', lat: 5.5412, lng: -73.3590, bicicletas: 3, anclajesLibres: 9 },
];

export const PLANES_CATALOGO = [
  {
    id: 1,
    codigo: 'CAT_01',
    vigenciaDias: 1,
    nombre: 'Plan Diario',
    descripcion: 'Ideal para traslados esporádicos o emergencias en la ciudad.',
    costoBase: 4000,
    viajesPorDia: 2,
    tiempoViajeMin: 30,
    valorMinutoExceso: 100,
    caracteristicas: ['Vigencia: 24 horas', '2 viajes al día', '30 min por trayecto', 'Exceso: $100 COP/min'],
  },
  {
    id: 2,
    codigo: 'CAT_02',
    vigenciaDias: 30,
    nombre: 'Plan Mensual',
    descripcion: 'El equilibrio óptimo para la rutina universitaria o laboral en Tunja.',
    costoBase: 32000,
    viajesPorDia: 4,
    tiempoViajeMin: 40,
    valorMinutoExceso: 100,
    caracteristicas: ['Vigencia: 30 días continuos', '4 viajes al día', '40 min por trayecto', 'Exceso: $100 COP/min'],
    recomendado: true,
  },
  {
    id: 3,
    codigo: 'CAT_03',
    vigenciaDias: 180,
    nombre: 'Plan Semestral',
    descripcion: 'Ahorro sostenido para periodos académicos y contratos de trabajo.',
    costoBase: 150000,
    viajesPorDia: 4,
    tiempoViajeMin: 45,
    valorMinutoExceso: 100,
    caracteristicas: ['Vigencia: 180 días continuos', '4 viajes al día', '45 min por trayecto', 'Exceso: $100 COP/min'],
  },
  {
    id: 4,
    codigo: 'CAT_04',
    vigenciaDias: 365,
    nombre: 'Plan Anual',
    descripcion: 'Máxima autonomía y máxima ventana de trayecto por cada viaje.',
    costoBase: 240000,
    viajesPorDia: 4,
    tiempoViajeMin: 60,
    valorMinutoExceso: 100,
    caracteristicas: ['Vigencia: 365 días continuos', '4 viajes al día', '60 min por trayecto', 'Exceso: $100 COP/min'],
  },
];

export function UsuarioProvider({ children }) {
  const sesion = leerSesion()?.usuario;

  // 1. Perfil del Usuario (HU_1)
  const [perfil, setPerfil] = useState({
    id: sesion?.id ?? 19,
    nombreCompleto: sesion?.nombre ?? 'Laura Gómez Rojas',
    correo: sesion?.email ?? sesion?.correo ?? 'usuario.prueba@ejemplo.com',
    telefono: '3124567890',
    fechaNacimiento: '2001-05-14',
    tarjeta: {
      id: 1,
      uid: '04A1B2C3D4E5F6',
      ultimosDigitos: '4821',
      estado: 'ACTIVA', // 'ACTIVA' | 'BLOQUEADA'
      fechaVinculacion: '2026-11-01',
    },
  });

  // 2. Billetera Virtual (HU_23, HU_24, HU_25)
  const [billetera, setBilletera] = useState({
    saldo: 45000,
    tieneCobroPendiente: false,
    cobroPendiente: null,
    movimientos: [
      {
        id: 'mov-1',
        tipo: 'RECARGA',
        concepto: 'Recarga de saldo por PSE',
        fecha: new Date(Date.now() - 3600000 * 4).toISOString(),
        monto: 30000,
        saldoResultante: 45000,
        estado: 'PAGADO',
      },
      {
        id: 'mov-2',
        tipo: 'COMPRA_PLAN',
        concepto: 'Adquisición de Plan Mensual',
        fecha: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
        monto: 32000,
        saldoResultante: 15000,
        estado: 'PAGADO',
      },
      {
        id: 'mov-3',
        tipo: 'RECARGA',
        concepto: 'Recarga de saldo inicial',
        fecha: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
        monto: 47000,
        saldoResultante: 47000,
        estado: 'PAGADO',
      },
    ],
  });

  // 3. Plan Activo (HU_2, HU_17)
  const [plan, setPlan] = useState({
    tienePlan: true,
    planActivo: {
      id: 2,
      nombre: 'Plan Mensual',
      costoBase: 32000,
      vigenciaDias: 30,
      diasUsados: 12,
      diasRestantes: 18,
      porcentajeConsumo: 40,
      viajesPorDia: 4,
      viajesHoy: 1,
      viajesRestantesHoy: 3,
      tiempoViajeMin: 40,
      valorMinutoExceso: 100,
      fechaInicio: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
      fechaFin: new Date(Date.now() + 3600000 * 24 * 18).toISOString(),
    },
  });

  // 4. Viaje en curso (HU_3, HU_4)
  const [viajeActivo, setViajeActivo] = useState(null);

  // 5. Historial de Viajes (HU_5)
  const [historialViajes, setHistorialViajes] = useState([
    {
      id: 101,
      codigo: 'VJ-88391',
      bicicleta: 'BIC-003',
      origen: 'Estación Centro / Plaza de Bolívar',
      destino: 'Universidad de Boyacá',
      fechaInicio: new Date(Date.now() - 3600000 * 28).toISOString(),
      fechaFin: new Date(Date.now() - 3600000 * 27.5).toISOString(),
      duracionMin: 32,
      minutosExceso: 0,
      costoExceso: 0,
      estado: 'FINALIZADO',
    },
    {
      id: 100,
      codigo: 'VJ-88320',
      bicicleta: 'BIC-014',
      origen: 'Centro comercial Viva',
      destino: 'Estación Centro / Plaza de Bolívar',
      fechaInicio: new Date(Date.now() - 3600000 * 72).toISOString(),
      fechaFin: new Date(Date.now() - 3600000 * 71).toISOString(),
      duracionMin: 52,
      minutosExceso: 12,
      costoExceso: 1200,
      estado: 'FINALIZADO',
    },
  ]);

  // 6. Incidencias reportadas (HU_6)
  const [incidencias, setIncidencias] = useState([
    {
      id: 1,
      tipo: 'bicicleta',
      recurso: 'BIC-003',
      descripcion: 'El freno delantero se siente suelto y hace ruido al frenar.',
      fecha: new Date(Date.now() - 3600000 * 48).toISOString(),
      estado: 'ABIERTA',
    },
  ]);

  // Cronómetro del viaje activo si existe
  useEffect(() => {
    if (!viajeActivo) return;
    const interval = setInterval(() => {
      setViajeActivo((prev) => {
        if (!prev) return null;
        const segundos = prev.segundosTranscurridos + 1;
        const minutos = Math.floor(segundos / 60);
        return {
          ...prev,
          segundosTranscurridos: segundos,
          minutosTranscurridos: minutos,
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [viajeActivo]);

  // OPERACIONES INTERACTIVAS

  // Actualizar perfil (HU_1)
  const actualizarPerfil = ({ nombreCompleto, telefono }) => {
    setPerfil((prev) => ({
      ...prev,
      nombreCompleto: nombreCompleto || prev.nombreCompleto,
      telefono: telefono || prev.telefono,
    }));
    return { exito: true, mensaje: 'PERFIL ACTUALIZADO CORRECTAMENTE' };
  };

  // Bloquear / Desbloquear Tarjeta NFC (HU_1)
  const toggleBloqueoTarjeta = () => {
    if (viajeActivo) {
      throw new Error('No puede bloquear la tarjeta con un viaje en curso');
    }
    const nuevoEstado = perfil.tarjeta.estado === 'ACTIVA' ? 'BLOQUEADA' : 'ACTIVA';
    setPerfil((prev) => ({
      ...prev,
      tarjeta: { ...prev.tarjeta, estado: nuevoEstado },
    }));
    return nuevoEstado === 'BLOQUEADA'
      ? 'TARJETA BLOQUEADA CORRECTAMENTE'
      : 'TARJETA DESBLOQUEADA CORRECTAMENTE';
  };

  // Recargar saldo (HU_24)
  const recargarSaldo = (monto) => {
    const num = Number(monto);
    if (isNaN(num) || num < 100 || num > 500000) {
      throw new Error('El monto debe estar entre $100 y $500.000');
    }
    if (billetera.saldo + num > 2000000) {
      throw new Error('La recarga supera el saldo máximo permitido de $2.000.000');
    }

    const nuevoSaldo = billetera.saldo + num;
    const nuevoMovimiento = {
      id: `mov-${Date.now()}`,
      tipo: 'RECARGA',
      concepto: 'Recarga de saldo PSE / Billetera',
      fecha: new Date().toISOString(),
      monto: num,
      saldoResultante: nuevoSaldo,
      estado: 'PAGADO',
    };

    setBilletera((prev) => ({
      ...prev,
      saldo: nuevoSaldo,
      movimientos: [nuevoMovimiento, ...prev.movimientos],
    }));

    return {
      mensaje: 'RECARGA EXITOSA',
      montoRecargado: num,
      nuevoSaldo,
      idTransaccion: nuevoMovimiento.id,
    };
  };

  // Pagar cobro pendiente (HU_25)
  const pagarCobroPendiente = () => {
    if (!billetera.tieneCobroPendiente || !billetera.cobroPendiente) {
      throw new Error('No tiene cobros pendientes');
    }
    const cobro = billetera.cobroPendiente.monto;
    if (billetera.saldo < cobro) {
      throw new Error(`Saldo insuficiente. Le faltan $${(cobro - billetera.saldo).toLocaleString('es-CO')}. Recargue su saldo`);
    }

    const nuevoSaldo = billetera.saldo - cobro;
    const cobroActual = billetera.cobroPendiente;
    const nuevoMov = {
      id: `mov-${Date.now()}`,
      tipo: 'COBRO_EXCESO',
      concepto: `Pago de cobro pendiente viaje #${cobroActual.viajeId || cobroActual.id}`,
      fecha: new Date().toISOString(),
      monto: cobro,
      saldoResultante: nuevoSaldo,
      estado: 'PAGADO',
    };

    setBilletera((prev) => ({
      saldo: nuevoSaldo,
      tieneCobroPendiente: false,
      cobroPendiente: null,
      movimientos: [nuevoMov, ...prev.movimientos],
    }));

    return {
      mensaje: 'COBRO PENDIENTE PAGADO CORRECTAMENTE',
      nuevoSaldo,
      cobro: {
        viajeId: cobroActual.viajeId || cobroActual.id || 'VJ-88320',
        montoPagado: cobro,
        minutosExceso: cobroActual.minutosExceso || 10,
        estadoCobro: 'PAGADO',
        saldoRestante: nuevoSaldo,
      },
    };
  };

  // Adquirir Plan (HU_2)
  const adquirirPlan = (planSeleccionado) => {
    if (perfil.tarjeta.estado !== 'ACTIVA') {
      throw new Error('Debe tener una tarjeta NFC activa para adquirir un plan');
    }
    if (plan.tienePlan) {
      throw new Error('Ya tiene un plan activo');
    }
    if (billetera.saldo < planSeleccionado.costoBase) {
      const falta = planSeleccionado.costoBase - billetera.saldo;
      throw new Error(`Saldo insuficiente para adquirir el plan. Le faltan $${falta.toLocaleString('es-CO')}. Recargue su saldo en MI BILLETERA`);
    }

    const nuevoSaldo = billetera.saldo - planSeleccionado.costoBase;
    const nuevoMov = {
      id: `mov-${Date.now()}`,
      tipo: 'COMPRA_PLAN',
      concepto: `Adquisición de ${planSeleccionado.nombre}`,
      fecha: new Date().toISOString(),
      monto: planSeleccionado.costoBase,
      saldoResultante: nuevoSaldo,
      estado: 'PAGADO',
    };

    setBilletera((prev) => ({
      ...prev,
      saldo: nuevoSaldo,
      movimientos: [nuevoMov, ...prev.movimientos],
    }));

    setPlan({
      tienePlan: true,
      planActivo: {
        id: planSeleccionado.id,
        nombre: planSeleccionado.nombre,
        costoBase: planSeleccionado.costoBase,
        vigenciaDias: planSeleccionado.vigenciaDias,
        diasUsados: 0,
        diasRestantes: planSeleccionado.vigenciaDias,
        porcentajeConsumo: 0,
        viajesPorDia: planSeleccionado.viajesPorDia,
        viajesHoy: 0,
        viajesRestantesHoy: planSeleccionado.viajesPorDia,
        tiempoViajeMin: planSeleccionado.tiempoViajeMin,
        valorMinutoExceso: planSeleccionado.valorMinutoExceso,
        fechaInicio: new Date().toISOString(),
        fechaFin: new Date(Date.now() + 3600000 * 24 * planSeleccionado.vigenciaDias).toISOString(),
      },
    });

    return { mensaje: 'PLAN ADQUIRIDO CON ÉXITO', plan: planSeleccionado };
  };

  // Cancelar Plan (HU_2)
  const cancelarPlan = () => {
    if (viajeActivo) {
      throw new Error('No puede cancelar con un viaje en curso');
    }
    if (!plan.tienePlan) {
      throw new Error('No tiene un plan activo');
    }

    setPlan({
      tienePlan: false,
      planActivo: null,
    });

    return { mensaje: 'PLAN CANCELADO CORRECTAMENTE' };
  };

  // Iniciar Viaje con NFC (HU_3)
  const iniciarViaje = ({ estacionId = 1, anclajeId = 3, bicicletaId = 'BIC-003' }) => {
    if (perfil.tarjeta.estado !== 'ACTIVA') {
      throw new Error('Tarjeta no vinculada o bloqueada');
    }
    if (!plan.tienePlan) {
      throw new Error('No tiene un plan activo para retirar bicicletas');
    }
    if (plan.planActivo.viajesRestantesHoy <= 0) {
      throw new Error('Alcanzó el límite de viajes de su plan por hoy');
    }
    if (billetera.tieneCobroPendiente) {
      throw new Error('Tiene un pago pendiente por exceso de tiempo. Recargue su saldo para continuar');
    }
    if (viajeActivo) {
      throw new Error('Ya tiene un viaje en curso');
    }

    const estacion = ESTACIONES_BASE.find((e) => e.id === Number(estacionId)) || ESTACIONES_BASE[0];

    const nuevoViaje = {
      id: `VJ-${Date.now().toString().slice(-5)}`,
      bicicleta: bicicletaId,
      estacionOrigen: estacion.nombre,
      direccionOrigen: estacion.direccion,
      anclajeOrigen: anclajeId,
      horaInicio: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      fechaInicio: new Date().toISOString(),
      segundosTranscurridos: 0,
      minutosTranscurridos: 0,
      minutosIncluidos: plan.planActivo.tiempoViajeMin,
      valorMinutoExceso: plan.planActivo.valorMinutoExceso,
    };

    setViajeActivo(nuevoViaje);

    // Descontar viaje diario
    setPlan((prev) => ({
      ...prev,
      planActivo: {
        ...prev.planActivo,
        viajesHoy: prev.planActivo.viajesHoy + 1,
        viajesRestantesHoy: Math.max(0, prev.planActivo.viajesRestantesHoy - 1),
      },
    }));

    return {
      mensaje: `VIAJE INICIADO. ¡BUEN RECORRIDO! Tiene ${plan.planActivo.tiempoViajeMin} minutos incluidos en su plan`,
      viaje: nuevoViaje,
    };
  };

  // Finalizar Viaje (HU_4)
  const finalizarViaje = ({ estacionDestinoId = 2, anclajeDestinoId = 4 }) => {
    if (!viajeActivo) {
      throw new Error('No hay ningún viaje en curso para finalizar');
    }

    const estacionDestino = ESTACIONES_BASE.find((e) => e.id === Number(estacionDestinoId)) || ESTACIONES_BASE[1];
    const duracionMin = Math.max(1, viajeActivo.minutosTranscurridos);
    const excesoMin = Math.max(0, duracionMin - viajeActivo.minutosIncluidos);

    // Cobro por exceso con tope de $5.000 COP
    let cobroExceso = 0;
    if (excesoMin > 0) {
      cobroExceso = Math.min(excesoMin * viajeActivo.valorMinutoExceso, 5000);
    }

    const viajeFinalizado = {
      id: Date.now(),
      codigo: viajeActivo.id,
      bicicleta: viajeActivo.bicicleta,
      origen: viajeActivo.estacionOrigen,
      destino: estacionDestino.nombre,
      anclajeDestino: anclajeDestinoId,
      fechaInicio: viajeActivo.fechaInicio,
      fechaFin: new Date().toISOString(),
      duracionMin,
      minutosExceso: excesoMin,
      costoExceso: cobroExceso,
      estado: 'FINALIZADO',
    };

    setHistorialViajes((prev) => [viajeFinalizado, ...prev]);

    // Aplicar cobro a la billetera si hubo exceso
    if (cobroExceso > 0) {
      if (billetera.saldo >= cobroExceso) {
        const nuevoSaldo = billetera.saldo - cobroExceso;
        setBilletera((prev) => ({
          ...prev,
          saldo: nuevoSaldo,
          movimientos: [
            {
              id: `mov-${Date.now()}`,
              tipo: 'COBRO_EXCESO',
              concepto: `Exceso de tiempo viaje #${viajeActivo.id} (${excesoMin} min)`,
              fecha: new Date().toISOString(),
              monto: cobroExceso,
              saldoResultante: nuevoSaldo,
              estado: 'PAGADO',
            },
            ...prev.movimientos,
          ],
        }));
      } else {
        // Queda como cobro pendiente
        setBilletera((prev) => ({
          ...prev,
          tieneCobroPendiente: true,
          cobroPendiente: {
            id: viajeActivo.id,
            viajeId: viajeActivo.id,
            monto: cobroExceso,
            minutosExceso: excesoMin,
            origen: viajeActivo.estacionOrigen,
            destino: estacionDestino.nombre,
            fecha: new Date().toISOString(),
            mensaje: 'Tiene un pago pendiente por exceso de tiempo. Recargue su saldo para continuar',
          },
        }));
      }
    }

    setViajeActivo(null);

    const mensajeExito =
      cobroExceso > 0
        ? `VIAJE FINALIZADO CON ÉXITO. Tiempo excedido: ${excesoMin} min. Cobro: $${cobroExceso.toLocaleString('es-CO')} COP`
        : 'VIAJE FINALIZADO CON ÉXITO';

    return { mensaje: mensajeExito, resumen: viajeFinalizado };
  };

  // Reportar Incidencia (HU_6)
  const reportarIncidencia = ({ tipo, bicicleta, estacion, descripcion }) => {
    if (!descripcion || !descripcion.trim()) {
      throw new Error('Hay campos obligatorios vacíos');
    }
    if (descripcion.length > 500) {
      throw new Error('La descripción excede el límite de 500 caracteres');
    }
    if (tipo === 'bicicleta' && !bicicleta) {
      throw new Error('Indique la bicicleta involucrada');
    }
    if (tipo === 'estacion' && !estacion) {
      throw new Error('Indique la estación involucrada');
    }
    if (tipo === 'otro' && !bicicleta && !estacion) {
      throw new Error('Indique la bicicleta o la estación involucrada');
    }

    const nuevaIncidencia = {
      id: Date.now(),
      tipo,
      recurso: tipo === 'bicicleta' ? bicicleta : tipo === 'estacion' ? estacion : 'Tarjeta NFC',
      descripcion: descripcion.trim(),
      fecha: new Date().toISOString(),
      estado: 'ABIERTA',
    };

    setIncidencias((prev) => [nuevaIncidencia, ...prev]);

    return { mensaje: 'REPORTE ENVIADO CON ÉXITO', incidencia: nuevaIncidencia };
  };

  return (
    <UsuarioContext.Provider
      value={{
        perfil,
        billetera,
        plan,
        viajeActivo,
        historialViajes,
        incidencias,
        estaciones: ESTACIONES_BASE,
        planesCatalogo: PLANES_CATALOGO,
        actualizarPerfil,
        toggleBloqueoTarjeta,
        recargarSaldo,
        pagarCobroPendiente,
        adquirirPlan,
        cancelarPlan,
        iniciarViaje,
        finalizarViaje,
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
    throw new Error('useUsuario debe usarse dentro de un UsuarioProvider');
  }
  return context;
}
