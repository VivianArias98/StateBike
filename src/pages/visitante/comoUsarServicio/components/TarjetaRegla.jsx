import { Icono } from '../../components/IconosVisitante.jsx';
import styles from './TarjetaRegla.module.css';

// Tarjeta de "Reglas importantes y condiciones de operación".
// tono: 'oscuro' (chip negro), 'verde' (chip verde claro) o 'alerta' (chip rojo claro).
function TarjetaRegla({ numero, etiqueta, titulo, texto, dato, icono, tono = 'verde' }) {
  const claseChip = {
    oscuro: styles.chipOscuro,
    verde: styles.chipVerde,
    alerta: styles.chipAlerta,
  }[tono];

  return (
    <article className={`tarjeta ${styles.raiz}`}>
      <div className={styles.cabecera}>
        <span className={`insignia ${claseChip}`}>{etiqueta}</span>
        <span className={`${styles.icono} ${tono === 'alerta' ? styles.iconoAlerta : ''}`} aria-hidden="true">
          <Icono nombre={icono} />
        </span>
      </div>

      <span className={styles.codigo}>[ {numero} ]</span>

      <h3 className={styles.titulo}>{titulo}</h3>
      <p className={styles.texto}>{texto}</p>

      <p className={`${styles.dato} ${tono === 'alerta' ? styles.datoAlerta : ''}`}>{dato}</p>
    </article>
  );
}

export default TarjetaRegla;
