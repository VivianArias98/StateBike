import { useEffect, useState, useMemo } from 'react';

import VisitanteLayout from '../../../layouts/VisitanteLayout/VisitanteLayout.jsx';
import EstacionesLista from './components/EstacionesLista.jsx';
import { Icono } from '../components/IconosVisitante.jsx';
import MapaTunja from '../../../components/MapaTunja/MapaTunja.jsx';
import { obtenerEstaciones } from '../../../utils/catalogo.js';
import { textoError } from '../../../utils/mensajesError.js';
import useUbicacionTiempoReal from '../../../hooks/useUbicacionTiempoReal.js';
import {
  enriquecerEstacionesConDistancia,
  ordenarEstacionesPorCercania,
} from '../../../utils/geolocalizacion.js';

import styles from './EstacionesPage.module.css';

const ESPERA_BUSQUEDA_MS = 300;

function aVistaEstacion(estacion) {
  return {
    id: estacion.id,
    nombre: estacion.nombre,
    zona: estacion.direccion,
    bicicletas: estacion.bicicletas,
    anclajes: estacion.anclajesLibres,
    lat: estacion.lat,
    lng: estacion.lng,
  };
}

function EstacionesPage() {
  const [busqueda, setBusqueda] = useState('');

  const [red, setRed] = useState(null);
  const [errorRed, setErrorRed] = useState('');
  // Resultados de la búsqueda (consulta con ?q=).
  const [resultados, setResultados] = useState(null);
  const [errorBusqueda, setErrorBusqueda] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [seleccionadaId, setSeleccionadaId] = useState(null);
  const [mostrarModalAviso, setMostrarModalAviso] = useState(false);

  // Cerrar modal de aviso al presionar Escape
  useEffect(() => {
    function manejarTeclaEscape(e) {
      if (e.key === 'Escape' && mostrarModalAviso) {
        setMostrarModalAviso(false);
      }
    }
    if (mostrarModalAviso) {
      window.addEventListener('keydown', manejarTeclaEscape);
    }
    return () => {
      window.removeEventListener('keydown', manejarTeclaEscape);
    };
  }, [mostrarModalAviso]);

  // Hook de geolocalización en tiempo real
  const {
    ubicacion,
    cargando: cargandoUbicacion,
    error: errorUbicacion,
    activar: activarUbicacion,
  } = useUbicacionTiempoReal({ autoActivar: true });

  useEffect(() => {
    let activo = true;
    obtenerEstaciones()
      .then((datos) => {
        if (activo) setRed(datos);
      })
      .catch((error) => {
        if (activo) setErrorRed(textoError(error));
      });
    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    const texto = busqueda.trim();
    if (!texto) return undefined;

    let activo = true;
    const temporizador = setTimeout(() => {
      setBuscando(true);
      obtenerEstaciones(texto)
        .then((datos) => {
          if (!activo) return;
          setResultados(datos);
          setErrorBusqueda('');
        })
        .catch((error) => {
          if (!activo) return;
          setResultados(null);
          setErrorBusqueda(textoError(error));
        })
        .finally(() => {
          if (activo) setBuscando(false);
        });
    }, ESPERA_BUSQUEDA_MS);

    return () => {
      activo = false;
      clearTimeout(temporizador);
    };
  }, [busqueda]);

  const buscar = busqueda.trim().length > 0;
  const origen = buscar ? resultados : red;
  const errorActivo = buscar ? errorBusqueda : errorRed;

  // Enriquecer estaciones con distancias y ordenarlas por cercanía si hay GPS activo
  const estacionesLista = useMemo(() => {
    const base = (origen?.estaciones ?? []).map(aVistaEstacion);
    const enriquecidas = enriquecerEstacionesConDistancia(base, ubicacion);
    return ubicacion ? ordenarEstacionesPorCercania(enriquecidas) : enriquecidas;
  }, [origen, ubicacion]);

  const estacionesMapa = useMemo(() => {
    const base = (red?.estaciones ?? [])
      .filter((estacion) => estacion.lat != null && estacion.lng != null)
      .map(aVistaEstacion);
    return enriquecerEstacionesConDistancia(base, ubicacion);
  }, [red, ubicacion]);

  // Estación más cercana de la red
  const estacionMasCercana = useMemo(() => {
    return estacionesLista.find((est) => est.esMasCercana) ?? null;
  }, [estacionesLista]);

  const totalBicis = (red?.estaciones ?? []).reduce((suma, e) => suma + (e.bicicletas ?? 0), 0);
  const totalAnclajes = (red?.estaciones ?? []).reduce((suma, e) => suma + (e.anclajesLibres ?? 0), 0);

  const resumen = [
    { valor: String(red?.estaciones?.length ?? 0), etiqueta: 'ESTACIONES' },
    { valor: String(totalBicis), etiqueta: 'BICIS ACTIVAS' },
    { valor: String(totalAnclajes), etiqueta: 'ANCLAJES LIBRES' },
  ];

  // Si no se ha elegido una estación manual, priorizar la estación más cercana
  const seleccionada =
    estacionesLista.find((estacion) => estacion.id === seleccionadaId) ??
    estacionMasCercana ??
    estacionesLista[0] ??
    null;

  function mensajeVacio() {
    if (buscar && buscando) return 'Buscando estaciones…';
    if (!buscar && !red && !errorRed) return 'Cargando estaciones…';
    if (errorActivo) return errorActivo;
    if (origen?.mensaje) return origen.mensaje;
    return buscar
      ? 'No se encontraron estaciones con ese nombre'
      : 'No hay estaciones disponibles';
  }

  return (
    <VisitanteLayout itemActivo="Estaciones">
      <div className={styles.raiz}>
        <header>
          <h1 className={styles.titulo}>
            StationBike
          </h1>

          <p className={styles.subtitulo}>
            Mira dónde hay bicicletas listas para retirar, espacios libres para devolverlas y la estación más cercana a ti en tiempo real.
          </p>
        </header>

        <section
          className={styles.contenido}
          aria-label="Estaciones y ubicación en el mapa"
        >
          <EstacionesLista
            estaciones={estacionesLista}
            resumen={resumen}
            busqueda={busqueda}
            onBuscar={setBusqueda}
            seleccionadaId={seleccionada?.id ?? null}
            onSeleccionar={setSeleccionadaId}
            mensajeVacio={mensajeVacio()}
            ubicacion={ubicacion}
            cargandoUbicacion={cargandoUbicacion}
            errorUbicacion={errorUbicacion}
            activarUbicacion={activarUbicacion}
            estacionMasCercana={estacionMasCercana}
          />

          <div className={styles.columnaMapa}>
            <MapaTunja
              titulo={null}
              estaciones={estacionesMapa}
              ubicacionActual={ubicacion}
              idEstacionMasCercana={estacionMasCercana?.id}
              distanciaMasCercanaTexto={estacionMasCercana?.distanciaTexto}
              onActivarUbicacion={activarUbicacion}
              onSeleccionarEstacion={(est) => setSeleccionadaId(est.id)}
              nota="El número indica la cantidad de bicicletas disponibles. El punto con halo muestra tu ubicación exacta."
            />

            {seleccionada && (
              <div className={styles.panelEstacion}>
                <div className={styles.infoEstacion}>
                  <div className={styles.codigoYTag}>
                    <span className={styles.codigoEstacion}>Estación {seleccionada.id}</span>
                    {seleccionada.esMasCercana && (
                      <span className={styles.tagCercanaPanel}>★ MÁS CERCANA</span>
                    )}
                  </div>
                  <span className={styles.nombreEstacion}>{seleccionada.nombre}</span>
                  <span className={styles.metaEstacion}>
                    {seleccionada.bicicletas} {seleccionada.bicicletas === 1 ? 'bicicleta' : 'bicicletas'} · {seleccionada.anclajes} {seleccionada.anclajes === 1 ? 'anclaje libre' : 'anclajes libres'}
                    {seleccionada.distanciaTexto ? ` · a ${seleccionada.distanciaTexto} de ti` : ''}
                  </span>
                </div>

                <div className={styles.accionesPanel}>
                  <button
                    type="button"
                    className={`boton boton--primario ${styles.botonUsarBici}`}
                    onClick={() => setMostrarModalAviso(true)}
                    title="Usar una bicicleta de esta estación"
                  >
                    <Icono nombre="bici" />
                    <span>Usar bicicleta</span>
                  </button>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${seleccionada.lat},${seleccionada.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`boton boton--secundario ${styles.botonLlegar}`}
                    aria-label="Cómo llegar (abre Google Maps en una pestaña nueva)"
                    title="Cómo llegar (abre Google Maps en una pestaña nueva)"
                  >
                    <Icono nombre="flechaDerecha" />
                    <span>Cómo llegar</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Modal de aviso según requerimiento HU_9:
            "Si el visitante intenta interactuar con una bicicleta:
             'Para usar una bicicleta debe registrarse e iniciar sesión'" */}
        {mostrarModalAviso && (
          <div
            className={styles.modalOverlay}
            onClick={(e) => {
              if (e.target === e.currentTarget) setMostrarModalAviso(false);
            }}
            role="presentation"
          >
            <div
              className={styles.modalCaja}
              role="dialog"
              aria-modal="true"
              aria-labelledby="titulo-aviso-bicicleta"
            >
              <button
                type="button"
                className={styles.botonCerrarModal}
                onClick={() => setMostrarModalAviso(false)}
                aria-label="Cerrar aviso"
              >
                <Icono nombre="cancelar" />
              </button>

              <div className={styles.modalCabecera}>
                <div className={styles.modalIconoContenedor} aria-hidden="true">
                  <Icono nombre="bici" />
                </div>
                <h2 id="titulo-aviso-bicicleta" className={styles.modalTitulo}>
                  Para usar una bicicleta debe registrarse e iniciar sesión
                </h2>
              </div>

              <div className={styles.modalCuerpo}>
                <p className={styles.modalTexto}>
                  Para retirar y usar una bicicleta en la estación{' '}
                  <strong>{seleccionada?.nombre}</strong> o en cualquier punto del sistema StationBike,
                  debes contar con una cuenta activa y un plan vigente.
                </p>

                {seleccionada && (
                  <div className={styles.modalEstadoEstacion}>
                    <span className={styles.modalEstacionNombre}>{seleccionada.nombre}</span>
                    <span className={styles.modalEstacionBicis}>
                      {seleccionada.bicicletas}{' '}
                      {seleccionada.bicicletas === 1 ? 'bicicleta disponible' : 'bicicletas disponibles'}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.modalAcciones}>
                <a
                  href="/login"
                  className="boton boton--primario"
                  style={{ textDecoration: 'none' }}
                >
                  Iniciar sesión
                </a>
                <a
                  href="/registro"
                  className="boton boton--secundario"
                  style={{ textDecoration: 'none' }}
                >
                  Registrarse
                </a>
                <button
                  type="button"
                  className="boton boton--fantasma"
                  onClick={() => setMostrarModalAviso(false)}
                >
                  Volver al mapa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </VisitanteLayout>
  );
}

export default EstacionesPage;
