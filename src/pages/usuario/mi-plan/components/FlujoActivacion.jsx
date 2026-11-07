import { IconoCheck } from '../../../../components/Iconos/Iconos.jsx';
import styles from './FlujoActivacion.module.css';

// Flujo de activación en UNA sola tarjeta con cuatro pasos.
// estado: 'hecho' (lima), 'activo' (verde claro con número oscuro) o 'pendiente' (sin fondo).
function FlujoActivacion({ pasos }) {
  return (
    <section className={`tarjeta ${styles.raiz}`} aria-labelledby="flujo-titulo">
      <p id="flujo-titulo" className={styles.etiqueta}>
        Flujo de activación:
      </p>

      <ol className={styles.lista}>
        {pasos.map((paso, indice) => (
          <li key={paso.titulo} className={`${styles.paso} ${styles[paso.estado]}`}>
            <span className={styles.numero}>{String(indice + 1).padStart(2, '0')}</span>
            <div className={styles.texto}>
              <p className={styles.titulo}>{paso.titulo}</p>
              {paso.detalle && (
                <p className={styles.detalle}>
                  {paso.estado === 'hecho' && (
                    <span className={styles.check} aria-hidden="true">
                      <IconoCheck />
                    </span>
                  )}
                  {paso.detalle}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default FlujoActivacion;
