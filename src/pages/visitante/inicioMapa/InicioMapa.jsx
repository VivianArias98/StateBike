import { useState } from 'react';

import VisitanteLayout from '../../../layouts/VisitanteLayout/VisitanteLayout.jsx';
import EstacionesLista from './components/EstacionesLista.jsx';
import MapaTunja from '../../../components/MapaTunja/MapaTunja.jsx';

import styles from './InicioMapa.module.css';

// Datos de ejemplo (solo maquetación).
// Coordenadas aproximadas de Tunja.
const ESTACIONES = [
  {
    id: 1,
    nombre: 'Plaza de Bolívar',
    zona: 'Centro histórico',
    bicicletas: 7,
    anclajes: 3,
    lat: 5.5357,
    lng: -73.3675,
  },
  {
    id: 2,
    nombre: 'Centro comercial Viva',
    zona: 'Avenida universitaria',
    bicicletas: 6,
    anclajes: 4,
    lat: 5.5435,
    lng: -73.3555,
  },
  {
    id: 3,
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

  return (
    <VisitanteLayout itemActivo="Estaciones" fondo="blanco">
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
            busqueda={busqueda}
            onBuscar={setBusqueda}
            seleccionadaId={seleccionadaId}
            onSeleccionar={setSeleccionadaId}
          />

          <MapaTunja
            titulo={null}
            estaciones={ESTACIONES}
            nota="El número indica la cantidad de bicicletas disponibles."
          />
        </section>
      </div>
    </VisitanteLayout>
  );
}

export default InicioMapa;