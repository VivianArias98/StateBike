import { useState } from 'react';

import VisitanteLayout from '../../../layouts/VisitanteLayout/VisitanteLayout.jsx';
import EstacionesLista from './components/EstacionesLista.jsx';
import { Icono } from '../components/IconosVisitante.jsx';
import MapaTunja from '../../../components/MapaTunja/MapaTunja.jsx';

import styles from './InicioMapa.module.css';

// Datos de ejemplo (solo maquetación).
// Coordenadas aproximadas de Tunja.

// Cifras del resumen superior (datos de ejemplo).
const RESUMEN = [
  { valor: '12', etiqueta: 'ESTACIONES' },
  { valor: '54', etiqueta: 'BICIS ACTIVAS' },
  { valor: '38', etiqueta: 'ANCLAJES LIBRES' },
];
const ESTACIONES = [
  {
    id: 1,
    codigo: '07',
    nombre: 'Plaza de Bolívar',
    zona: 'Centro histórico',
    bicicletas: 7,
    anclajes: 3,
    lat: 5.5357,
    lng: -73.3675,
  },
  {
    id: 2,
    codigo: '12',
    nombre: 'Centro comercial Viva',
    zona: 'Avenida universitaria',
    bicicletas: 6,
    anclajes: 4,
    lat: 5.5435,
    lng: -73.3555,
  },
  {
    id: 3,
    codigo: '03',
    nombre: 'Universidad de Boyacá',
    zona: 'Carrera 2ª Este # 64 - 169',
    bicicletas: 2,
    anclajes: 8,
    lat: 5.5525,
    lng: -73.3545,
  },
];

function InicioMapa() {
  const [busqueda, setBusqueda] = useState('');

  const [seleccionadaId, setSeleccionadaId] = useState(
    ESTACIONES[0].id
  );

  const filtradas = ESTACIONES.filter((estacion) =>
    estacion.nombre
      .toLowerCase()
      .includes(busqueda.trim().toLowerCase())
  );

  const seleccionada = ESTACIONES.find((estacion) => estacion.id === seleccionadaId) ?? ESTACIONES[0];

  return (
    <VisitanteLayout itemActivo="Estaciones" conUsuario>
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
            estaciones={filtradas}
            resumen={RESUMEN}
            busqueda={busqueda}
            onBuscar={setBusqueda}
            seleccionadaId={seleccionadaId}
            onSeleccionar={setSeleccionadaId}
          />

          <div className={styles.columnaMapa}>
            <MapaTunja
              titulo={null}
              estaciones={ESTACIONES}
              nota="El número indica la cantidad de bicicletas disponibles."
            />

            <div className={styles.panelEstacion}>
              <div className={styles.infoEstacion}>
                <span className={styles.codigoEstacion}>Estación {seleccionada.codigo}</span>
                <span className={styles.nombreEstacion}>{seleccionada.nombre}</span>
                <span className={styles.metaEstacion}>
                  Altitud: 2.790 m · Conectividad 4G IoT Activa
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
          </div>
        </section>
      </div>
    </VisitanteLayout>
  );
}

export default InicioMapa;