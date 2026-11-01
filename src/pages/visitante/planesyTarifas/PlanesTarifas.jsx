import { useState } from 'react';

import VisitanteLayout from '../../../layouts/VisitanteLayout/VisitanteLayout.jsx';
import TarjetaPlan from './components/TarjetaPlan.jsx';
import BannerAcceso from './components/BannerAcceso.jsx';
import styles from './PlanesTarifas.module.css';

const PLANES = [
  { id: 1, nombre: 'Viaje Único', costo: '$4.500', tiempo: 15 },
  { id: 2, nombre: 'Pase Diario', costo: '$8.000', tiempo: 30 },
  { id: 3, nombre: 'Plan Mensual', costo: '$40.000', tiempo: 45, destacado: true },
  { id: 4, nombre: 'Plan Trimestral', costo: '$100.000', tiempo: 60 },
];

function IconoAlternar() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function PlanesTarifas() {
  const [mostrarVacio, setMostrarVacio] = useState(false);

  const planes = mostrarVacio ? [] : PLANES;

  return (
    <VisitanteLayout itemActivo="Planes y tarifas">
      <div className={styles.pagina}>

        <header>
          <h1 className={styles.titulo}>Planes y tarifas</h1>

          <p className={styles.subtitulo}>
            Valores en pesos colombianos (COP). Compáralos y elige el que más te convenga.
          </p>
        </header>

        <div className={styles.barraAlterna}>
          <button
            type="button"
            className={`boton boton--s ${styles.alternar}`}
            onClick={() => setMostrarVacio((valor) => !valor)}
          >
            <IconoAlternar />
            <span>Alternar:</span>
            <span className={styles.enlaceAlterno}>
              {mostrarVacio ? 'Ver planes' : 'Ver estado vacío'}
            </span>
          </button>
        </div>

        <section className={styles.grilla}>
          {planes.length === 0 ? (
            <p className={styles.vacio}>
              Aún no hay planes disponibles. Vuelve pronto.
            </p>
          ) : (
            planes.map((plan) => (
              <TarjetaPlan key={plan.id} plan={plan} />
            ))
          )}
        </section>

        <BannerAcceso />

      </div>
    </VisitanteLayout>
  );
}

export default PlanesTarifas;