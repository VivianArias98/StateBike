import { IconoBicicleta, IconoDesbloqueo } from '../../../../components/Iconos/Iconos.jsx';
import styles from './EspecificacionServicio.module.css';

// Tarjeta "Especificación del servicio" con sus botones debajo.
// filas: [{ etiqueta, valor, destacado, grande }]
// filaBicicleta: texto del anclaje asegurado
function EspecificacionServicio({ filas, filaBicicleta, onVerHistorial, onLiberarBicicleta }) {
  return (
    <div className={styles.raiz}>
      <section className={`tarjeta ${styles.tarjeta}`}>
        <h2 className={styles.cabecera}>ESPECIFICACIÓN DEL SERVICIO</h2>

        <dl className={styles.lista}>
          {filas.map((fila) => (
            <div key={fila.etiqueta} className={styles.fila}>
              <dt className={styles.etiqueta}>{fila.etiqueta}</dt>
              <dd
                className={[
                  styles.valor,
                  fila.destacado && styles.valorDestacado,
                  fila.grande && styles.valorGrande,
                ].filter(Boolean).join(' ')}
              >
                {fila.valor}
              </dd>
            </div>
          ))}
        </dl>

        {filaBicicleta && (
          <div className={styles.pie}>
            <span>Bicicleta asegurada</span>
            <span className={styles.pieValor}>
              <IconoDesbloqueo />
              {filaBicicleta}
            </span>
          </div>
        )}
      </section>

      <div className={styles.acciones}>
        <button
          type="button"
          className={`boton boton--bloque ${styles.botonHistorial}`}
          onClick={onVerHistorial}
        >
          VER DETALLE EN HISTORIAL →
        </button>
        <button
          type="button"
          className={`boton boton--acento boton--bloque ${styles.botonLiberar}`}
          onClick={onLiberarBicicleta}
        >
          LIBERAR OTRA BICICLETA <IconoBicicleta />
        </button>
      </div>
    </div>
  );
}

export default EspecificacionServicio;
