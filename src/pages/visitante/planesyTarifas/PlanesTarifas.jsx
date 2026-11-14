import { useEffect, useState } from 'react';

import VisitanteLayout from '../../../layouts/VisitanteLayout/VisitanteLayout.jsx';
import { Icono } from '../components/IconosVisitante.jsx';
import TarjetaPlan from './components/TarjetaPlan.jsx';
import BannerAcceso from './components/BannerAcceso.jsx';
import TarjetaBeneficio from './components/TarjetaBeneficio.jsx';
import { obtenerPlanes } from '../../../utils/catalogo.js';
import { textoError } from '../../../utils/mensajesError.js';
import { formatearCOP } from '../../../utils/formatoMoneda.js';
import styles from './PlanesTarifas.module.css';

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

const plural = (cantidad, singular, plural_) => (cantidad === 1 ? singular : plural_);

// Convierte un plan del backend a los datos que muestra la tarjeta.
function aVistaPlan(plan) {
  const dias = Number(plan.vigenciaDias);
  return {
    id: plan.id,
    dias: `${dias} ${plural(dias, 'DÍA', 'DÍAS')}`,
    nombre: plan.nombre,
    precio: formatearCOP(plan.costoBase),
    unidad: 'COP',
    valorMinutoExceso: plan.valorMinutoExceso,
    lineas: [
      { pre: 'Vigencia: ', fuerte: `${dias} ${plural(dias, 'día', 'días')}` },
      {
        fuerte: `${plan.viajesPorDia} ${plural(plan.viajesPorDia, 'viaje', 'viajes')}`,
        post: ' al día',
      },
      { fuerte: `${plan.tiempoViajeMin} min`, post: ' por trayecto' },
    ],
  };
}

function PlanesTarifas() {
  const [planes, setPlanes] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    obtenerPlanes()
      .then((datos) => {
        if (!activo) return;
        setPlanes(datos.planes.map(aVistaPlan));
        setMensaje(datos.mensaje ?? '');
      })
      .catch((e) => {
        if (activo) setError(textoError(e));
      });
    return () => {
      activo = false;
    };
  }, []);

  function contenidoPlanes() {
    if (error) {
      return <p className={styles.vacio} role="alert">{error}</p>;
    }
    if (!planes) {
      return <p className={styles.vacio} role="status">Cargando planes…</p>;
    }
    if (planes.length === 0) {
      return (
        <p className={styles.vacio} role="status">
          {mensaje || 'No hay planes disponibles por el momento'}
        </p>
      );
    }
    return planes.map((plan) => <TarjetaPlan key={plan.id} plan={plan} />);
  }

  return (
    <VisitanteLayout itemActivo="Planes y tarifas">
      <div className={styles.raiz}>
        <div className={styles.encabezado}>
          <div className={styles.encabezadoTexto}>
            <span className={styles.eyebrow}>
              <span className={styles.punto} aria-hidden="true" />
              {planes ? `${planes.length} OPCIONES DISPONIBLES · TUNJA 2025` : 'PLANES Y TARIFAS · TUNJA 2025'}
            </span>

            <h1 className={`titulo-pagina ${styles.titulo}`}>Catálogo de Planes Tunja Bici</h1>

            <p className={styles.subtitulo}>
              Elige la modalidad que mejor responda a tu ritmo de movilidad por la ciudad.
              Valores en pesos colombianos (COP).
            </p>
          </div>
        </div>

        <section className={styles.grilla} aria-label="Planes y tarifas disponibles">
          {contenidoPlanes()}
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
