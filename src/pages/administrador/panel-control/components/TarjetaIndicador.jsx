import styles from './TarjetaIndicador.module.css';

// Tarjeta con un indicador numérico.
// etiqueta: elemento opcional (por ejemplo <Etiqueta />)
// vivo: muestra el punto verde parpadeante
// enlace: texto opcional del enlace inferior
// onClicEnlace: acción al hacer clic en el enlace
function TarjetaIndicador({ titulo, valor, etiqueta, vivo = false, enlace, onClicEnlace }) {
  return (
    <article className={`tarjeta ${styles.raiz}`}>
      <div className={styles.superior}>
        <h2 className={styles.titulo}>{titulo}</h2>
        {etiqueta}
        {vivo && <span className="punto-vivo" aria-hidden="true" />}
      </div>

      <div className={styles.inferior}>
        <p className={styles.valor}>{valor}</p>
        {enlace && (
          <button type="button" className={`enlace ${styles.enlace}`} onClick={onClicEnlace}>
            {enlace}
          </button>
        )}
      </div>
    </article>
  );
}

export default TarjetaIndicador;