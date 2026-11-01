import { useState } from 'react';

import VisitanteLayout from '../../../layouts/VisitanteLayout/VisitanteLayout.jsx';
import EstacionesLista from './components/EstacionesLista.jsx';
import MapaBicicletas from './components/MapaBicicletas.jsx';
import styles from './InicioMapa.module.css';

// Datos de ejemplo (solo maquetación).
const ESTACIONES = [
  {
    id: 1,
    nombre: 'Plaza de Bolívar',
    zona: 'Centro histórico',
    bicicletas: 7,
    anclajes: 3,
    x: 35,
    y: 58,
  },
  {
    id: 2,
    nombre: 'Centro comercial Viva',
    zona: 'Avenida universitaria',
    bicicletas: 6,
    anclajes: 4,
    x: 52,
    y: 43,
  },
  {
    id: 3,
    nombre: 'Universidad de Boyacá',
    zona: 'Carrera 2ª Este # 64 - 169',
    bicicletas: 2,
    anclajes: 8,
    x: 46,
    y: 62,
  },
];

function InicioMapa() {
  const [busqueda, setBusqueda] = useState('');
  const [seleccionadaId, setSeleccionadaId] = useState(ESTACIONES[0].id);

  const filtradas = ESTACIONES.filter((estacion) =>
    estacion.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  return (
    <VisitanteLayout itemActivo="Estaciones" fondo="blanco">
      <div className={styles.pagina}>
        <header>
          <h1 className={styles.titulo}>StationBike</h1>

          <p className={styles.subtitulo}>
            Mira dónde hay bicicletas listas para retirar y espacios libres para devolverlas.
          </p>
        </header>

        <section className={styles.contenido}>
          <EstacionesLista
            estaciones={filtradas}
            busqueda={busqueda}
            onBuscar={setBusqueda}
            seleccionadaId={seleccionadaId}
            onSeleccionar={setSeleccionadaId}
          />

          <MapaBicicletas
            estaciones={ESTACIONES}
            seleccionadaId={seleccionadaId}
            onSeleccionar={setSeleccionadaId}
          />
        </section>
      </div>
    </VisitanteLayout>
  );
}

export default InicioMapa;