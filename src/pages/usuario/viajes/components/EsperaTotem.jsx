import MapaTunja from '../../../../components/MapaTunja/MapaTunja.jsx';
import { IconoNfc } from '../../../../components/Iconos/Iconos.jsx';
import ListaDatos from '../../components/ListaDatos.jsx';
import styles from './EsperaTotem.module.css';

const LEYENDAS = [{ id: 'numero', contenido: 'El número indica la cantidad de bicicletas disponibles' }];

// Pantalla sin viaje: el usuario aproxima la tarjeta en el tótem de una estación física
// plan: plan activo o null. cobroPendiente: { monto } o null
function EsperaTotem({ tarjeta, plan, cobroPendiente, estaciones, onPagarCobro }) {
  const datos = [
    {
      etiqueta: 'Tarjeta NFC',
      valor: tarjeta?.estado ? `Tarjeta ${tarjeta.estado}` : 'Sin vincular',
    },
    { etiqueta: 'Plan', valor: plan ? plan.nombre : 'Sin plan activo' },
    ...(plan
      ? [
          { etiqueta: 'Viajes restantes hoy', valor: `${plan.viajesRestantesHoy ?? 0} de ${plan.viajesPorDia ?? 0}` },
          { etiqueta: 'Tiempo incluido por viaje', valor: `${plan.tiempoViajeMin} min` },
        ]
      : []),
  ];

  // Textos de las HU_3 (criterios 2, 5 y 9): lo que impediría desbloquear una bicicleta
  const avisos = [];
  if (tarjeta?.estado !== 'ACTIVA') avisos.push('Tarjeta no vinculada o bloqueada');
  if (!plan) avisos.push('No tiene un plan activo');
  if (cobroPendiente) {
    avisos.push('Tiene un pago pendiente por exceso de tiempo. Recargue su saldo para continuar');
  }

  return (
    <div className={styles.raiz}>
      <section className={`tarjeta ${styles.lector}`}>
        <span className={styles.icono} aria-hidden="true">
          <IconoNfc />
        </span>
        <h2 className={styles.titulo}>Acerque su tarjeta NFC a un tótem</h2>
        <p className={styles.texto}>
          Estando en una estación física, acerque su tarjeta al lector del anclaje de la bicicleta que
          desea retirar. Esta pantalla se actualiza sola cuando el viaje inicia.
        </p>

        <div className={styles.datos}>
          <ListaDatos datos={datos} />
        </div>

        {avisos.map((aviso) => (
          <p key={aviso} className="mensaje-error" role="alert">
            {aviso}
          </p>
        ))}
        {cobroPendiente && (
          <button type="button" className="boton boton--s" onClick={onPagarCobro}>
            PAGAR COBRO PENDIENTE
          </button>
        )}
      </section>

      <div className={styles.mapa}>
        <MapaTunja titulo={null} estaciones={estaciones} leyendas={LEYENDAS} />
      </div>
    </div>
  );
}

export default EsperaTotem;