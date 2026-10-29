import styles from './TarjetaIndicador.module.css';

// Tarjeta con un indicador numérico.
// etiqueta: elemento opcional (por ejemplo <Etiqueta />)
// vivo: muestra el punto verde parpadeante
// enlace: texto opcional del enlace inferior
function TarjetaIndicador({ titulo, valor, etiqueta, vivo = false, enlace }) {
  return (
    <article className={`tarjeta ${styles.raiz}`}>
      <div className={styles.superior}>
        <h2 className={styles.titulo}>{titulo}</h2>
        {etiqueta}
        {vivo && <span className="punto-vivo" aria-hidden="true" />}
      </div>

      <div className={styles.inferior}>
        <p className={styles.valor}>{valor}</p>
        {/* Cuando exista React Router, este botón pasa a ser un <Link> */}
        {enlace && (
          <button type="button" className={`enlace ${styles.enlace}`}>
            {enlace}
          </button>
        )}
      </div>
    </article>
  );
}

export default TarjetaIndicador;