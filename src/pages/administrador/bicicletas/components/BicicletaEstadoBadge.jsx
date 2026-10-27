import './BicicletaEstadoBadge.css';

const ESTADOS = {
  DISPONIBLE: { texto: '✓ DISPONIBLE', clase: 'bicicleta-badge--disponible' },
  EN_USO: { texto: '✓ EN USO', clase: 'bicicleta-badge--en-uso' },
  NO_DISPONIBLE: { texto: '– NO DISPONIBLE', clase: 'bicicleta-badge--no-disponible' },
};

function BicicletaEstadoBadge({ estado }) {
  const { texto, clase } = ESTADOS[estado];

  return <span className={`bicicleta-badge ${clase}`}>{texto}</span>;
}

export default BicicletaEstadoBadge;
