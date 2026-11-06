import React from 'react';
import styles from './MetricasUsuario.module.css';

function MetricasUsuario() {
  return (
    <div className={styles.metricasGrid}>
      <article className="tarjeta">
        <p className={styles.metricaEtiqueta}>MI PLAN</p>
        <p className={styles.metricaValor}>Plan mensual</p>
        <p className={styles.metricaDetalle}>45 min incluidos por viaje</p>
      </article>
      <article className="tarjeta">
        <p className={styles.metricaEtiqueta}>TIEMPO DISPONIBLE</p>
        <p className={styles.metricaValor}>45 minutos</p>
        <p className={styles.metricaDetalle}>Disponibles para tu próximo viaje</p>
      </article>
      <article className="tarjeta">
        <p className={styles.metricaEtiqueta}>TARJETA NFC</p>
        <p className={styles.metricaValor}>•••• 4821</p>
        <p className={styles.metricaEstado}>
          <span className="punto-vivo" style={{ '--color-punto': 'var(--color-primario)' }}></span> ACTIVA - Lista para usar
        </p>
      </article>
    </div>
  );
}

export default MetricasUsuario;