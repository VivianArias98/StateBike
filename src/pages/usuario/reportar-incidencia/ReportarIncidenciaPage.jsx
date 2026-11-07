import { useState } from 'react';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import Aviso from '../../../components/Avisos/Aviso.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import { ESTACIONES } from '../datos.js';
import OpcionesIncidencia from './components/OpcionesIncidencia.jsx';
import styles from './ReportarIncidenciaPage.module.css';

// Datos de ejemplo (solo maquetación). Después llegarán del backend.
const TIPOS = [
  { valor: 'bicicleta', texto: 'Daño en bicicleta' },
  { valor: 'estacion', texto: 'Daño en estación' },
  { valor: 'nfc', texto: 'Tarjeta NFC perdida o dañada' },
  { valor: 'otro', texto: 'Otro' },
];

const BICICLETAS = ['BIC-002', 'BIC-003', 'BIC-014'];
const MAXIMO_DESCRIPCION = 500;

// Reporte de daños o novedades. Reglas: con "Tarjeta NFC" no hace falta bicicleta ni estación;
// con "Daño en bicicleta" es obligatoria la bicicleta; con "Daño en estación", la estación;
// con "Otro" hay que indicar al menos una de las dos.
function ReportarIncidenciaPage() {
  const [tipo, setTipo] = useState('bicicleta');
  const [bicicleta, setBicicleta] = useState('');
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
      nuevosErrores.bicicleta = 'Seleccione la bicicleta afectada.';
    }
    if (tipo === 'estacion' && !estacion) {
      nuevosErrores.estacion = 'Seleccione la estación afectada.';
    }
    if (tipo === 'otro' && !bicicleta && !estacion) {
      nuevosErrores.general = 'Indique al menos la bicicleta o la estación.';
    }
    if (!descripcion.trim()) {
      nuevosErrores.descripcion = 'Describa el detalle de la novedad encontrada.';
    }
    return nuevosErrores;
  };

  const enviar = (evento) => {
    evento.preventDefault();
    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    // Pendiente: enviar el reporte al backend
    setAviso('Reporte enviado');
    limpiarFormulario();
  };

  return (
    <UsuarioLayout itemActivo="Reportar incidencia">
      <div className={styles.raiz}>
        <EncabezadoPagina
          titulo="Reportar daño o incidencia"
          subtitulo="Complete los datos para registrar la novedad en el sistema."
        />

        <form className={styles.formulario} onSubmit={enviar} noValidate>
          <section className={`tarjeta ${styles.seccion}`} aria-labelledby="seccion-tipo">
            <h2 id="seccion-tipo" className={styles.tituloSeccion}>
              1. Tipo de incidencia <span className={styles.requerido}>*</span>
            </h2>
            <OpcionesIncidencia opciones={TIPOS} valor={tipo} onCambiar={setTipo} />
          </section>

          <section className={`tarjeta ${styles.seccion}`} aria-labelledby="seccion-bicicleta">
            <h2 id="seccion-bicicleta" className={styles.tituloSeccion}>
              2. ID_BICICLETA <span className={styles.opcional}>(opcional)</span>
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
            <p className={styles.ayuda}>Obligatoria si reporta bicicleta</p>
            {errores.bicicleta && <p className="mensaje-error" role="alert">{errores.bicicleta}</p>}
          </section>

          <section className={`tarjeta ${styles.seccion}`} aria-labelledby="seccion-estacion">
            <h2 id="seccion-estacion" className={styles.tituloSeccion}>
              3. ID_ESTACION <span className={styles.opcional}>(opcional)</span>
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
              {ESTACIONES.map((item) => (
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
                4. Descripción <span className={styles.requerido}>*</span>
              </h2>
              <span className={styles.contador}>
                {descripcion.length} / {MAXIMO_DESCRIPCION}
              </span>
            </div>
            <textarea
              id="incidencia-descripcion"
              aria-label="Descripción"
              className={`input ${styles.textarea}`}
              rows={6}
              maxLength={MAXIMO_DESCRIPCION}
              placeholder="Describa el detalle de la avería o novedad encontrada..."
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
            <button type="submit" className={`boton boton--secundario ${styles.boton}`}>
              Enviar reporte
            </button>
          </div>
        </form>
      </div>

      <Aviso mensaje={aviso} onCerrar={() => setAviso('')} />
    </UsuarioLayout>
  );
}

export default ReportarIncidenciaPage;
