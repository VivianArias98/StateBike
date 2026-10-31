// Insignia de estado de una estación (estilos en las clases globales "insignia")
function EstadoBadge({ estado }) {
  const activa = estado === 'ACTIVE';

  return (
    <span className={activa ? 'insignia insignia--activa' : 'insignia insignia--inactiva'}>
      {activa ? '✓ Activa' : '– Inactiva'}
    </span>
  );
}

export default EstadoBadge;
