import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
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

const CHIPS_BICICLETA = [
  'Cadena suelta / rota',
  'Frenos no responden',
  'Llanta pinchada / sin aire',
  'Pedal roto o trabado',
  'Manubrio / Dirección torcida',
  'Cambios no pasan',
  'Sillín suelto / dañado',
  'Otro daño mecánico',
];

const CHIPS_ESTACION = [
  'Anclaje no libera bicicleta',
  'Anclaje no traba al devolver',
  'Tótem apagado / sin energía',
  'Lector NFC no lee la tarjeta',
  'Estructura física dañada',
  'Pantalla táctil no responde',
];

const CHIPS_NFC = [
  'Extravío o pérdida física',
  'Tarjeta rota o fisurada',
  'Lector NFC de anclaje no la reconoce',
  'Desmagnetizada / no responde',
];

const CHIPS_OTRO = [
  'Falla técnica del sistema',
  'Incidencia en la vía pública',
  'Novedad de infraestructura vial',
  'Sugerencia de mantenimiento',
];

const MAXIMO_DESCRIPCION = 500;

function ReportarIncidenciaPage() {
  const location = useLocation();
  const { estaciones, incidencias, reportarIncidencia, bicicletas, perfil } = useUsuario();

  const [tipo, setTipo] = useState(location.state?.bicicleta ? 'bicicleta' : 'bicicleta');
  const [bicicleta, setBicicleta] = useState(location.state?.bicicleta || '');
  const [estacion, setEstacion] = useState('');
  const [puntoAnclaje, setPuntoAnclaje] = useState('');
  const [fallaSeleccionada, setFallaSeleccionada] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState('');

  // Bicicletas reales cargadas del backend, complementadas con la bicicleta seleccionada si existe
  const listaBicicletas = (() => {
    const base = bicicletas && bicicletas.length > 0
      ? [...bicicletas]
      : [
          { codigo: 'BIC-001' },
          { codigo: 'BIC-002' },
          { codigo: 'BIC-003' },
          { codigo: 'BIC-004' },
          { codigo: 'BIC-005' },
          { codigo: 'BIC-014' },
          { codigo: 'BIC-01' },
          { codigo: 'BIC-17' },
          { codigo: 'BIC-TEST' },
        ];
    if (bicicleta && !base.some((b) => b.codigo === bicicleta)) {
      base.unshift({ codigo: bicicleta });
    }
    return base;
  })();

  const cambiarTipo = (nuevoTipo) => {
    setTipo(nuevoTipo);
    setFallaSeleccionada('');
    setErrores({});
  };

  const seleccionarChip = (chip) => {
    setFallaSeleccionada((ant) => (ant === chip ? '' : chip));
  };

  const limpiarFormulario = () => {
    setBicicleta('');
    setEstacion('');
    setPuntoAnclaje('');
    setFallaSeleccionada('');
    setDescripcion('');
    setErrores({});
  };

  const validar = () => {
    const nuevosErrores = {};
    if (tipo === 'bicicleta') {
      if (!bicicleta) nuevosErrores.bicicleta = 'Indique la bicicleta involucrada.';
    } else if (tipo === 'estacion') {
      if (!estacion) nuevosErrores.estacion = 'Indique la estación involucrada.';
    }
    // Para 'nfc' y 'otro' no se requiere bicicleta ni estación

    if (!descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción de la novedad o incidencia es obligatoria.';
    }
    return nuevosErrores;
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    // Enriquecer la descripción con el chip de avería o el anclaje si el usuario los seleccionó
    let descripcionFinal = descripcion.trim();
    if (fallaSeleccionada && !descripcionFinal.includes(fallaSeleccionada)) {
      descripcionFinal = `[${fallaSeleccionada}] ${descripcionFinal}`;
    }
    if (tipo === 'estacion' && puntoAnclaje.trim() && !descripcionFinal.includes(puntoAnclaje.trim())) {
      descripcionFinal = `[Anclaje: ${puntoAnclaje.trim()}] ${descripcionFinal}`;
    }

    try {
      const res = await reportarIncidencia({
        tipo,
        bicicleta: tipo === 'bicicleta' ? bicicleta : undefined,
        estacion: tipo === 'estacion' || (tipo === 'bicicleta' && estacion) ? estacion : undefined,
        descripcion: descripcionFinal,
      });
      setAviso(res?.mensaje || 'REPORTE ENVIADO CON ÉXITO');
      limpiarFormulario();
    } catch (err) {
      setErrores({ general: err.message });
    }
  };

  const placeholderDescripcion =
    tipo === 'bicicleta'
      ? 'Detalla la avería mecánica observada en la bicicleta (ej: cadena suelta, freno flojo, ruido anormal al pedalear)...'
      : tipo === 'estacion'
        ? 'Describe la falla técnica en la estación o anclaje (ej: el anclaje 3 no bloquea la bicicleta al encajarla)...'
        : tipo === 'nfc'
          ? 'Describe las circunstancias de la pérdida o la falla técnica con tu tarjeta NFC...'
          : 'Describe detalladamente la novedad, eventualidad o sugerencia que deseas comunicar...';

  return (
    <UsuarioLayout itemActivo="Reportar incidencia">
      <div className={styles.raiz}>
        <EncabezadoPagina
          etiqueta="Usuario / Soporte técnico / Notificación de novedades"
          titulo="Reportar Daño o Incidencia"
          subtitulo="Notifica averías mecánicas, problemas en anclajes o novedades con tu tarjeta para mantenimiento prioritario."
        />

        {aviso && (
          <div
            role="status"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--espacio-3)',
              padding: 'var(--espacio-3) var(--espacio-4)',
              background: 'var(--color-acento-suave)',
              color: 'var(--color-exito)',
              border: '1px solid var(--color-exito)',
              borderRadius: 'var(--radio-m)',
              fontSize: 'var(--texto-s)',
              fontWeight: 600,
              marginBottom: 'var(--espacio-4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--espacio-2)' }}>
              <span>✓</span>
              <span>{aviso}</span>
            </div>
            <button
              type="button"
              onClick={() => setAviso('')}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                fontSize: '1.25rem',
                lineHeight: 1,
                cursor: 'pointer',
                padding: '0 4px',
              }}
              aria-label="Cerrar aviso"
            >
              ×
            </button>
          </div>
        )}

        <Aviso mensaje={aviso} onCerrar={() => setAviso('')} />

        <form className={styles.formulario} onSubmit={enviar} noValidate>
          {/* PASO 1: SELECCIÓN DEL TIPO */}
          <section className={`tarjeta ${styles.seccion}`} aria-labelledby="seccion-tipo">
            <h2 id="seccion-tipo" className={styles.tituloSeccion}>
              1. Tipo de novedad o incidencia <span className={styles.requerido}>*</span>
            </h2>
            <OpcionesIncidencia
              opciones={TIPOS}
              valor={tipo}
              onCambiar={cambiarTipo}
            />
          </section>

          {/* PASO 2 ESPECÍFICO SEGÚN EL TIPO SELECCIONADO */}
          {tipo === 'bicicleta' && (
            <section className={`tarjeta ${styles.seccion}`} aria-labelledby="seccion-bici-datos">
              <h2 id="seccion-bici-datos" className={styles.tituloSeccion}>
                2. Bicicleta con avería mecánica <span className={styles.requerido}>*</span>
              </h2>

              <div className="campo">
                <label htmlFor="incidencia-bicicleta" className={styles.etiquetaChips}>
                  Selecciona la bicicleta involucrada <span className={styles.requerido}>*</span>:
                </label>
                <select
                  id="incidencia-bicicleta"
                  aria-label="Bicicleta involucrada"
                  className={`input ${styles.select}`}
                  value={bicicleta}
                  onChange={(e) => {
                    setErrores((ant) => ({ ...ant, bicicleta: undefined, general: undefined }));
                    setBicicleta(e.target.value);
                  }}
                  aria-invalid={Boolean(errores.bicicleta)}
                >
                  <option value="">-- Seleccionar bicicleta del sistema --</option>
                  {listaBicicletas.map((item) => {
                    const codigo = typeof item === 'string' ? item : item.codigo;
                    const detalle = item.estacion
                      ? ` — En Estación ${item.estacion}`
                      : item.estado === 'EN_USO'
                        ? ' — Actualmente en uso'
                        : '';
                    return (
                      <option key={codigo} value={codigo}>
                        {codigo}{detalle}
                      </option>
                    );
                  })}
                </select>
                {errores.bicicleta && <p className="mensaje-error" role="alert">{errores.bicicleta}</p>}
              </div>

              <div className="campo">
                <label htmlFor="incidencia-bici-estacion" className={styles.etiquetaChips}>
                  Estación o punto de ubicación <span className={styles.opcional}>(opcional)</span>:
                </label>
                <select
                  id="incidencia-bici-estacion"
                  className={`input ${styles.select}`}
                  value={estacion}
                  onChange={(e) => setEstacion(e.target.value)}
                >
                  <option value="">-- ¿Dónde se encuentra la bicicleta? (Opcional) --</option>
                  {estaciones.map((item) => (
                    <option key={item.id} value={item.nombre}>
                      {item.nombre}
                    </option>
                  ))}
                </select>
                <p className={styles.ayuda}>Si la bicicleta quedó en una estación específica de Tunja, indícala para facilitar su recolección técnica.</p>
              </div>

              <div className={styles.chipsContenedor}>
                <span className={styles.etiquetaChips}>Componente averiado (selección rápida):</span>
                <div className={styles.chips}>
                  {CHIPS_BICICLETA.map((chip) => {
                    const activo = fallaSeleccionada === chip;
                    return (
                      <button
                        key={chip}
                        type="button"
                        className={`${styles.chip} ${activo ? styles.chipActivo : ''}`}
                        onClick={() => seleccionarChip(chip)}
                      >
                        {activo ? '✓ ' : '+ '}
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {tipo === 'estacion' && (
            <section className={`tarjeta ${styles.seccion}`} aria-labelledby="seccion-estacion-datos">
              <h2 id="seccion-estacion-datos" className={styles.tituloSeccion}>
                2. Estación y punto de anclaje <span className={styles.requerido}>*</span>
              </h2>

              <div className="campo">
                <label htmlFor="incidencia-estacion" className={styles.etiquetaChips}>
                  Selecciona la estación donde ocurre la falla <span className={styles.requerido}>*</span>:
                </label>
                <select
                  id="incidencia-estacion"
                  aria-label="Estación afectada"
                  className={`input ${styles.select}`}
                  value={estacion}
                  onChange={(e) => {
                    setErrores((ant) => ({ ...ant, estacion: undefined, general: undefined }));
                    setEstacion(e.target.value);
                  }}
                  aria-invalid={Boolean(errores.estacion)}
                >
                  <option value="">-- Seleccionar estación activa --</option>
                  {estaciones.map((item) => (
                    <option key={item.id} value={item.nombre}>
                      {item.nombre} ({item.direccion || 'Tunja'})
                    </option>
                  ))}
                </select>
                {errores.estacion && <p className="mensaje-error" role="alert">{errores.estacion}</p>}
              </div>

              <div className="campo">
                <label htmlFor="incidencia-anclaje" className={styles.etiquetaChips}>
                  Número o código de anclaje <span className={styles.opcional}>(opcional)</span>:
                </label>
                <input
                  id="incidencia-anclaje"
                  type="text"
                  className="input"
                  placeholder="Ej: Anclaje 04 o ANC-092-02..."
                  value={puntoAnclaje}
                  onChange={(e) => setPuntoAnclaje(e.target.value)}
                />
                <p className={styles.ayuda}>Si la avería ocurre en un anclaje específico, anota su número visible para mantenimiento.</p>
              </div>

              <div className={styles.chipsContenedor}>
                <span className={styles.etiquetaChips}>Falla detectada en la estación (selección rápida):</span>
                <div className={styles.chips}>
                  {CHIPS_ESTACION.map((chip) => {
                    const activo = fallaSeleccionada === chip;
                    return (
                      <button
                        key={chip}
                        type="button"
                        className={`${styles.chip} ${activo ? styles.chipActivo : ''}`}
                        onClick={() => seleccionarChip(chip)}
                      >
                        {activo ? '✓ ' : '+ '}
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {tipo === 'nfc' && (
            <section className={`tarjeta ${styles.seccion}`} aria-labelledby="seccion-nfc-datos">
              <h2 id="seccion-nfc-datos" className={styles.tituloSeccion}>
                2. Novedad con Tarjeta NFC
              </h2>

              <div className={styles.tarjetaNfcInfo}>
                <div className={styles.datosNfc}>
                  <span className={styles.tituloNfc}>
                    Titular: {perfil?.nombreCompleto || 'Usuario'}
                  </span>
                  <span style={{ fontSize: 'var(--texto-xs)', opacity: 0.8 }}>
                    Tarjeta asignada: {perfil?.tarjeta?.ultimosDigitos ? `•••• •••• •••• ${perfil.tarjeta.ultimosDigitos}` : 'Sin tarjeta física vinculada'}
                  </span>
                </div>
                <span className={`insignia ${perfil?.tarjeta?.estado === 'ACTIVA' ? 'insignia--activa' : 'insignia--inactiva'}`}>
                  {perfil?.tarjeta?.estado || 'SIN TARJETA'}
                </span>
              </div>

              <div className={styles.avisoSeguridad}>
                <span className={styles.iconoInfo} aria-hidden="true">ℹ️</span>
                <div>
                  <strong>Recomendación institucional de seguridad:</strong> Si perdiste o extraviaste tu tarjeta NFC, puedes bloquearla inmediatamente desde <Link to="/perfil" className="enlace" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>tu perfil</Link> para proteger tu saldo mientras se tramita la reposición en taquilla.
                </div>
              </div>

              <div className={styles.chipsContenedor}>
                <span className={styles.etiquetaChips}>Motivo principal del reporte (selección rápida):</span>
                <div className={styles.chips}>
                  {CHIPS_NFC.map((chip) => {
                    const activo = fallaSeleccionada === chip;
                    return (
                      <button
                        key={chip}
                        type="button"
                        className={`${styles.chip} ${activo ? styles.chipActivo : ''}`}
                        onClick={() => seleccionarChip(chip)}
                      >
                        {activo ? '✓ ' : '+ '}
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* PASO SIGUIENTE: DESCRIPCIÓN CONTEXTUAL */}
          <section className={`tarjeta ${styles.seccion}`} aria-labelledby="seccion-descripcion">
            <div className={styles.cabeceraDescripcion}>
              <h2 id="seccion-descripcion" className={styles.tituloSeccion}>
                {tipo === 'otro' ? '2. Detalle de la Novedad o Incidencia' : '3. Detalle de la Novedad o Daño'} <span className={styles.requerido}>*</span>
              </h2>
              <span className={styles.contador}>
                {descripcion.length} / {MAXIMO_DESCRIPCION}
              </span>
            </div>

            {tipo === 'otro' && (
              <p className={styles.ayuda}>
                Puedes redactar libremente lo que consideres sobre el servicio, la plataforma o cualquier novedad. No requieres asociar una estación ni bicicleta.
              </p>
            )}

            {tipo === 'otro' && (
              <div className={styles.chipsContenedor}>
                <span className={styles.etiquetaChips}>Tema o categoría orientativa (opcional):</span>
                <div className={styles.chips}>
                  {CHIPS_OTRO.map((chip) => {
                    const activo = fallaSeleccionada === chip;
                    return (
                      <button
                        key={chip}
                        type="button"
                        className={`${styles.chip} ${activo ? styles.chipActivo : ''}`}
                        onClick={() => seleccionarChip(chip)}
                      >
                        {activo ? '✓ ' : '+ '}
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {fallaSeleccionada && tipo !== 'otro' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--espacio-2)', fontSize: 'var(--texto-xs)' }}>
                <span style={{ opacity: 0.7 }}>Avería indicada:</span>
                <span className="insignia insignia--activa" style={{ fontSize: 'var(--texto-xs)' }}>
                  {fallaSeleccionada}
                </span>
              </div>
            )}

            <textarea
              id="incidencia-descripcion"
              aria-label="Descripción del daño o novedad"
              className={`input ${styles.textarea}`}
              rows={4}
              maxLength={MAXIMO_DESCRIPCION}
              placeholder={placeholderDescripcion}
              value={descripcion}
              onChange={(e) => {
                setErrores((ant) => ({ ...ant, descripcion: undefined, general: undefined }));
                setDescripcion(e.target.value);
              }}
              aria-invalid={Boolean(errores.descripcion)}
            />
            {errores.descripcion && <p className="mensaje-error" role="alert">{errores.descripcion}</p>}
            {errores.general && <p className="mensaje-error" role="alert">{errores.general}</p>}
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
              {incidencias.map((inc) => {
                const tipoNormal = String(inc.tipo || '').toUpperCase();
                const recursoTexto =
                  inc.codigoBicicleta ||
                  inc.nombreEstacion ||
                  inc.recurso ||
                  (tipoNormal === 'TARJETA' ? 'Tarjeta NFC' : 'Novedad general');
                const etiquetaTipo =
                  tipoNormal === 'BICICLETA'
                    ? '🚲 Daño en Bicicleta'
                    : tipoNormal === 'ANCLAJE' || tipoNormal === 'ESTACION'
                      ? '🏢 Daño en Estación'
                      : tipoNormal === 'TARJETA'
                        ? '📶 Tarjeta NFC'
                        : '📋 Otro';

                return (
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
                        {etiquetaTipo} ({recursoTexto})
                      </span>
                      <span className="insignia insignia--activa" style={{ fontSize: 'var(--texto-xs)' }}>
                        {inc.estado}
                      </span>
                    </div>
                    <p style={{ margin: 'var(--espacio-2) 0 var(--espacio-1)', fontSize: 'var(--texto-s)' }}>
                      {inc.descripcion}
                    </p>
                    <span style={{ fontSize: 'var(--texto-xs)', opacity: 0.7 }}>
                      Registrado el {formatearFechaBogota(inc.fechaCreacion || inc.fecha)}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </UsuarioLayout>
  );
}

export default ReportarIncidenciaPage;
