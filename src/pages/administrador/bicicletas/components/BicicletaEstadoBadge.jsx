import styles from './BicicletaEstadoBadge.module.css';

const ESTADOS = {
  DISPONIBLE: { texto: '✓ DISPONIBLE', clase: 'insignia--activa' },
  EN_USO: { texto: '● EN USO', clase: 'insignia--neutra' },
  MANTENIMIENTO: { texto: '▲ MANTENIMIENTO', clase: 'insignia--neutra' },
  INACTIVA: { texto: '– INACTIVA', clase: 'insignia--inactiva' },
};

function BicicletaEstadoBadge({ estado }) {
  const config = ESTADOS[estado] || { texto: estado, clase: 'insignia--neutra' };

  return <span className={`insignia ${config.clase} ${styles.raiz}`}>{config.texto}</span>;
}

export default BicicletaEstadoBadge;
