import styles from './BarraProgreso.module.css';

// Barra de progreso dinámica: el ancho depende de valor / maximo.
// etiqueta: descripción para lectores de pantalla
function BarraProgreso({ valor, maximo, etiqueta }) {
  const porcentaje = maximo > 0 ? Math.min(100, Math.max(0, (valor / maximo) * 100)) : 0;

  return (
    <div
      className={styles.pista}
      role="progressbar"
      aria-label={etiqueta}
      aria-valuenow={Math.min(valor, maximo)}
      aria-valuemin={0}
      aria-valuemax={maximo}
    >
      {/* El ancho es un valor dinámico, por eso va en línea */}
      <div className={styles.relleno} style={{ width: `${porcentaje}%` }} />
    </div>
  );
}

export default BarraProgreso;