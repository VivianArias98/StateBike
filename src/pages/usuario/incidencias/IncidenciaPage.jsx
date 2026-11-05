import { useState } from 'react';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import Aviso from '../../../components/Avisos/Aviso.jsx';
import { registrarIncidencia, TIPOS_INCIDENCIA, TIPO_NFC } from '../../../services/incidenciasService.js';
import styles from './IncidenciaPage.module.css';

const MAXIMO = 500;

const FORMULARIO_VACIO = { tipo: '', idBicicleta: '', idEstacion: '', descripcion: '' };

// Página Reportar incidencia: formulario con validaciones y registro en el servicio.
function IncidenciaPage() {
  const [datos, setDatos] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [radicado, setRadicado] = useState('');
  const [aviso, setAviso] = useState('');

  function cambiar(campo, valor) {
    setDatos((anterior) => ({ ...anterior, [campo]: valor }));
  }

  // Devuelve el mensaje de error del requisito, o '' si los datos son válidos
  function validar() {
    if (!datos.tipo || !datos.descripcion.trim()) return 'Hay campos obligatorios vacíos';
    const sinReferencia = !datos.idBicicleta.trim() && !datos.idEstacion.trim();
    if (datos.tipo !== TIPO_NFC && sinReferencia) return 'Indique la bicicleta o la estación involucrada';
    return '';
  }

  async function enviar() {
    const mensaje = validar();
    setError(mensaje);
    if (mensaje) return;

    setEnviando(true);
    try {
      const resultado = await registrarIncidencia({
        tipo: datos.tipo,
        idBicicleta: datos.idBicicleta.trim(),
        idEstacion: datos.idEstacion.trim(),
        descripcion: datos.descripcion.trim(),
      });
      setRadicado(resultado.incidencia.radicado);
      setAviso(resultado.mensaje);
      setDatos(FORMULARIO_VACIO);
    } catch {
      setError('No se pudo registrar la incidencia. Intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <UsuarioLayout itemActivo="Reportar Incidencia">
      <div className={styles.raiz}>
        <header className={styles.encabezado}>
          <h1 className={styles.titulo}>Reportar incidencia</h1>
          <p className={styles.subtitulo}>Cuéntanos qué ocurrió para que el equipo pueda revisarlo.</p>
        </header>

        {radicado && (
          <p className={styles.radicado} role="status">
            Tu incidencia quedó registrada con el número <strong>{radicado}</strong> y estado ABIERTA.
          </p>
        )}

        <section className={`tarjeta ${styles.formulario}`}>
          <div className="campo">
            <label htmlFor="incidencia-tipo">Tipo de incidencia *</label>
            <select id="incidencia-tipo" className="input" value={datos.tipo} onChange={(e) => cambiar('tipo', e.target.value)}>
              <option value="">Selecciona un tipo</option>
              {TIPOS_INCIDENCIA.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div className={styles.referencias}>
            <div className="campo">
              <label htmlFor="incidencia-bicicleta">Bicicleta involucrada</label>
              <input
                id="incidencia-bicicleta"
                className="input"
                maxLength={20}
                placeholder="Ej.: BIC-003"
                value={datos.idBicicleta}
                onChange={(e) => cambiar('idBicicleta', e.target.value)}
              />
            </div>
            <div className="campo">
              <label htmlFor="incidencia-estacion">Estación involucrada</label>
              <input
                id="incidencia-estacion"
                className="input"
                maxLength={30}
                placeholder="Ej.: Estación Centro"
                value={datos.idEstacion}
                onChange={(e) => cambiar('idEstacion', e.target.value)}
              />
            </div>
          </div>
          <p className={styles.nota}>
            Indica la bicicleta o la estación, salvo que el tipo sea tarjeta NFC perdida o dañada.
          </p>

          <div className="campo">
            <label htmlFor="incidencia-descripcion">Descripción *</label>
            <textarea
              id="incidencia-descripcion"
              className={`input ${styles.descripcion}`}
              maxLength={MAXIMO}
              value={datos.descripcion}
              onChange={(e) => cambiar('descripcion', e.target.value)}
            />
            <span className={styles.contador}>{datos.descripcion.length}/{MAXIMO}</span>
          </div>

          {error && (
            <p className="mensaje-error" role="alert">
              {error}
            </p>
          )}

          <div className={styles.acciones}>
            <button type="button" className="boton boton--secundario" onClick={enviar} disabled={enviando}>
              {enviando ? 'Enviando…' : 'ENVIAR REPORTE'}
            </button>
          </div>
        </section>
      </div>
      <Aviso mensaje={aviso} onCerrar={() => setAviso('')} />
    </UsuarioLayout>
  );
}

export default IncidenciaPage;
