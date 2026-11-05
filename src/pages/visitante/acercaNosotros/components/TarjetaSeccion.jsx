import styles from './TarjetaSeccion.module.css';

// Tarjeta de texto: "Quiénes somos", "Por qué existimos", "Misión", "Visión".
// Props opcionales: icono, etiqueta (insignia), marca (texto técnico a la derecha),
// conImagen (muestra un bloque para la fotografía), etiquetas (pie técnico).
function TarjetaSeccion({ titulo, texto, icono, etiqueta, variante = 'activa', marca, conImagen = false, etiquetas = [] }) {
  const claseEtiqueta = {
    activa: 'insignia--activa',
    negra: styles.etiquetaNegra,
    verdeClaro: styles.etiquetaVerdeClaro,
  }[variante];

  return (
    <article className={`tarjeta ${styles.raiz}`}>
      <header className={styles.cabecera}>
        {etiqueta ? (
          <span className={`insignia ${claseEtiqueta}`}>{etiqueta}</span>
        ) : (
          <h2 className={styles.titulo}>{titulo}</h2>
        )}

        {marca && <span className={styles.marca}>{marca}</span>}
        {icono && !marca && <span className={styles.icono}>{icono}</span>}
      </header>

      {etiqueta && <h2 className={styles.titulo}>{titulo}</h2>}

      {conImagen && (
        <div className={styles.imagen} aria-hidden="true">
          {icono}
        </div>
      )}

      <p className={styles.texto}>{texto}</p>

      {etiquetas.length > 0 && (
        <footer className={styles.pie}>
          {etiquetas.map((item) => (
            <span key={item} className={styles.etiqueta}>{item}</span>
          ))}
        </footer>
      )}
    </article>
  );
}

export default TarjetaSeccion;
