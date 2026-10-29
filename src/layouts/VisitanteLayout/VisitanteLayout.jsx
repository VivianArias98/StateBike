import styles from './VisitanteLayout.module.css';

function VisitanteLayout({ children }) {
  return (
    <div className={styles.raiz}>
      <main className={styles.principal}>{children}</main>

      <footer className={styles.pie}>
        <span>StationBike</span>
        <span>Tunja</span>
      </footer>
    </div>
  );
}

export default VisitanteLayout;