import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import MapaTunja from '../../../components/MapaTunja/MapaTunja.jsx';
import {
  IconoCalendario,
  IconoNfc,
  IconoReloj,
  IconoUbicacion,
  IconoBicicleta,
  IconoAnclaje,
  IconoBuscar,
  IconoCerrar,
  IconoCheck,
  IconoDesbloqueo,
  IconoGps,
} from '../../../components/Iconos/Iconos.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import MetricaUsuario from '../components/MetricaUsuario.jsx';
import { useUsuario } from '../context/UsuarioContext.jsx';
import useUbicacionTiempoReal from '../../../hooks/useUbicacionTiempoReal.js';
import {
  enriquecerEstacionesConDistancia,
  ordenarEstacionesPorCercania,
} from '../../../utils/geolocalizacion.js';
import styles from './InicioPage.module.css';

const LEYENDAS = [{ id: 'numero', contenido: 'El número indica la cantidad de bicicletas disponibles' }];

function InicioPage() {
  const navigate = useNavigate();
  const { perfil, plan, viajeActivo, estaciones = [] } = useUsuario();
  const [estacionSeleccionada, setEstacionSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  // Geolocalización en tiempo real
  const {
    ubicacion,
    cargando: cargandoUbicacion,
    error: errorUbicacion,
    activar: activarUbicacion,
  } = useUbicacionTiempoReal({ autoActivar: true });

  const listaEstaciones = useMemo(() => (Array.isArray(estaciones) ? estaciones : []), [estaciones]);

  // Enriquecer estaciones con distancias geodésicas en tiempo real
  const estacionesConDistancia = useMemo(() => {
    return enriquecerEstacionesConDistancia(listaEstaciones, ubicacion);
  }, [listaEstaciones, ubicacion]);

  // Estación más cercana calculada
  const estacionMasCercana = useMemo(() => {
    return estacionesConDistancia.find((est) => est.esMasCercana) ?? null;
  }, [estacionesConDistancia]);

  // Ordenar por distancia si el usuario tiene geolocalización activa
  const estacionesOrdenadas = useMemo(() => {
    return ubicacion ? ordenarEstacionesPorCercania(estacionesConDistancia) : estacionesConDistancia;
  }, [estacionesConDistancia, ubicacion]);

  const estacionesFiltradas = useMemo(() => {
    if (!busqueda.trim()) return estacionesOrdenadas;
    const q = busqueda.toLowerCase().trim();
    return estacionesOrdenadas.filter(
      (est) =>
        est.nombre?.toLowerCase().includes(q) ||
        est.direccion?.toLowerCase().includes(q)
    );
  }, [estacionesOrdenadas, busqueda]);

  const estacionActual =
    estacionSeleccionada ||
    estacionMasCercana ||
    (estacionesOrdenadas.length > 0 ? estacionesOrdenadas[0] : null);

  const irADesbloquear = (estacion) => {
    navigate('/viajes', { state: { estacionId: estacion?.id || estacionActual?.id } });
  };

  const primerNombre = perfil?.nombreCompleto ? perfil.nombreCompleto.split(' ')[0] : 'Ciudadano';
  const tarjetaNfc = perfil?.tarjeta;
  const nfcActivo = tarjetaNfc?.estado === 'ACTIVA';

  const tienePlan = Boolean(plan?.tienePlan && plan?.planActivo);
  const planNombre = tienePlan ? plan.planActivo.nombre : 'Sin plan activo';
  const tiempoViaje = tienePlan ? (plan.planActivo.tiempoViajeMin || 0) : 0;
  const viajesRestantes = tienePlan ? (plan.planActivo.viajesRestantesHoy ?? 0) : 0;
  const viajesPorDia = tienePlan ? (plan.planActivo.viajesPorDia ?? 0) : 0;
  const porcentajeViajes = viajesPorDia > 0 ? Math.min(100, Math.round((viajesRestantes / viajesPorDia) * 100)) : 0;

  return (
    <UsuarioLayout itemActivo="Inicio">
      <div className={styles.raiz}>
        <EncabezadoPagina
          etiqueta="Usuario / Inicio y estaciones / Pantalla principal"
          titulo={`Hola, ${primerNombre}`}
          subtitulo="Consulta las estaciones de Tunja, mira cuál está más cerca de ti en tiempo real y encuentra una bicicleta disponible."
          acciones={
            <span className={styles.red}>
              <span className="punto-vivo" aria-hidden="true" />
              Red operativa Tunja
            </span>
          }
        />

        {viajeActivo && (
          <aside className={styles.bannerViaje} aria-label="Viaje en curso">
            <div className={styles.bannerInfo}>
              <div className={styles.bannerIcono} aria-hidden="true">
                <IconoBicicleta />
              </div>
              <div className={styles.bannerTexto}>
                <p className={styles.bannerTitulo}>
                  <span className="punto-vivo" aria-hidden="true" />
                  Tienes un viaje en curso activo con la bicicleta #{viajeActivo.bicicleta}
                </p>
                <p className={styles.bannerDetalle}>
                  <span className={styles.bannerDetalleItem}>
                    <IconoUbicacion /> Origen: {viajeActivo.estacionOrigen}
                  </span>
                  <span className={styles.bannerDetalleSeparador}>·</span>
                  <span className={styles.bannerDetalleItem}>
                    <IconoReloj /> {viajeActivo.minutosTranscurridos} minutos transcurridos
                  </span>
                </p>
              </div>
            </div>
            <button
              type="button"
              className="boton boton--primario"
              onClick={() => navigate('/viajes')}
            >
              Ver viaje en curso
            </button>
          </aside>
        )}

        <div className={styles.metricas}>
          <MetricaUsuario
            etiqueta="Mi plan"
            valor={
              tienePlan ? (
                <div className={styles.planValorWrapper}>
                  <span>{planNombre}</span>
                  <span className={styles.planBadgeActivo}>
                    <span className="punto-vivo" aria-hidden="true" />
                    Activo
                  </span>
                </div>
              ) : (
                'Sin plan activo'
              )
            }
            detalle={
              tienePlan ? (
                <span className={styles.detalleConIcono}>
                  <IconoReloj />
                  <span>{tiempoViaje} min incluidos por viaje</span>
                </span>
              ) : (
                'Adquiere una suscripción en Mi Plan'
              )
            }
            icono={<IconoCalendario />}
          />

          <MetricaUsuario
            etiqueta="Viajes restantes hoy"
            valor={
              tienePlan ? (
                <div className={styles.contadorWrapper}>
                  <span className={styles.cifraGrande}>{viajesRestantes}</span>
                  <span className={styles.cifraSeparador}>/</span>
                  <span className={styles.cifraTotal}>{viajesPorDia}</span>
                  <span className={styles.cifraTexto}>hoy</span>
                </div>
              ) : (
                '0 viajes'
              )
            }
            extra={
              tienePlan && viajesPorDia > 0 ? (
                <div className={styles.barraViajes}>
                  <div
                    className={styles.barraViajesRelleno}
                    style={{ width: `${porcentajeViajes}%` }}
                    aria-hidden="true"
                  />
                </div>
              ) : null
            }
            detalle="Límite diario según tu suscripción"
            icono={<IconoReloj />}
          />

          <MetricaUsuario
            etiqueta="Tarjeta NFC"
            valor={
              tarjetaNfc ? (
                nfcActivo ? (
                  <div className={styles.nfcPillActiva}>
                    <span className={styles.nfcPuntoVivo} aria-hidden="true" />
                    <span className={styles.nfcTexto}>ACTIVA</span>
                  </div>
                ) : (
                  <div className={styles.nfcPillBloqueada}>
                    <span className={styles.nfcTexto}>BLOQUEADA</span>
                  </div>
                )
              ) : (
                <div className={styles.nfcPillSinVincular}>
                  <span className={styles.nfcTexto}>Sin vincular</span>
                </div>
              )
            }
            detalle={
              <span className={styles.detalleConIcono}>
                {tarjetaNfc && nfcActivo ? <IconoCheck /> : null}
                <span>
                  {tarjetaNfc
                    ? (nfcActivo
                        ? 'Tarjeta vinculada · Lista para desbloqueo'
                        : 'BLOQUEADA · No abre anclajes')
                    : 'Sin tarjeta asignada'}
                </span>
              </span>
            }
            icono={<IconoNfc />}
          />
        </div>

        <div className={styles.contenido}>
          <div className={styles.mapa}>
            <MapaTunja
              titulo={null}
              estaciones={estacionesConDistancia}
              ubicacionActual={ubicacion}
              idEstacionMasCercana={estacionMasCercana?.id}
              distanciaMasCercanaTexto={estacionMasCercana?.distanciaTexto}
              onActivarUbicacion={activarUbicacion}
              leyendas={LEYENDAS}
              onSeleccionarEstacion={(est) => setEstacionSeleccionada(est)}
              nota="El número indica la cantidad de bicicletas disponibles. El punto con halo muestra tu ubicación en tiempo real."
            />
          </div>

          <section className={styles.lateral} aria-labelledby="estaciones-cercanas">
            <div className={styles.cabeceraLista}>
              <h2 id="estaciones-cercanas" className={styles.tituloLista}>
                Estaciones de la red
              </h2>
              <span className={styles.conteo}>
                {estacionesFiltradas.length} {estacionesFiltradas.length === 1 ? 'estación' : 'estaciones'}
              </span>
            </div>

            {/* Banner de estado de geolocalización en tiempo real */}
            {ubicacion ? (
              <div className={styles.bannerUbicacion} role="status">
                <span className={styles.puntoVivo} aria-hidden="true" />
                <div className={styles.bannerUbicacionTexto}>
                  <span className={styles.bannerUbicacionTitulo}>Ubicación en tiempo real activa</span>
                  <span className={styles.bannerUbicacionSub}>
                    {estacionMasCercana
                      ? `Estación más cercana: ${estacionMasCercana.nombre} (a ${estacionMasCercana.distanciaTexto})`
                      : 'Calculando estación más cercana…'}
                  </span>
                </div>
              </div>
            ) : (
              <div className={styles.bannerUbicacionPrompt}>
                <div className={styles.bannerUbicacionPromptIcono} aria-hidden="true">
                  <IconoGps />
                </div>
                <div className={styles.bannerUbicacionTexto}>
                  <span className={styles.bannerUbicacionTitulo}>Estaciones más cercanas</span>
                  <span className={styles.bannerUbicacionSub}>
                    {errorUbicacion || 'Activa tu ubicación para ver cuál estación te queda más cerca.'}
                  </span>
                </div>
                {activarUbicacion && (
                  <button
                    type="button"
                    className={`boton boton--secundario ${styles.botonActivarGps}`}
                    onClick={activarUbicacion}
                    disabled={cargandoUbicacion}
                  >
                    {cargandoUbicacion ? 'Ubicando…' : 'Activar GPS'}
                  </button>
                )}
              </div>
            )}

            <div className={styles.buscador}>
              <span className={styles.iconoBuscador} aria-hidden="true">
                <IconoBuscar />
              </span>
              <input
                type="text"
                className={styles.buscadorInput}
                placeholder="Buscar estación por nombre o dirección..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                aria-label="Buscar estación"
              />
              {busqueda && (
                <button
                  type="button"
                  className={styles.botonLimpiar}
                  onClick={() => setBusqueda('')}
                  aria-label="Borrar búsqueda"
                >
                  <IconoCerrar />
                </button>
              )}
            </div>

            <div className={styles.lista}>
              {estacionesFiltradas.length === 0 ? (
                <div className={styles.sinResultados}>
                  <p className={styles.sinResultadosTexto}>
                    {busqueda
                      ? `No se encontraron estaciones para "${busqueda}"`
                      : 'No hay estaciones disponibles'}
                  </p>
                  {busqueda && (
                    <button
                      type="button"
                      className="boton boton--secundario"
                      onClick={() => setBusqueda('')}
                    >
                      Ver todas las estaciones
                    </button>
                  )}
                </div>
              ) : (
                estacionesFiltradas.map((est) => {
                  const seleccionada = (estacionActual?.id === est.id);
                  const esCercana = est.esMasCercana;

                  return (
                    <article
                      key={est.id}
                      className={`${styles.itemEstacion} ${seleccionada ? styles.itemSeleccionado : ''} ${esCercana ? styles.itemMasCercano : ''}`}
                      onClick={() => setEstacionSeleccionada(est)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setEstacionSeleccionada(est)}
                      aria-pressed={seleccionada}
                    >
                      <div className={styles.itemCabecera}>
                        <div className={styles.itemTituloZona}>
                          <div className={styles.nombreYTagCercana}>
                            <h3 className={styles.nombreEstacion}>{est.nombre}</h3>
                            {esCercana && (
                              <span className={styles.chipMasCercana}>
                                ★ Más cercana
                              </span>
                            )}
                          </div>
                          {seleccionada && (
                            <span className={styles.chipSeleccionada}>
                              <IconoCheck /> Seleccionada
                            </span>
                          )}
                        </div>

                        <div className={styles.insigniasCabecera}>
                          {est.distanciaTexto && (
                            <span className={`${styles.chipDistancia} ${esCercana ? styles.chipDistanciaCercana : ''}`}>
                              <IconoUbicacion /> {est.distanciaTexto}
                            </span>
                          )}
                          <span className={`insignia ${est.bicicletas > 0 ? 'insignia--activa' : 'insignia--neutra'}`}>
                            {est.bicicletas ?? 0} bicis
                          </span>
                        </div>
                      </div>

                      <p className={styles.direccionEstacion}>
                        <span className={styles.iconoDireccion} aria-hidden="true">
                          <IconoUbicacion />
                        </span>
                        <span>{est.direccion}</span>
                      </p>

                      <div className={styles.itemStats}>
                        <span className={styles.statDisponibles}>
                          <span className={styles.statIcono} aria-hidden="true">
                            <IconoBicicleta />
                          </span>
                          <strong>{est.bicicletas ?? 0}</strong> {est.bicicletas === 1 ? 'disponible' : 'disponibles'}
                        </span>
                        <span className={styles.statAnclajes}>
                          <span className={styles.statIcono} aria-hidden="true">
                            <IconoAnclaje />
                          </span>
                          <strong>{est.anclajesLibres ?? 0}</strong> {est.anclajesLibres === 1 ? 'anclaje libre' : 'anclajes libres'}
                        </span>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            <button
              type="button"
              className={`boton boton--primario boton--bloque ${styles.accion}`}
              onClick={() => irADesbloquear(estacionSeleccionada)}
            >
              <IconoDesbloqueo /> DESBLOQUEAR BICICLETA
            </button>

            <div className={styles.ayuda}>
              <span className={styles.iconoAyuda} aria-hidden="true">
                <IconoNfc />
              </span>
              <span>
                También puedes acercar tu tarjeta física directamente al tótem del anclaje.
              </span>
            </div>
          </section>
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default InicioPage;
