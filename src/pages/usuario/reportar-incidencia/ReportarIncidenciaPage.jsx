import React, { useState } from 'react';
import styles from './ReportarIncidenciaPage.module.css';

function ReportarIncidenciaPage() {
  const [tipoIncidencia, setTipoIncidencia] = useState('bici');
  const [descripcion, setDescripcion] = useState('');

  return (
    <div className={styles.raiz}>
      <div className={styles.encabezadoSeccion}>
        <h1 className={styles.titulo}>Reportar daño o incidencia</h1>
        <p className={styles.subtitulo}>Complete los datos para registrar la novedad en el sistema.</p>
      </div>

      <form className={styles.formularioGrid} onSubmit={(e) => e.preventDefault()}>
        {/* BLOQUE 1: TIPO DE INCIDENCIA */}
        <div className={`tarjeta ${styles.bloqueTarjeta}`}>
          <label className={styles.labelBloque}>1. TIPO DE INCIDENCIA *</label>
          <div className={styles.radioGrid}>
            <label className={`${styles.cardRadio} ${tipoIncidencia === 'bici' ? styles.cardRadioActiva : ''}`}>
              <input
                type="radio"
                name="tipo"
                checked={tipoIncidencia === 'bici'}
                onChange={() => setTipoIncidencia('bici')}
              />
              Daño en bicicleta
            </label>

            <label className={`${styles.cardRadio} ${tipoIncidencia === 'estacion' ? styles.cardRadioActiva : ''}`}>
              <input
                type="radio"
                name="tipo"
                checked={tipoIncidencia === 'estacion'}
                onChange={() => setTipoIncidencia('estacion')}
              />
              Daño en estación
            </label>

            <label className={`${styles.cardRadio} ${tipoIncidencia === 'nfc' ? styles.cardRadioActiva : ''}`}>
              <input
                type="radio"
                name="tipo"
                checked={tipoIncidencia === 'nfc'}
                onChange={() => setTipoIncidencia('nfc')}
              />
              Tarjeta NFC perdida o dañada
            </label>

            <label className={`${styles.cardRadio} ${tipoIncidencia === 'otro' ? styles.cardRadioActiva : ''}`}>
              <input
                type="radio"
                name="tipo"
                checked={tipoIncidencia === 'otro'}
                onChange={() => setTipoIncidencia('otro')}
              />
              Otro
            </label>
          </div>
        </div>

        {/* BLOQUE 2: ID BICICLETA */}
        <div className={`tarjeta ${styles.bloqueTarjeta}`}>
          <label className={styles.labelBloque}>2. ID_BICICLETA (OPCIONAL)</label>
          <div className="campo">
            <select className="input">
              <option value="">Seleccionar bicicleta</option>
              <option value="BIC-003">BIC-003</option>
              <option value="BIC-014">BIC-014</option>
            </select>
          </div>
          <small className={styles.textoAyuda}>Obligatoria si reporta bicicleta</small>
        </div>

        {/* BLOQUE 3: ID ESTACIÓN */}
        <div className={`tarjeta ${styles.bloqueTarjeta}`}>
          <label className={styles.labelBloque}>3. ID_ESTACION (OPCIONAL)</label>
          <div className="campo">
            <select className="input">
              <option value="">Seleccionar estación</option>
              <option value="centro">Estación Centro</option>
              <option value="uniboyaca">Universidad de Boyacá</option>
            </select>
          </div>
          <small className={styles.textoAyuda}>Obligatoria si reporta anclaje o estación</small>

          <div className={styles.boxReglaNegocio}>
            NOTA REGLA DE NEGOCIO: SI SELECCIONA "TARJETA NFC PERDIDA O DAÑADA", NO REQUIERE INDICAR BICICLETA NI ESTACIÓN. EN CASO CONTRARIO, DEBE INDICAR AL MENOS UNA DE LAS DOS.
          </div>
        </div>

        {/* BLOQUE 4: DESCRIPCIÓN */}
        <div className={`tarjeta ${styles.bloqueTarjeta}`}>
          <div className={styles.headerDescripcion}>
            <label className={styles.labelBloque}>4. DESCRIPCIÓN *</label>
            <span className={styles.contadorCaracteres}>{descripcion.length} / 500</span>
          </div>
          <div className="campo">
            <textarea
              className="input"
              rows={4}
              maxLength={500}
              placeholder="Describa el detalle de la avería o novedad encontrada..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className={styles.accionesFormulario}>
          <button type="button" className="boton boton--secundario" onClick={() => setDescripcion('')}>
            LIMPIAR FORMULARIO
          </button>
          <button type="submit" className="boton boton--primario">
            ENVIAR REPORTE
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReportarIncidenciaPage;