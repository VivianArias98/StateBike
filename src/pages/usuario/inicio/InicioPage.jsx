import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import MapaTunja from '../../../components/MapaTunja/MapaTunja.jsx';
import {
  IconoCalendario,
  IconoCandado,
  IconoNfc,
  IconoReloj,
  IconoUbicacion,
  IconoBicicleta,
} from '../../../components/Iconos/Iconos.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import MetricaUsuario from '../components/MetricaUsuario.jsx';
import { useUsuario } from '../context/UsuarioContext.jsx';
import styles from './InicioPage.module.css';

const LEYENDAS = [{ id: 'numero', contenido: 'El número indica la cantidad de bicicletas disponibles' }];

function InicioPage() {
  const navigate = useNavigate();
  const { perfil, plan, billetera, viajeActivo, estaciones = [] } = useUsuario();
  const [estacionSeleccionada, setEstacionSeleccionada] = useState(null);

  const listaEstaciones = Array.isArray(estaciones) ? estaciones : [];
  const estacionActual = estacionSeleccionada || (listaEstaciones.length > 0 ? listaEstaciones[0] : null);

  const irADesbloquear = (estacion) => {
    navigate('/viajes', { state: { estacionId: estacion?.id || estacionActual?.id } });
  };

  const primerNombre = perfil?.nombreCompleto ? perfil.nombreCompleto.split(' ')[0] : 'Ciudadano';
  const tarjetaNfc = perfil?.tarjeta;
  const nfcActivo = tarjetaNfc?.estado === 'ACTIVA';

  return (
    <UsuarioLayout itemActivo="Inicio">
      <div className={styles.raiz}>
        <EncabezadoPagina
          etiqueta="Usuario / Inicio y estaciones / Pantalla principal"
          titulo={`Hola, ${primerNombre}`}
          subtitulo="Consulta las estaciones de Tunja y encuentra una bicicleta disponible para tu próximo recorrido."
          acciones={
            <span className={styles.red}>
              <span className="punto-vivo" aria-hidden="true" />
              Red operativa Tunja
            </span>
          }
        />

        {viajeActivo && (
          <div className="tarjeta" style={{ borderColor: 'var(--color-primario)', background: 'var(--color-input-fondo)', marginBottom: 'var(--espacio-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--espacio-3)' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 'var(--espacio-2)' }}>
                <span className="punto-vivo" />
                Tienes un viaje en curso activo con la bicicleta #{viajeActivo.bicicleta}
              </p>
              <p style={{ margin: 0, fontSize: 'var(--texto-xs)', opacity: 0.8 }}>
                Origen: {viajeActivo.estacionOrigen} · {viajeActivo.minutosTranscurridos} minutos transcurridos
              </p>
            </div>
            <button
              type="button"
              className="boton boton--primario"
              onClick={() => navigate('/viajes')}
            >
              Ver viaje en curso
            </button>
          </div>
        )}

        <div className={styles.metricas}>
          <MetricaUsuario
            etiqueta="Mi plan"
            valor={plan?.tienePlan && plan?.planActivo ? plan.planActivo.nombre : 'Sin plan activo'}
            detalle={plan?.tienePlan && plan?.planActivo ? `${plan.planActivo.tiempoViajeMin || 0} min incluidos por viaje` : 'Adquiere uno en Mi Plan'}
            icono={<IconoCalendario />}
          />
          <MetricaUsuario
            etiqueta="Viajes restantes hoy"
            valor={plan?.tienePlan && plan?.planActivo ? `${plan.planActivo.viajesRestantesHoy ?? 0} de ${plan.planActivo.viajesPorDia ?? 0}` : '0 viajes'}
            detalle="Límite diario según tu suscripción"
            icono={<IconoReloj />}
          />
          <MetricaUsuario
            etiqueta="Tarjeta NFC"
            valor={tarjetaNfc?.ultimosDigitos ? `•••• ${tarjetaNfc.ultimosDigitos}` : 'Sin vincular'}
            detalle={tarjetaNfc ? (nfcActivo ? 'ACTIVA · Lista para desbloqueo' : 'BLOQUEADA · No abre anclajes') : 'Sin tarjeta asignada'}
            icono={<IconoNfc />}
          />
        </div>

        <div className={styles.contenido}>
          <div className={styles.mapa}>
            <MapaTunja
              titulo={null}
              estaciones={listaEstaciones}
              leyendas={LEYENDAS}
              onSeleccionarEstacion={(est) => setEstacionSeleccionada(est)}
            />
          </div>

          <section className={styles.lateral} aria-labelledby="estaciones-cercanas">
            <div className={styles.cabeceraLista}>
              <h2 id="estaciones-cercanas" className={styles.tituloLista}>
                Estaciones de la red
              </h2>
              <span className={styles.conteo}>{listaEstaciones.length} estaciones</span>
            </div>

            <div className={styles.lista}>
              {listaEstaciones.length === 0 ? (
                <p style={{ padding: 'var(--espacio-4)', color: 'var(--color-texto-apagado)', textAlign: 'center' }}>
                  No hay estaciones disponibles
                </p>
              ) : (
                listaEstaciones.map((est) => {
                  const seleccionada = (estacionActual?.id === est.id);
                  return (
                    <div
                      key={est.id}
                      className={`tarjeta ${styles.itemEstacion} ${seleccionada ? styles.itemSeleccionado : ''}`}
                      onClick={() => setEstacionSeleccionada(est)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setEstacionSeleccionada(est)}
                      style={{
                        cursor: 'pointer',
                        border: seleccionada ? '2px solid var(--color-primario)' : undefined,
                        padding: 'var(--espacio-3)',
                        marginBottom: 'var(--espacio-2)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{ fontSize: 'var(--texto-s)', margin: 0 }}>{est.nombre}</h3>
                        <span className="insignia insignia--activa" style={{ fontSize: 'var(--texto-xs)' }}>
                          {est.bicicletas ?? 0} bicis
                        </span>
                      </div>
                      <p style={{ fontSize: 'var(--texto-xs)', opacity: 0.7, margin: 'var(--espacio-1) 0' }}>
                        {est.direccion}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--texto-xs)' }}>
                        <span style={{ color: 'var(--color-exito)' }}>🚲 {est.bicicletas ?? 0} disponibles</span>
                        <span style={{ opacity: 0.8 }}>🔒 {est.anclajesLibres ?? 0} anclajes libres</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button
              type="button"
              className={`boton boton--primario boton--bloque ${styles.accion}`}
              onClick={() => irADesbloquear(estacionSeleccionada)}
            >
              <IconoCandado /> DESBLOQUEAR BICICLETA
            </button>

            <p className={styles.ayuda}>
              <span className={styles.iconoAyuda} aria-hidden="true">
                <IconoNfc />
              </span>
              <span>
                También puedes acercar tu tarjeta física {tarjetaNfc?.ultimosDigitos ? <strong>#{tarjetaNfc.ultimosDigitos}</strong> : ''} directamente al tótem del anclaje.
              </span>
            </p>
          </section>
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default InicioPage;
