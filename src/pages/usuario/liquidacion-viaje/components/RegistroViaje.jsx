import { IconoBicicleta } from '../../../../components/Iconos/Iconos.jsx';
import styles from './RegistroViaje.module.css';

// Tarjeta "Resumen del viaje": filas de datos y diagrama de telemetría.
function RegistroViaje({ viaje }) {
  const filas = [
    { etiqueta: 'ESTACIÓN ORIGEN', valor: viaje.origen.estacion, nota: `[Hora: ${viaje.origen.hora}]` },
    { etiqueta: 'ESTACIÓN DESTINO', valor: viaje.destino.estacion, nota: `[Bloqueo: ${viaje.destino.hora}]` },
    { etiqueta: 'IDENTIFICADOR DE BICICLETA', valor: viaje.bicicleta, chip: `ESTADO: ${viaje.estadoBicicleta}`, tipo: 'verde' },
    { etiqueta: 'ANCLAJE DE DESTINO', valor: viaje.anclajeDestino, chip: `ESTADO: ${viaje.estadoAnclaje}`, tipo: 'oscuro' },
  ];

  return (
    <section className={`tarjeta ${styles.raiz}`} aria-labelledby="titulo-registro">
      <header className={styles.cabecera}>
        <h2 id="titulo-registro" className={styles.titulo}>
          <span className={styles.punto} aria-hidden="true" />
          RESUMEN DEL VIAJE
        </h2>
        <span className={styles.seccion}>SEC_01 // TELEMETRÍA_REGISTRO</span>
      </header>

      <dl className={styles.lista}>
        {filas.map((fila) => (
          <div key={fila.etiqueta} className={styles.fila}>
            <dt className={styles.etiqueta}>{fila.etiqueta}</dt>
            <dd className={styles.valor}>
              {fila.nota ? (
                <>
                  <span>{fila.valor}</span>
                  <span className={styles.nota}>{fila.nota}</span>
                </>
              ) : (
                <>
                  <span className={styles.valorTexto}>{fila.valor}</span>
                  <span className={fila.tipo === 'oscuro' ? styles.chipOscuro : styles.chipVerde}>{fila.chip}</span>
                </>
              )}
            </dd>
          </div>
        ))}

        <div className={styles.fila}>
          <dt className={styles.etiqueta}>
            DURACIÓN TOTAL DEL VIAJE
            <span className={styles.subetiqueta}>Medición por microcontrolador de anclaje</span>
          </dt>
          <dd className={styles.duracion}>
            {viaje.duracionMin}
            <span className={styles.unidad}>min</span>
          </dd>
        </div>

        <div className={styles.fila}>
          <dt className={styles.etiqueta}>
            TIEMPO INCLUIDO POR PLAN
            <span className={styles.subetiqueta}>({viaje.plan})</span>
          </dt>
          <dd className={styles.valorTexto}>{viaje.incluidoMin} min</dd>
        </div>

        <div className={styles.fila}>
          <dt className={styles.etiqueta}>MINUTOS DE EXCESO COMPUTADOS</dt>
          <dd className={styles.valor}>
            <span className={styles.valorTexto}>{viaje.excesoMin} min</span>
            <span className={styles.exito}>(Dentro del tiempo incluido)</span>
          </dd>
        </div>

        <div className={styles.fila}>
          <dt className={styles.etiqueta}>TARJETA NFC UTILIZADA</dt>
          <dd className={styles.valor}>
            <span className={styles.chipBorde}>{viaje.tarjeta}</span>
          </dd>
        </div>
      </dl>

      <div className={styles.telemetria}>
        <p className={styles.etiqueta}>DIAGRAMA DE TELEMETRÍA</p>
        <div className={styles.diagrama}>
          <div className={styles.extremo}>
            <span className={styles.mono}>T_ORIGEN ({viaje.origen.hora})</span>
            <span className={styles.subetiqueta}>[DESANCLAJE]</span>
          </div>

          <div className={styles.linea} aria-hidden="true">
            <span className={styles.pastilla}>
              <IconoBicicleta />
              {viaje.duracionMin} MIN
            </span>
          </div>

          <div className={`${styles.extremo} ${styles.extremoDerecha}`}>
            <span className={styles.mono}>T_DESTINO ({viaje.destino.hora})</span>
            <span className={styles.exito}>[REANCLAJE OK]</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegistroViaje;
