import { useState } from 'react';

import VisitanteLayout from '../../../layouts/VisitanteLayout/VisitanteLayout.jsx';
import { Icono } from '../components/IconosVisitante.jsx';
import TarjetaPlan from './components/TarjetaPlan.jsx';
import BannerAcceso from './components/BannerAcceso.jsx';
import TarjetaBeneficio from './components/TarjetaBeneficio.jsx';
import styles from './PlanesTarifas.module.css';

// Catálogo del mockup (valores en COP). "lineas" son las viñetas de cada plan;
// "fuerte" es el dato resaltado en negrita.
const PLANES = [
  {
    id: 1,
    codigo: 'CAT_01',
    dias: '1 DÍA',
    nombre: 'Plan Diario',
    descripcion: 'Ideal para traslados esporádicos o emergencias.',
    precio: '$4.000',
    unidad: 'COP',
    lineas: [
      { pre: 'Vigencia: ', fuerte: '24 horas' },
      { fuerte: '2 viajes', post: ' al día' },
      { fuerte: '30 min', post: ' por trayecto' },
    ],
  },
  {
    id: 2,
    codigo: 'CAT_02',
    dias: '30 DÍAS',
    nombre: 'Plan Mensual',
    descripcion: 'El equilibrio óptimo para la rutina universitaria o laboral.',
    precio: '$32.000',
    unidad: 'COP / mes',
    actual: true,
    lineas: [
      { pre: 'Vigencia: ', fuerte: '30 días continuos' },
      { fuerte: '4 viajes', post: ' al día' },
      { fuerte: '40 min', post: ' por trayecto' },
    ],
  },
  {
    id: 3,
    codigo: 'CAT_03',
    dias: '180 DÍAS',
    nombre: 'Plan Semestral',
    descripcion: 'Ahorro sostenido para períodos académicos y contratos.',
    precio: '$150.000',
    unidad: 'COP',
    lineas: [
      { pre: 'Vigencia: ', fuerte: '180 días continuos' },
      { fuerte: '4 viajes', post: ' al día' },
      { fuerte: '45 min', post: ' por trayecto' },
    ],
  },
  {
    id: 4,
    codigo: 'CAT_04',
    dias: '365 DÍAS',
    nombre: 'Plan Anual',
    descripcion: 'Máxima autonomía y máxima ventana de trayecto por viaje.',
    precio: '$240.000',
    unidad: 'COP',
    lineas: [
      { pre: 'Vigencia: ', fuerte: '365 días continuos' },
      { fuerte: '4 viajes', post: ' al día' },
      { fuerte: '60 min', post: ' por trayecto' },
    ],
  },
];

const BENEFICIOS = [
  {
    icono: 'nfc',
    titulo: 'Desbloqueo Inmediato NFC',
    texto: 'Accede a cualquier cicloparqueadero dock con tu tarjeta municipal o la app móvil.',
  },
  {
    icono: 'bici',
    titulo: 'Flota 100% Eléctrica',
    texto: 'Asistencia al pedaleo ideal para la topografía y pendientes de Tunja a 2.820 msnm.',
  },
  {
    icono: 'escudo',
    titulo: 'Seguro Cívico Incluido',
    texto: 'Póliza de accidentes personales y asistencia vial durante todo el tiempo de uso.',
  },
];

function IconoAlternar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
    <VisitanteLayout itemActivo="Planes y tarifas" conUsuario>
      <div className={styles.raiz}>
        <div className={styles.encabezado}>
          <div className={styles.encabezadoTexto}>
            <span className={styles.eyebrow}>
              <span className={styles.punto} aria-hidden="true" />
              4 OPCIONES DISPONIBLES · TUNJA 2025
            </span>

            <h1 className={`titulo-pagina ${styles.titulo}`}>Catálogo de Planes Tunja Bici</h1>

            <p className={styles.subtitulo}>
              Elige la modalidad que mejor responda a tu ritmo de movilidad por la ciudad.
              Valores en pesos colombianos (COP).
            </p>
          </div>

          <button
            type="button"
            className={styles.alternar}
            onClick={() => setMostrarVacio((valor) => !valor)}
            aria-pressed={mostrarVacio}
          >
            <IconoAlternar />
            <span>Alternar: {mostrarVacio ? 'Ver planes' : 'Ver estado vacío'}</span>
          </button>
        </div>

        <section className={styles.grilla} aria-label="Planes y tarifas disponibles">
          {planes.length === 0 ? (
            <p className={styles.vacio} role="status">
              Aún no hay planes disponibles. Vuelve pronto.
            </p>
          ) : (
            planes.map((plan) => <TarjetaPlan key={plan.id} plan={plan} />)
          )}
        </section>

        <BannerAcceso />

        <section className={styles.beneficios} aria-label="Beneficios del servicio">
          {BENEFICIOS.map((beneficio) => (
            <TarjetaBeneficio key={beneficio.titulo} {...beneficio} />
          ))}
        </section>

        <footer className={styles.franja}>
          <p className={styles.aprobacion}>
            <Icono nombre="escudo" />
            <span>Aprobado por el Concejo y Secretaría de Tránsito y Transporte de Tunja.</span>
          </p>
          <p className={styles.version}>
            TARIFAS-V2025.2 <span className={styles.redActiva}>• RED ACTIVA</span>
          </p>
        </footer>
      </div>
    </VisitanteLayout>
  );
}

export default PlanesTarifas;
