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
} from '../../../components/Iconos/Iconos.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import MetricaUsuario from '../components/MetricaUsuario.jsx';
import { useUsuario } from '../context/UsuarioContext.jsx';
import styles from './InicioPage.module.css';

const LEYENDAS = [{ id: 'numero', contenido: 'El número indica la cantidad de bicicletas disponibles' }];

function InicioPage() {
  const navigate = useNavigate();
  const { perfil, plan, viajeActivo, estaciones = [] } = useUsuario();
  const [estacionSeleccionada, setEstacionSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const listaEstaciones = useMemo(() => (Array.isArray(estaciones) ? estaciones : []), [estaciones]);

  const estacionesFiltradas = useMemo(() => {
    if (!busqueda.trim()) return listaEstaciones;
    const q = busqueda.toLowerCase().trim();
    return listaEstaciones.filter(
      (est) =>
        est.nombre?.toLowerCase().includes(q) ||
        est.direccion?.toLowerCase().includes(q)
    );
  }, [listaEstaciones, busqueda]);

  const estacionActual = estacionSeleccionada || (listaEstaciones.length > 0 ? listaEstaciones[0] : null);

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
          subtitulo="Consulta las estaciones de Tunja y encuentra una bicicleta disponible para tu próximo recorrido."
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
              <span className={styles.conteo}>
                {estacionesFiltradas.length} {estacionesFiltradas.length === 1 ? 'estación' : 'estaciones'}
              </span>
            </div>

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
                  return (
                    <article
                      key={est.id}
                      className={`${styles.itemEstacion} ${seleccionada ? styles.itemSeleccionado : ''}`}
                      onClick={() => setEstacionSeleccionada(est)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setEstacionSeleccionada(est)}
                      aria-pressed={seleccionada}
                    >
                      <div className={styles.itemCabecera}>
                        <div className={styles.itemTituloZona}>
                          <h3 className={styles.nombreEstacion}>{est.nombre}</h3>
                          {seleccionada && (
                            <span className={styles.chipSeleccionada}>
                              <IconoCheck /> Seleccionada
                            </span>
                          )}
                        </div>
                        <span className={`insignia ${est.bicicletas > 0 ? 'insignia--activa' : 'insignia--neutra'}`}>
                          {est.bicicletas ?? 0} bicis
                        </span>
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
                          <strong>{est.bicicletas ?? 0}</strong> disponibles
                        </span>
                        <span className={styles.statAnclajes}>
                          <span className={styles.statIcono} aria-hidden="true">
                            <IconoAnclaje />
                          </span>
                          <strong>{est.anclajesLibres ?? 0}</strong> anclajes libres
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
