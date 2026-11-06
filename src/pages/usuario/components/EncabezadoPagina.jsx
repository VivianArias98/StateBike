import styles from './EncabezadoPagina.module.css';

// Encabezado común de las pantallas de usuario: etiqueta, título, texto de apoyo y acciones opcionales
function EncabezadoPagina({ etiqueta, titulo, subtitulo, acciones }) {
  return (
    <header className={styles.raiz}>
      <div className={styles.texto}>
        {etiqueta && <p className={styles.etiqueta}>{etiqueta}</p>}
        <h1 className={styles.titulo}>{titulo}</h1>
        {subtitulo && <p className={styles.subtitulo}>{subtitulo}</p>}
      </div>
      {acciones && <div className={styles.acciones}>{acciones}</div>}
    </header>
  );
}

export default EncabezadoPagina;
