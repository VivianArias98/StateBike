import MapaTunja from '../../../../components/MapaTunja/MapaTunja.jsx';
import {
  IconoNfc,
  IconoCalendario,
  IconoReloj,
  IconoAlerta,
} from '../../../../components/Iconos/Iconos.jsx';
import styles from './EsperaTotem.module.css';

const LEYENDAS = [{ id: 'numero', contenido: 'El número indica la cantidad de bicicletas disponibles' }];

// Pantalla sin viaje: el usuario aproxima la tarjeta en el tótem de una estación física
function EsperaTotem({ tarjeta, plan, cobroPendiente, estaciones, onPagarCobro }) {
  const tarjetaActiva = tarjeta?.estado === 'ACTIVA';
  const tienePlan = Boolean(plan);

  // Textos de las HU_3 (criterios 2, 5 y 9): lo que impediría desbloquear una bicicleta
  const avisos = [];
  if (!tarjetaActiva) avisos.push('Tarjeta no vinculada o bloqueada');
  if (!tienePlan) avisos.push('No tiene un plan activo');
  if (cobroPendiente) {
    avisos.push('Tiene un pago pendiente por exceso de tiempo. Páguelo en Mi Billetera o acérquese a taquilla con el administrador si requiere recargar saldo');
  }

  return (
    <div className={styles.raiz}>
      <section className={`tarjeta ${styles.lector}`}>
        <div className={styles.radarContenedor}>
          <div className={styles.onda1} aria-hidden="true" />
          <div className={styles.onda2} aria-hidden="true" />
          <span className={styles.icono} aria-hidden="true">
            <IconoNfc />
          </span>
        </div>

        <h2 className={styles.titulo}>Acerque su tarjeta NFC a un tótem</h2>
        <p className={styles.texto}>
          Estando en una estación física, acerque su tarjeta al lector del anclaje de la bicicleta que
          desea retirar. Esta pantalla se actualiza sola cuando el viaje inicia.
        </p>

        {/* Tarjetas de estado / resumen del usuario */}
        <div className={styles.gridEstado}>
          <div className={styles.itemEstado}>
            <div className={styles.itemEstadoCabecera}>
              <span className={styles.itemEstadoEtiqueta}>Tarjeta NFC</span>
              <span className={styles.itemEstadoIcono}><IconoNfc /></span>
            </div>
            <div className={styles.itemEstadoValor}>
              {tarjeta?.estado ? (
                tarjetaActiva ? (
                  <span className={styles.pillActiva}>
                    <span className="punto-vivo" aria-hidden="true" /> ACTIVA
                  </span>
                ) : (
                  <span className={styles.pillBloqueada}>{tarjeta.estado}</span>
                )
              ) : (
                <span className={styles.pillInactiva}>Sin vincular</span>
              )}
            </div>
          </div>

          <div className={styles.itemEstado}>
            <div className={styles.itemEstadoCabecera}>
              <span className={styles.itemEstadoEtiqueta}>Plan de suscripción</span>
              <span className={styles.itemEstadoIcono}><IconoCalendario /></span>
            </div>
            <div className={styles.itemEstadoValor}>
              <span className={styles.valorTextoDestacado}>
                {tienePlan ? plan.nombre : 'Sin plan activo'}
              </span>
            </div>
          </div>

          {tienePlan && (
            <>
              <div className={styles.itemEstado}>
                <div className={styles.itemEstadoCabecera}>
                  <span className={styles.itemEstadoEtiqueta}>Viajes restantes hoy</span>
                  <span className={styles.itemEstadoIcono}><IconoReloj /></span>
                </div>
                <div className={styles.itemEstadoValor}>
                  <span className={styles.cifraGrande}>{plan.viajesRestantesHoy ?? 0}</span>
                  <span className={styles.cifraSecundaria}>de {plan.viajesPorDia ?? 0} viajes</span>
                </div>
              </div>

              <div className={styles.itemEstado}>
                <div className={styles.itemEstadoCabecera}>
                  <span className={styles.itemEstadoEtiqueta}>Tiempo por viaje</span>
                  <span className={styles.itemEstadoIcono}><IconoReloj /></span>
                </div>
                <div className={styles.itemEstadoValor}>
                  <span className={styles.cifraGrande}>{plan.tiempoViajeMin}</span>
                  <span className={styles.cifraSecundaria}>min incluidos</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Pasos rápidos para el usuario */}
        <div className={styles.pasosContenedor}>
          <div className={styles.pasoItem}>
            <span className={styles.pasoNumero}>1</span>
            <span className={styles.pasoTexto}>Ubica la estación física</span>
          </div>
          <div className={styles.pasoSeparador} aria-hidden="true">→</div>
          <div className={styles.pasoItem}>
            <span className={styles.pasoNumero}>2</span>
            <span className={styles.pasoTexto}>Acerca tu tarjeta al tótem</span>
          </div>
          <div className={styles.pasoSeparador} aria-hidden="true">→</div>
          <div className={styles.pasoItem}>
            <span className={styles.pasoNumero}>3</span>
            <span className={styles.pasoTexto}>Retira y comienza tu viaje</span>
          </div>
        </div>

        {/* Avisos si existen impedimentos */}
        {avisos.length > 0 && (
          <div className={styles.avisosLista}>
            {avisos.map((aviso) => (
              <div key={aviso} className={styles.avisoCard} role="alert">
                <span className={styles.avisoIcono} aria-hidden="true">
                  <IconoAlerta />
                </span>
                <span className={styles.avisoTexto}>{aviso}</span>
              </div>
            ))}
          </div>
        )}

        {cobroPendiente && (
          <button
            type="button"
            className={`boton boton--primario ${styles.botonPagar}`}
            onClick={onPagarCobro}
          >
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
