import styles from './BicicletaEstadoBadge.module.css';

const ESTADOS = {
  DISPONIBLE: { texto: '✓ DISPONIBLE', clase: 'insignia--activa' },
  EN_USO: { texto: '✓ EN USO', clase: 'insignia--neutra' },
  NO_DISPONIBLE: { texto: '– NO DISPONIBLE', clase: 'insignia--inactiva' },
};

function BicicletaEstadoBadge({ estado }) {
  const { texto, clase } = ESTADOS[estado];

  return <span className={`insignia ${clase} ${styles.raiz}`}>{texto}</span>;
}

export default BicicletaEstadoBadge;
