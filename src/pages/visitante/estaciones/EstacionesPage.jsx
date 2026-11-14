import { useEffect, useState } from 'react';

import VisitanteLayout from '../../../layouts/VisitanteLayout/VisitanteLayout.jsx';
import EstacionesLista from './components/EstacionesLista.jsx';
import { Icono } from '../components/IconosVisitante.jsx';
import MapaTunja from '../../../components/MapaTunja/MapaTunja.jsx';
import { obtenerEstaciones } from '../../../utils/catalogo.js';
import { textoError } from '../../../utils/mensajesError.js';

import styles from './EstacionesPage.module.css';

const ESPERA_BUSQUEDA_MS = 300;

// Convierte una estación del backend a los campos que usan la lista y el mapa.
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
  // Red completa: alimenta el mapa y el resumen.
  const [red, setRed] = useState(null);
  const [errorRed, setErrorRed] = useState('');
  // Resultados de la búsqueda (consulta con ?q=).
  const [resultados, setResultados] = useState(null);
  const [errorBusqueda, setErrorBusqueda] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [seleccionadaId, setSeleccionadaId] = useState(null);

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

  const estacionesLista = (origen?.estaciones ?? []).map(aVistaEstacion);
  const estacionesMapa = (red?.estaciones ?? [])
    .filter((estacion) => estacion.lat != null && estacion.lng != null)
    .map(aVistaEstacion);

  const totalBicis = (red?.estaciones ?? []).reduce((suma, e) => suma + (e.bicicletas ?? 0), 0);
  const totalAnclajes = (red?.estaciones ?? []).reduce((suma, e) => suma + (e.anclajesLibres ?? 0), 0);

  const resumen = [
    { valor: String(red?.estaciones?.length ?? 0), etiqueta: 'ESTACIONES' },
    { valor: String(totalBicis), etiqueta: 'BICIS ACTIVAS' },
    { valor: String(totalAnclajes), etiqueta: 'ANCLAJES LIBRES' },
  ];

  const seleccionada =
    estacionesLista.find((estacion) => estacion.id === seleccionadaId) ?? estacionesLista[0] ?? null;

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
            Mira dónde hay bicicletas listas para retirar y espacios
            libres para devolverlas.
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
          />

          <div className={styles.columnaMapa}>
            <MapaTunja
              titulo={null}
              estaciones={estacionesMapa}
              nota="El número indica la cantidad de bicicletas disponibles."
            />

            {seleccionada && (
              <div className={styles.panelEstacion}>
                <div className={styles.infoEstacion}>
                  <span className={styles.codigoEstacion}>Estación {seleccionada.id}</span>
                  <span className={styles.nombreEstacion}>{seleccionada.nombre}</span>
                  <span className={styles.metaEstacion}>
                    {seleccionada.bicicletas} bicicletas · {seleccionada.anclajes} anclajes libres
                  </span>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${seleccionada.lat},${seleccionada.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`boton boton--primario ${styles.botonLlegar}`}
                >
                  <Icono nombre="flechaDerecha" />
                  Cómo llegar
                </a>
              </div>
            )}
          </div>
        </section>
      </div>
    </VisitanteLayout>
  );
}

export default EstacionesPage;
