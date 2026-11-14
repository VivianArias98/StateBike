import styles from './AdminEncabezado.module.css';

function AdminEncabezado({ etiqueta, titulo, subtitulo, acciones, icono }) {
  return (
    <header className={styles.raiz}>
      <div className={styles.texto}>
        {etiqueta && (
          <p className={styles.etiqueta}>
            <span className="punto-vivo" aria-hidden="true" />
            {etiqueta}
          </p>
        )}
        <h1 className={styles.titulo}>
          {icono && <span style={{ display: 'inline-flex', color: 'var(--color-primario)' }}>{icono}</span>}
          {titulo}
        </h1>
        {subtitulo && <p className={styles.subtitulo}>{subtitulo}</p>}
      </div>
      {acciones && <div className={styles.acciones}>{acciones}</div>}
    </header>
  );
}

export default AdminEncabezado;

