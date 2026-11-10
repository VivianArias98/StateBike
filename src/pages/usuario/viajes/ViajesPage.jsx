import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import BarraProgreso from '../../../components/BarraProgreso/BarraProgreso.jsx';
import Aviso from '../../../components/Avisos/Aviso.jsx';
import {
  IconoBicicleta,
  IconoCandado,
  IconoNfc,
  IconoReloj,
  IconoUbicacion,
} from '../../../components/Iconos/Iconos.jsx';
import { useUsuario } from '../context/UsuarioContext.jsx';
import styles from './ViajesPage.module.css';

function ViajesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    perfil,
    plan,
    billetera,
    viajeActivo,
    estaciones,
    iniciarViaje,
    finalizarViaje,
  } = useUsuario();

  // Estado del flujo
  const [estacionSeleccionadaId, setEstacionSeleccionadaId] = useState(
    location.state?.estacionId || estaciones[0]?.id || 1
  );
  const [anclajeSeleccionado, setAnclajeSeleccionado] = useState(1);
  const [bicicletaSeleccionada, setBicicletaSeleccionada] = useState('BIC-003');

  // Devolución
  const [estacionDestinoId, setEstacionDestinoId] = useState(2);
  const [anclajeDestinoId, setAnclajeDestinoId] = useState(4);
  const [mostrandoModalDevolucion, setMostrandoModalDevolucion] = useState(false);
  const [ultimoResumenViaje, setUltimoResumenViaje] = useState(null);

  // Alertas
  const [aviso, setAviso] = useState(null);
  const [errorLocal, setErrorLocal] = useState(null);

  const estacionActual =
    estaciones.find((e) => e.id === Number(estacionSeleccionadaId)) || estaciones[0];
  const estacionDestino =
    estaciones.find((e) => e.id === Number(estacionDestinoId)) || estaciones[1];

  // Acción: Retirar con NFC
  const handleIniciarViaje = () => {
    setErrorLocal(null);
    try {
      const res = iniciarViaje({
        estacionId: estacionSeleccionadaId,
        anclajeId: anclajeSeleccionado,
        bicicletaId: bicicletaSeleccionada,
      });
      setAviso(res.mensaje);
    } catch (err) {
      setErrorLocal(err.message);
    }
  };

  // Acción: Finalizar Viaje
  const handleConfirmarDevolucion = () => {
    setErrorLocal(null);
    try {
      const res = finalizarViaje({
        estacionDestinoId,
        anclajeDestinoId,
      });
      setMostrandoModalDevolucion(false);
      setUltimoResumenViaje(res.resumen);
      setAviso(res.mensaje);
    } catch (err) {
      setErrorLocal(err.message);
    }
  };

  // Cálculo de tiempo para formateo
  const segundos = viajeActivo ? viajeActivo.segundosTranscurridos : 0;
  const mm = String(Math.floor(segundos / 60)).padStart(2, '0');
  const ss = String(segundos % 60).padStart(2, '0');
  const minutosTranscurridos = viajeActivo ? Math.floor(segundos / 60) : 0;
  const minutosIncluidos = viajeActivo ? viajeActivo.minutosIncluidos : 40;
  const minutosExceso = Math.max(0, minutosTranscurridos - minutosIncluidos);
  const costoExceso = Math.min(minutosExceso * 100, 5000);

  return (
    <UsuarioLayout itemActivo="Viajes">
      <div className={styles.raiz}>
        <EncabezadoPagina
          etiqueta="Usuario / Operación del servicio / Gestión de viajes"
          titulo="Viajes y Desbloqueo NFC"
          subtitulo="Inicia un viaje escaneando el tótem de la estación o finaliza tu recorrido devolviendo la bicicleta."
        />

        <Aviso mensaje={aviso} onCerrar={() => setAviso(null)} />

        {errorLocal && (
          <div className="alerta alerta--peligro" role="alert" style={{ marginBottom: 'var(--espacio-3)' }}>
            <strong>Atención:</strong> {errorLocal}
          </div>
        )}

        {/* SI HAY UN RESUMEN DE VIAJE RECIÉN FINALIZADO */}
        {ultimoResumenViaje && !viajeActivo && (
          <div className={`tarjeta ${styles.resumenLiquidacion}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 'var(--texto-xl)', margin: 0, color: 'var(--color-exito)' }}>
                ✓ Viaje Finalizado con Éxito
              </h2>
              <span className="insignia insignia--activa">{ultimoResumenViaje.codigo}</span>
            </div>
            <p style={{ margin: 0, fontSize: 'var(--texto-s)', color: 'var(--color-texto-apagado)' }}>
              El candado del anclaje ha sido bloqueado correctamente. Gracias por usar StateBike Tunja.
            </p>

            <div style={{ marginTop: 'var(--espacio-3)' }}>
              <div className={styles.filaResumen}>
                <span>Bicicleta:</span>
                <strong>{ultimoResumenViaje.bicicleta}</strong>
              </div>
              <div className={styles.filaResumen}>
                <span>Estación Origen:</span>
                <strong>{ultimoResumenViaje.origen}</strong>
              </div>
              <div className={styles.filaResumen}>
                <span>Estación Destino:</span>
                <strong>{ultimoResumenViaje.destino} (Anclaje #{ultimoResumenViaje.anclajeDestino})</strong>
              </div>
              <div className={styles.filaResumen}>
                <span>Duración total:</span>
                <strong>{ultimoResumenViaje.duracionMin} minutos</strong>
              </div>
              <div className={styles.filaResumen}>
                <span>Tiempo excedido:</span>
                <strong style={{ color: ultimoResumenViaje.minutosExceso > 0 ? 'var(--color-peligro)' : 'inherit' }}>
                  {ultimoResumenViaje.minutosExceso} minutos
                </strong>
              </div>
              <div className={styles.filaResumen}>
                <span>Costo liquidado por exceso:</span>
                <strong style={{ fontSize: 'var(--texto-l)', color: ultimoResumenViaje.costoExceso > 0 ? 'var(--color-peligro)' : 'var(--color-exito)' }}>
                  ${ultimoResumenViaje.costoExceso.toLocaleString('es-CO')} COP
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--espacio-3)', marginTop: 'var(--espacio-4)', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="boton boton--primario"
                onClick={() => setUltimoResumenViaje(null)}
              >
                Nuevo Viaje
              </button>
              <button
                type="button"
                className="boton boton--secundario"
                onClick={() => navigate('/historial')}
              >
                Ver en Mi Historial
              </button>
            </div>
          </div>
        )}

        {/* FASE 1: NO HAY VIAJE EN CURSO -> PANEL DE RETIRO */}
        {!viajeActivo && !ultimoResumenViaje && (
          <div className={styles.gridRetiro}>
            {/* Tarjeta de Terminal NFC y Simulación */}
            <div className={`tarjeta ${styles.tarjetaNfcVisual}`}>
              <span className={styles.iconoTerminal} aria-hidden="true">
                📶
              </span>
              <h2 style={{ fontSize: 'var(--texto-xl)', margin: 0 }}>Terminal NFC de Estación</h2>
              <p style={{ fontSize: 'var(--texto-s)', color: 'var(--color-texto-apagado)', margin: 0 }}>
                Acerca tu tarjeta <strong>NFC #{perfil?.tarjeta?.ultimosDigitos ?? '4821'}</strong> al lector del tótem o anclaje para desbloquear automáticamente.
              </p>

              <div
                className="tarjeta"
                style={{
                  width: '100%',
                  background: 'var(--color-input-fondo)',
                  border: '1px dashed var(--color-borde)',
                  padding: 'var(--espacio-4)',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--espacio-2)' }}>
                  <span style={{ fontSize: 'var(--texto-xs)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Tarjeta NFC Vinculada
                  </span>
                  <span
                    className={`insignia ${
                      perfil?.tarjeta?.estado === 'ACTIVA' ? 'insignia--activa' : 'insignia--bloqueada'
                    }`}
                  >
                    {perfil?.tarjeta?.estado}
                  </span>
                </div>
                <div style={{ fontSize: 'var(--texto-m)', fontWeight: 'bold' }}>
                  UID: {perfil?.tarjeta?.uid}
                </div>
                <div style={{ fontSize: 'var(--texto-xs)', opacity: 0.8, marginTop: 'var(--espacio-1)' }}>
                  Titular: {perfil?.nombreCompleto}
                </div>
              </div>

              {billetera.tieneCobroPendiente && (
                <div className="alerta alerta--peligro" style={{ width: '100%', textAlign: 'left' }}>
                  <strong>Cobro pendiente:</strong> Debe pagar $
                  {billetera.cobroPendiente?.monto?.toLocaleString('es-CO')} COP antes de iniciar otro viaje.{' '}
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', color: 'inherit', fontWeight: 'bold' }}
                    onClick={() => navigate('/billetera/pagar')}
                  >
                    Pagar ahora
                  </button>
                </div>
              )}

              <button
                type="button"
                className="boton boton--primario boton--bloque"
                onClick={handleIniciarViaje}
                disabled={perfil?.tarjeta?.estado !== 'ACTIVA' || !plan.tienePlan || billetera.tieneCobroPendiente}
              >
                <IconoNfc /> SIMULAR CONTACTO NFC Y RETIRAR
              </button>

              <p style={{ fontSize: 'var(--texto-xs)', opacity: 0.7, margin: 0 }}>
                {plan.tienePlan
                  ? `Plan activo: ${plan.planActivo.nombre} (${plan.planActivo.viajesRestantesHoy} viajes restantes hoy)`
                  : 'Requiere plan activo para retirar bicicletas.'}
              </p>
            </div>

            {/* Configuración de Estación y Anclaje */}
            <div className="tarjeta" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--espacio-4)' }}>
              <div>
                <h2 style={{ fontSize: 'var(--texto-l)', margin: 0 }}>Estación de Origen</h2>
                <p style={{ fontSize: 'var(--texto-xs)', color: 'var(--color-texto-apagado)', margin: 0 }}>
                  Selecciona la estación donde te encuentras ubicado
                </p>
              </div>

              <div className="campo">
                <label className="campo__etiqueta" htmlFor="selector-estacion">
                  Estación
                </label>
                <select
                  id="selector-estacion"
                  className="campo__control"
                  value={estacionSeleccionadaId}
                  onChange={(e) => setEstacionSeleccionadaId(Number(e.target.value))}
                >
                  {estaciones.map((est) => (
                    <option key={est.id} value={est.id}>
                      {est.nombre} ({est.bicicletas} bicis libres)
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo">
                <label className="campo__etiqueta">Seleccionar Anclaje Disponible</label>
                <div className={styles.grillaDocks}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((dockNum) => {
                    const seleccionado = anclajeSeleccionado === dockNum;
                    const tieneBici = dockNum <= estacionActual.bicicletas;
                    return (
                      <button
                        key={dockNum}
                        type="button"
                        className={`${styles.dockBoton} ${tieneBici ? styles.dockConBici : ''} ${
                          seleccionado ? styles.dockSeleccionado : ''
                        }`}
                        onClick={() => {
                          setAnclajeSeleccionado(dockNum);
                          setBicicletaSeleccionada(`BIC-00${dockNum}`);
                        }}
                      >
                        <span className={styles.dockNumero}>#{dockNum}</span>
                        <span className={styles.dockEstado}>{tieneBici ? '🚲 Bici' : 'Libre'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                className="tarjeta"
                style={{ background: 'var(--color-input-fondo)', padding: 'var(--espacio-3)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--texto-s)' }}>
                  <span>Bicicleta asignada:</span>
                  <strong>{bicicletaSeleccionada}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--texto-s)', marginTop: 'var(--espacio-1)' }}>
                  <span>Tiempo incluido:</span>
                  <strong>{plan.tienePlan ? `${plan.planActivo.tiempoViajeMin} minutos` : '0 min'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--texto-s)', marginTop: 'var(--espacio-1)' }}>
                  <span>Tarifa por minuto extra:</span>
                  <strong>$100 COP (tope $5.000)</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FASE 2: VIAJE EN CURSO */}
        {viajeActivo && (
          <div className={styles.panelViajeEnCurso}>
            <div className={styles.cabeceraViaje}>
              <div>
                <span className="insignia insignia--activa" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--espacio-1)' }}>
                  <span className="punto-vivo" /> VIAJE EN CURSO
                </span>
                <h2 style={{ fontSize: 'var(--texto-2xl)', margin: 'var(--espacio-1) 0 0' }}>
                  Bicicleta {viajeActivo.bicicleta}
                </h2>
              </div>
              <span style={{ fontSize: 'var(--texto-s)', color: 'var(--color-texto-apagado)' }}>
                Código: <strong>{viajeActivo.id}</strong>
              </span>
            </div>

            {/* Cronómetro en vivo */}
            <div className={styles.cronometroContenedor}>
              <span style={{ fontSize: 'var(--texto-xs)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Tiempo Transcurrido
              </span>
              <div className={styles.tiempoDigitos}>
                {mm}:{ss}
              </div>
              <span style={{ fontSize: 'var(--texto-xs)', opacity: 0.9 }}>
                Hora de inicio: {viajeActivo.horaInicio} · Incluye {viajeActivo.minutosIncluidos} min
              </span>
            </div>

            {/* Barra de progreso de tiempo incluido */}
            <div className={styles.barraContenedor}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--texto-xs)' }}>
                <span>{minutosTranscurridos} minutos de {viajeActivo.minutosIncluidos} incluidos</span>
                <span style={{ color: minutosExceso > 0 ? 'var(--color-peligro)' : 'inherit', fontWeight: 'bold' }}>
                  {minutosExceso > 0 ? `¡Exceso de ${minutosExceso} min! (+$${costoExceso.toLocaleString('es-CO')} COP)` : `${viajeActivo.minutosIncluidos - minutosTranscurridos} min restantes sin costo`}
                </span>
              </div>
              <BarraProgreso
                valor={minutosTranscurridos}
                maximo={viajeActivo.minutosIncluidos}
                etiqueta="Progreso del viaje"
              />
            </div>

            {/* Detalles del Viaje */}
            <div className={styles.detallesGrid}>
              <div className={styles.cajaDato}>
                <span className={styles.datoEtiqueta}>Estación de Salida</span>
                <span className={styles.datoValor}>{viajeActivo.estacionOrigen}</span>
                <span style={{ fontSize: 'var(--texto-xs)', color: 'var(--color-texto-apagado)' }}>
                  Anclaje #{viajeActivo.anclajeOrigen}
                </span>
              </div>
              <div className={styles.cajaDato}>
                <span className={styles.datoEtiqueta}>Tarifa Exceso</span>
                <span className={styles.datoValor}>$100 COP / min</span>
                <span style={{ fontSize: 'var(--texto-xs)', color: 'var(--color-texto-apagado)' }}>
                  Tope máx: $5.000 COP
                </span>
              </div>
              <div className={styles.cajaDato}>
                <span className={styles.datoEtiqueta}>Saldo en Billetera</span>
                <span className={styles.datoValor}>${billetera.saldo.toLocaleString('es-CO')} COP</span>
                <span style={{ fontSize: 'var(--texto-xs)', color: 'var(--color-texto-apagado)' }}>
                  Para cobros de exceso
                </span>
              </div>
            </div>

            {/* Acciones principales */}
            <div className={styles.accionesViaje}>
              <button
                type="button"
                className="boton boton--primario"
                style={{ flex: 1 }}
                onClick={() => setMostrandoModalDevolucion(true)}
              >
                🔒 Devolver Bicicleta en Estación
              </button>
              <button
                type="button"
                className="boton boton--secundario"
                onClick={() =>
                  navigate('/incidencias', { state: { bicicleta: viajeActivo.bicicleta } })
                }
              >
                ⚠ Reportar Incidencia
              </button>
            </div>
          </div>
        )}

        {/* MODAL DE DEVOLUCIÓN Y ANCLAJE */}
        {mostrandoModalDevolucion && (
          <div
            className="modal-fondo"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 'var(--espacio-4)',
            }}
          >
            <div
              className="tarjeta"
              style={{
                width: '100%',
                maxWidth: '32rem',
                background: 'var(--color-superficie)',
                padding: 'var(--espacio-6)',
              }}
            >
              <h2 style={{ fontSize: 'var(--texto-xl)', margin: '0 0 var(--espacio-2)' }}>
                Devolver Bicicleta #{viajeActivo?.bicicleta}
              </h2>
              <p style={{ fontSize: 'var(--texto-s)', color: 'var(--color-texto-apagado)', marginBottom: 'var(--espacio-4)' }}>
                Selecciona la estación y anclaje libre donde estás estacionando la bicicleta.
              </p>

              <div className="campo" style={{ marginBottom: 'var(--espacio-3)' }}>
                <label className="campo__etiqueta" htmlFor="modal-estacion-destino">
                  Estación de destino
                </label>
                <select
                  id="modal-estacion-destino"
                  className="campo__control"
                  value={estacionDestinoId}
                  onChange={(e) => setEstacionDestinoId(Number(e.target.value))}
                >
                  {estaciones.map((est) => (
                    <option key={est.id} value={est.id}>
                      {est.nombre} ({est.anclajesLibres} anclajes libres)
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo" style={{ marginBottom: 'var(--espacio-4)' }}>
                <label className="campo__etiqueta">Anclaje de Destino</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--espacio-2)' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((dock) => (
                    <button
                      key={dock}
                      type="button"
                      className={`boton ${anclajeDestinoId === dock ? 'boton--primario' : 'boton--secundario'}`}
                      style={{ padding: 'var(--espacio-2)' }}
                      onClick={() => setAnclajeDestinoId(dock)}
                    >
                      Dock #{dock}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="tarjeta"
                style={{
                  background: 'var(--color-input-fondo)',
                  padding: 'var(--espacio-3)',
                  marginBottom: 'var(--espacio-4)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--texto-s)' }}>
                  <span>Tiempo transcurrido:</span>
                  <strong>{minutosTranscurridos} min</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--texto-s)', marginTop: 'var(--espacio-1)' }}>
                  <span>Tiempo en exceso:</span>
                  <strong style={{ color: minutosExceso > 0 ? 'var(--color-peligro)' : 'inherit' }}>
                    {minutosExceso} min
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--texto-s)', marginTop: 'var(--espacio-1)' }}>
                  <span>Cobro por exceso:</span>
                  <strong style={{ color: costoExceso > 0 ? 'var(--color-peligro)' : 'var(--color-exito)' }}>
                    ${costoExceso.toLocaleString('es-CO')} COP
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--espacio-3)', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="boton boton--secundario"
                  onClick={() => setMostrandoModalDevolucion(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="boton boton--primario"
                  onClick={handleConfirmarDevolucion}
                >
                  Confirmar Devolución
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UsuarioLayout>
  );
}

export default ViajesPage;