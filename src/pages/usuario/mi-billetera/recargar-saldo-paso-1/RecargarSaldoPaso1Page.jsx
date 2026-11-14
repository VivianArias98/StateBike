import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UsuarioLayout from '../../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import { IconoCheck, IconoFlecha } from '../../../../components/Iconos/Iconos.jsx';
import { formatearPesos } from '../../formato.js';
import { useUsuario } from '../../context/UsuarioContext.jsx';
import styles from './RecargarSaldoPaso1Page.module.css';

const RECARGA_MINIMA = 100;
const RECARGA_MAXIMA = 500000;
const SALDO_MAXIMO = 2000000;

const SUGERIDOS = [
  { valor: 10000, detalle: 'Recarga básica' },
  { valor: 20000, detalle: 'Frecuente' },
  { valor: 32000, detalle: '(plan mensual)' },
  { valor: 50000, detalle: 'Larga duración' },
];

function validarMonto(texto, saldo) {
  if (!/^\d+$/.test(texto)) return 'Monto inválido';
  const monto = Number(texto);
  if (monto < RECARGA_MINIMA || monto > RECARGA_MAXIMA) return 'El monto debe estar entre $100 y $500.000';
  if (saldo + monto > SALDO_MAXIMO) return 'La recarga supera el saldo máximo permitido de $2.000.000';
  return '';
}

function RecargarSaldoPaso1Page() {
  const navegar = useNavigate();
  const { billetera, recargarSaldo } = useUsuario();
  const [texto, setTexto] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const saldo = billetera?.saldo ?? 0;
  const cupoDisponible = Math.max(0, SALDO_MAXIMO - saldo);

  const recargar = async (evento) => {
    evento.preventDefault();
    const errorValidacion = validarMonto(texto, saldo);
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setEnviando(true);
    setError('');
    try {
      const res = await recargarSaldo(Number(texto));
      navegar('/billetera/recargar/comprobante', {
        state: {
          recarga: {
            mensaje: res.mensaje,
            saldoAnterior: saldo,
            montoRecargado: res.montoRecargado,
            nuevoSaldo: res.nuevoSaldo,
          },
          cobroPendiente: billetera.cobroPendiente,
          fecha: new Date().toISOString(),
        },
      });
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  };

  return (
    <UsuarioLayout itemActivo="Mi billetera">
      <div className={styles.raiz}>
        <button type="button" className={`enlace ${styles.volver}`} onClick={() => navegar('/billetera')}>
          ← Volver a Mi Billetera
        </button>

        <header className={styles.cabecera}>
          <div className={styles.textoCabecera}>
            <h1 className={styles.titulo}>Recargar Saldo</h1>
            <p className={styles.subtitulo}>Paso 1 de 2: Ingresa el monto que deseas recargar en tu billetera.</p>
          </div>
          <span className={`insignia ${styles.paso}`}>PASO 1 / 2</span>
        </header>

        <form className={`tarjeta ${styles.principal}`} onSubmit={recargar} noValidate>
          <div className={styles.estadoCuenta}>
            <div>
              <p className={styles.etiqueta}>Estado de cuenta</p>
              <p className={styles.saldo}>
                Saldo actual: <strong>{formatearPesos(saldo)} COP</strong>
              </p>
            </div>
          </div>

          <div className={styles.filaCampo}>
            <label htmlFor="monto" className={styles.etiquetaCampo}>
              Monto a recargar (COP) <span className={styles.requerido}>*</span>
            </label>
            <span className={styles.minimo}>Mínimo: {formatearPesos(RECARGA_MINIMA)} COP</span>
          </div>

          <div className={styles.campoMonto}>
            <span className={styles.prefijo}>$</span>
            <input
              id="monto"
              className={styles.input}
              inputMode="numeric"
              value={texto}
              onChange={(evento) => {
                setTexto(evento.target.value.replace(/\D/g, ''));
                setError('');
              }}
            />
            <span className={styles.sufijo}>COP</span>
          </div>

          <div className={styles.ayuda}>
            <p className={styles.ayudaTitulo}>
              <IconoCheck /> Escribe el monto o elige una opción predefinida abajo.
            </p>
            <p className={styles.ayudaDetalle}>
              Valor entero sin decimales ({formatearPesos(RECARGA_MINIMA)} - {formatearPesos(RECARGA_MAXIMA)} COP).
              Saldo máx: <strong>{formatearPesos(SALDO_MAXIMO)} COP</strong> (Cupo disponible:{' '}
              <strong>{formatearPesos(cupoDisponible)} COP</strong>).
            </p>
          </div>

          <p className={styles.tituloSeccion}>Montos sugeridos de selección rápida</p>
          <div className={styles.sugeridos}>
            {SUGERIDOS.map((sugerido) => {
              const activo = Number(texto) === sugerido.valor;
              return (
                <button
                  key={sugerido.valor}
                  type="button"
                  aria-pressed={activo}
                  className={`${styles.sugerido} ${activo ? styles.sugeridoActivo : ''}`}
                  onClick={() => {
                    setTexto(String(sugerido.valor));
                    setError('');
                  }}
                >
                  <span className={styles.valorSugerido}>{formatearPesos(sugerido.valor)} COP</span>
                  <span className={styles.detalleSugerido}>{sugerido.detalle}</span>
                </button>
              );
            })}
          </div>

          {error && (
            <p className="mensaje-error" role="alert">
              {error}
            </p>
          )}

          <div className={styles.acciones}>
            <button type="button" className={`boton ${styles.cancelar}`} onClick={() => navegar('/billetera')}>
              Cancelar
            </button>
            <button type="submit" className={`boton ${styles.continuar}`} disabled={enviando || texto === ''}>
              {enviando ? 'Recargando...' : 'Recargar'} <IconoFlecha />
            </button>
          </div>
        </form>
      </div>
    </UsuarioLayout>
  );
}

export default RecargarSaldoPaso1Page;
