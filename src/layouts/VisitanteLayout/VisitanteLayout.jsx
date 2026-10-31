import styles from './VisitanteLayout.module.css';

const ENLACES = [
  { nombre: 'Estaciones', ruta: '/' },
  { nombre: 'Planes y tarifas', ruta: '/planes' },
];

function VisitanteLayout({ children, itemActivo, fondo = 'claro' }) {
  const conNavegacion = Boolean(itemActivo);

  const claseFondo = fondo === 'blanco' ? styles.principalBlanco : styles.principalClaro;

  return (
    <div className={styles.raiz}>
      <header className={styles.encabezado}>
        <div className={styles.izquierda}>
          <span className={styles.marca}>StationBike</span>

          {conNavegacion && (
            <nav className={styles.navegacion} aria-label="Principal">
              {ENLACES.map((enlace) => {
                const activo = enlace.nombre === itemActivo;
                return (
                  <a
                    key={enlace.nombre}
                    href={enlace.ruta}
                    aria-current={activo ? 'page' : undefined}
                    className={`${styles.enlace} ${activo ? styles.enlaceActivo : ''}`}
                  >
                    {enlace.nombre}
                  </a>
                );
              })}
            </nav>
          )}
        </div>

        {conNavegacion && (
          <div className={styles.derecha}>
            <a href="/login" className={styles.enlace}>Iniciar sesión</a>
            <a href="/registro" className="boton boton--primario boton--s">
              Registrarse
            </a>
          </div>
        )}
      </header>

      <main className={`${styles.principal} ${claseFondo}`}>{children}</main>

      <footer className={styles.pie}>
        <span>StationBike</span>
      </footer>
    </div>
  );
}

export default VisitanteLayout;
