import Etiqueta from '../../../../components/Etiqueta/Etiqueta.jsx';
import BarraProgreso from '../../../../components/BarraProgreso/BarraProgreso.jsx';
import styles from './TiempoTranscurrido.module.css';

// Cronómetro del viaje con el progreso del tiempo incluido en el plan.
// tiempo y restante llegan formateados como "mm:ss".
function TiempoTranscurrido({
  tiempo,
  plan,
  minutosIncluidos,
  segundosTranscurridos,
  restante,
  porcentajeUsado,
}) {
  const [minutos, segundos] = tiempo.split(':');

  return (
    <section className={`tarjeta ${styles.raiz}`} aria-labelledby="titulo-tiempo">
      <header className={styles.cabecera}>
        <h2 id="titulo-tiempo" className={styles.titulo}>
          TIEMPO TRANSCURRIDO
        </h2>
        <Etiqueta texto="Cronómetro en vivo" color="menta" conPunto />
      </header>

      <p className={styles.tiempo} role="timer">
        {minutos}
        <span className={styles.separador}>:</span>
        {segundos}
      </p>

      <p className={styles.plan}>
        {plan} · <strong>{minutosIncluidos} min</strong> incluidos por viaje
      </p>

      <BarraProgreso
        valor={segundosTranscurridos}
        maximo={minutosIncluidos * 60}
        etiqueta="Tiempo incluido utilizado"
      />

      <div className={styles.resumen}>
        <p className={styles.restante}>
          <span>Tiempo restante:</span>
          <strong>{restante}</strong>
        </p>
        <p className={styles.uso}>{porcentajeUsado}% del tiempo incluido utilizado</p>
      </div>
    </section>
  );
}

export default TiempoTranscurrido;