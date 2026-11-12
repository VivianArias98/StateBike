import ListaDatos from '../../components/ListaDatos.jsx';
import { formatearPesos } from '../../formato.js';
import styles from './ResumenViaje.module.css';

// Resumen de HU_4 al devolver la bicicleta en el tótem
// mensaje y aviso vienen del backend con el texto exacto de la HU
function ResumenViaje({ mensaje, aviso, viaje, onCerrar, onHistorial, onPagarCobro }) {
  const datos = [
    { etiqueta: 'Origen', valor: viaje.origen },
    { etiqueta: 'Destino', valor: viaje.destino },
    { etiqueta: 'Duración', valor: `${viaje.duracionMin} min` },
    { etiqueta: 'Minutos de exceso', valor: `${viaje.minutosExceso} min` },
    { etiqueta: 'Valor cobrado', valor: formatearPesos(viaje.valorCobrado) },
  ];

  return (
    <section className={`tarjeta ${styles.raiz}`}>
      <h2 className={styles.titulo}>{mensaje}</h2>

      <ListaDatos datos={datos} />

      {aviso && (
        <p className="mensaje-error" role="alert">
          {aviso}
        </p>
      )}

      <div className={styles.acciones}>
        {aviso && (
          <button type="button" className="boton boton--primario" onClick={onPagarCobro}>
            PAGAR COBRO PENDIENTE
          </button>
        )}
        <button type="button" className="boton boton--secundario" onClick={onHistorial}>
          HISTORIAL
        </button>
        <button type="button" className="enlace" onClick={onCerrar}>
          Cerrar
        </button>
      </div>
    </section>
  );
}

export default ResumenViaje;