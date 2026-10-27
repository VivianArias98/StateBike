import './EstadoBadge.css';

function EstadoBadge({ estado }) {
  const activa = estado === 'ACTIVE';

  return (
    <span className={activa ? 'estado-badge estado-badge--activa' : 'estado-badge'}>
      {activa ? '✓ Activa' : '– Inactiva'}
    </span>
  );
}

export default EstadoBadge;