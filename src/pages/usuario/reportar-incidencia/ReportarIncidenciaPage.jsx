import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import Aviso from '../../../components/Avisos/Aviso.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import OpcionesIncidencia from './components/OpcionesIncidencia.jsx';
import { useUsuario } from '../context/UsuarioContext.jsx';
import { formatearFechaBogota } from '../../../utils/formatoMoneda.js';
import styles from './ReportarIncidenciaPage.module.css';

const TIPOS = [
  { valor: 'bicicleta', texto: 'Daño en bicicleta' },
  { valor: 'estacion', texto: 'Daño en estación' },
  { valor: 'nfc', texto: 'Tarjeta NFC perdida o dañada' },
  { valor: 'otro', texto: 'Otro' },
];

const BICICLETAS = ['BIC-001', 'BIC-002', 'BIC-003', 'BIC-004', 'BIC-005', 'BIC-014'];
const MAXIMO_DESCRIPCION = 500;

function ReportarIncidenciaPage() {
  const location = useLocation();
  const { estaciones, incidencias, reportarIncidencia } = useUsuario();

  const [tipo, setTipo] = useState(location.state?.bicicleta ? 'bicicleta' : 'bicicleta');
  const [bicicleta, setBicicleta] = useState(location.state?.bicicleta || '');
  const [estacion, setEstacion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState('');

  const limpiarFormulario = () => {
    setTipo('bicicleta');
    setBicicleta('');
    setEstacion('');
    setDescripcion('');
    setErrores({});
  };

  const validar = () => {
    const nuevosErrores = {};
    if (tipo === 'bicicleta' && !bicicleta) {
      nuevosErrores.bicicleta = 'Indique la bicicleta involucrada.';
    }
    if (tipo === 'estacion' && !estacion) {
      nuevosErrores.estacion = 'Indique la estación involucrada.';
    }
    if (tipo === 'otro' && !bicicleta && !estacion) {
      nuevosErrores.general = 'Indique la bicicleta o la estación involucrada.';
    }
    if (!descripcion.trim()) {
      nuevosErrores.descripcion = 'Hay campos obligatorios vacíos.';
    }
    return nuevosErrores;
  };

  const enviar = (evento) => {
    evento.preventDefault();
    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    try {
      const res = reportarIncidencia({
        tipo,
        bicicleta,
        estacion,
        descripcion,
      });
      setAviso(res.mensaje);
      limpiarFormulario();
    } catch (err) {
      setErrores({ general: err.message });
    }
  };

  return (
    <UsuarioLayout itemActivo="Reportar incidencia">
      <div className={styles.raiz}>
        <EncabezadoPagina
          etiqueta="Usuario / Soporte técnico / Notificación de novedades"
          titulo="Reportar Daño o Incidencia"
          subtitulo="Notifica averías mecánicas, problemas en anclajes o novedades con tu tarjeta para mantenimiento prioritario."
        />

        <Aviso mensaje={aviso} onCerrar={() => setAviso('')} />

        <form className={styles.formulario} onSubmit={enviar} noValidate>
          <section className={`tarjeta ${styles.seccion}`} aria-labelledby="seccion-tipo">
            <h2 id="seccion-tipo" className={styles.tituloSeccion}>
              1. Tipo de incidencia <span className={styles.requerido}>*</span>
            </h2>
            <OpcionesIncidencia opciones={TIPOS} valor={tipo} onCambiar={setTipo} />
          </section>

          <section className={`tarjeta ${styles.seccion}`} aria-labelledby="seccion-bicicleta">
            <h2 id="seccion-bicicleta" className={styles.tituloSeccion}>
              2. ID_BICICLETA{' '}
              {tipo === 'bicicleta' ? (
                <span className={styles.requerido}>*</span>
              ) : (
                <span className={styles.opcional}>(opcional)</span>
              )}
            </h2>
            <select
              id="incidencia-bicicleta"
              aria-label="ID_BICICLETA"
              className={`input ${styles.select}`}
              value={bicicleta}
              onChange={(e) => setBicicleta(e.target.value)}
              aria-invalid={Boolean(errores.bicicleta)}
            >
              <option value="">Seleccionar bicicleta</option>
              {BICICLETAS.map((codigo) => (
                <option key={codigo} value={codigo}>
                  {codigo}
                </option>
              ))}
            </select>
            <p className={styles.ayuda}>Obligatoria si reporta daño en bicicleta</p>
            {errores.bicicleta && <p className="mensaje-error" role="alert">{errores.bicicleta}</p>}
          </section>

          <section className={`tarjeta ${styles.seccion}`} aria-labelledby="seccion-estacion">
            <h2 id="seccion-estacion" className={styles.tituloSeccion}>
              3. ID_ESTACION{' '}
              {tipo === 'estacion' ? (
                <span className={styles.requerido}>*</span>
              ) : (
                <span className={styles.opcional}>(opcional)</span>
              )}
            </h2>
            <select
              id="incidencia-estacion"
              aria-label="ID_ESTACION"
              className={`input ${styles.select}`}
              value={estacion}
              onChange={(e) => setEstacion(e.target.value)}
              aria-invalid={Boolean(errores.estacion)}
            >
              <option value="">Seleccionar estación</option>
              {estaciones.map((item) => (
                <option key={item.id} value={item.nombre}>
                  {item.nombre}
                </option>
              ))}
            </select>
            <p className={styles.ayuda}>Obligatoria si reporta anclaje o estación</p>
            {errores.estacion && <p className="mensaje-error" role="alert">{errores.estacion}</p>}
            {errores.general && <p className="mensaje-error" role="alert">{errores.general}</p>}

            <p className={styles.nota}>
              NOTA REGLA DE NEGOCIO: SI SELECCIONA &quot;TARJETA NFC PERDIDA O DAÑADA&quot;, NO REQUIERE INDICAR BICICLETA
              NI ESTACIÓN. EN CASO CONTRARIO, DEBE INDICAR AL MENOS UNA DE LAS DOS.
            </p>
          </section>

          <section className={`tarjeta ${styles.seccion}`} aria-labelledby="seccion-descripcion">
            <div className={styles.cabeceraDescripcion}>
              <h2 id="seccion-descripcion" className={styles.tituloSeccion}>
                4. Descripción del Daño o Novedad <span className={styles.requerido}>*</span>
              </h2>
              <span className={styles.contador}>
                {descripcion.length} / {MAXIMO_DESCRIPCION}
              </span>
            </div>
            <textarea
              id="incidencia-descripcion"
              aria-label="Descripción"
              className={`input ${styles.textarea}`}
              rows={5}
              maxLength={MAXIMO_DESCRIPCION}
              placeholder="Describa el detalle de la avería encontrada (ej: freno flojo, pantalla apagada, etc.)..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              aria-invalid={Boolean(errores.descripcion)}
            />
            {errores.descripcion && <p className="mensaje-error" role="alert">{errores.descripcion}</p>}
          </section>

          <div className={styles.acciones}>
            <button type="button" className={`boton ${styles.boton}`} onClick={limpiarFormulario}>
              Limpiar formulario
            </button>
            <button type="submit" className={`boton boton--primario ${styles.boton}`}>
              Enviar reporte
            </button>
          </div>
        </form>

        {/* LISTADO DE INCIDENCIAS REPORTADAS PREVIAMENTE */}
        {incidencias && incidencias.length > 0 && (
          <section className="tarjeta" style={{ marginTop: 'var(--espacio-6)' }}>
            <h2 style={{ fontSize: 'var(--texto-l)', margin: '0 0 var(--espacio-3)' }}>
              Mis Reportes Registrados ({incidencias.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--espacio-3)' }}>
              {incidencias.map((inc) => (
                <div
                  key={inc.id}
                  className="tarjeta"
                  style={{
                    background: 'var(--color-input-fondo)',
                    border: '1px solid var(--color-borde)',
                    padding: 'var(--espacio-3)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: 'var(--texto-s)' }}>
                      {inc.tipo === 'bicicleta' ? '🚲 Daño en Bicicleta' : inc.tipo === 'estacion' ? '🏢 Daño en Estación' : '📶 Tarjeta NFC'} ({inc.recurso})
                    </span>
                    <span className="insignia insignia--activa" style={{ fontSize: 'var(--texto-xs)' }}>
                      {inc.estado}
                    </span>
                  </div>
                  <p style={{ margin: 'var(--espacio-2) 0 var(--espacio-1)', fontSize: 'var(--texto-s)' }}>
                    {inc.descripcion}
                  </p>
                  <span style={{ fontSize: 'var(--texto-xs)', opacity: 0.7 }}>
                    Registrado el {formatearFechaBogota(inc.fecha)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </UsuarioLayout>
  );
}

export default ReportarIncidenciaPage;
