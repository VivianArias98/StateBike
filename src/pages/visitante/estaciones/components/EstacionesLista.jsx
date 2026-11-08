import { Icono } from '../../components/IconosVisitante.jsx';
import styles from './EstacionesLista.module.css';

function IconoBuscar() {
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
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function EstacionesLista({
  estaciones,
  resumen = [],
  busqueda,
  onBuscar,
  seleccionadaId,
  onSeleccionar,
  mensajeVacio = 'No encontramos estaciones con ese nombre.',
}) {
  return (
    <section
      className={styles.raiz}
      aria-label="Listado de estaciones"
    >
      <div className={styles.buscador}>
        <IconoBuscar />

        <input
          type="search"
          className={styles.inputBuscar}
          placeholder="Buscar estación por nombre"
          aria-label="Buscar estación por nombre"
          value={busqueda}
          onChange={(evento) => onBuscar(evento.target.value)}
        />

        <span className={styles.atajo} aria-hidden="true">CMD+K</span>
      </div>

      {resumen.length > 0 && (
        <ul className={styles.resumen} aria-label="Resumen de la red">
          {resumen.map((item) => (
            <li key={item.etiqueta} className={styles.resumenItem}>
              <span className={styles.resumenValor}>{item.valor}</span>
              <span className={styles.resumenEtiqueta}>{item.etiqueta}</span>
            </li>
          ))}
        </ul>
      )}

      <ul className={styles.lista}>
        {estaciones.map((estacion) => {
          const activa = estacion.id === seleccionadaId;

          return (
            <li key={estacion.id}>
              <button
                type="button"
                aria-pressed={activa}
                className={`${styles.tarjeta} ${activa ? styles.activa : ''}`}
                onClick={() => onSeleccionar(estacion.id)}
              >
                <span className={styles.cabecera}>
                  <span className={styles.nombre}>
                    {estacion.nombre}
                  </span>

                  <span className={styles.iconoEstacion} aria-hidden="true">
                    <Icono nombre="pin" />
                  </span>
                </span>

                <span className={styles.zona}>
                  {estacion.zona}
                </span>

                <span className={styles.estado}>
                  <span className={styles.pastilla}>
                    <Icono nombre="bici" />
                    {estacion.bicicletas} bicicletas disponibles
                  </span>

                  <span className={styles.anclajes}>
                    <Icono nombre="candado" />
                    {estacion.anclajes} anclajes libres
                  </span>
                </span>
              </button>
            </li>
          );
        })}

        {estaciones.length === 0 && (
          <li className={styles.vacio} role="status">
            {mensajeVacio}
          </li>
        )}
      </ul>

      <div className={styles.nfc}>
        <span className={styles.nfcIcono} aria-hidden="true">
          <Icono nombre="nfc" />
        </span>
        <div className={styles.nfcTexto}>
          <span className={styles.nfcTitulo}>¿Usas tarjeta física NFC?</span>
          <span className={styles.nfcDescripcion}>
            Acércala al tótem de cualquier estación para liberar tu bici.
          </span>
        </div>
      </div>
    </section>
  );
}

export default EstacionesLista;