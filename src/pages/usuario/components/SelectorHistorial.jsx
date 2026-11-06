import styles from './SelectorHistorial.module.css';

// Alterna entre el historial de viajes y el de pagos. El cambio de pantalla lo decide la página.
const OPCIONES = [
  { valor: 'viajes', texto: 'Viajes' },
  { valor: 'pagos', texto: 'Pagos' },
];

function SelectorHistorial({ activo, onCambiar }) {
  return (
    <div className={styles.raiz} role="group" aria-label="Tipo de historial">
      {OPCIONES.map((opcion) => {
        const seleccionada = opcion.valor === activo;
        return (
          <button
            key={opcion.valor}
            type="button"
            aria-pressed={seleccionada}
            className={seleccionada ? `${styles.opcion} ${styles.opcionActiva}` : styles.opcion}
            onClick={() => onCambiar(opcion.valor)}
          >
            {opcion.texto}
          </button>
        );
      })}
    </div>
  );
}

export default SelectorHistorial;
