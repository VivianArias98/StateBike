import { useState } from 'react';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import { IconoCheck, IconoFlecha, IconoInfo, IconoNfc } from '../../../components/Iconos/Iconos.jsx';
import { formatearPesos } from '../formato.js';
import styles from './RecargarSaldoPaso1Page.module.css';

// Datos de ejemplo del mockup. Después llegarán del backend.
const SALDO_ACTUAL = 15000;
const MINIMO = 100;
const MAXIMO = 500000;
const SALDO_MAXIMO = 2000000;
const CUPO_DISPONIBLE = 1985000;

const SUGERIDOS = [
  { valor: 10000, detalle: 'Recarga básica' },
  { valor: 20000, detalle: 'Frecuente' },
  { valor: 32000, detalle: '(plan mensual)' },
  { valor: 50000, detalle: 'Larga duración' },
];

const INFORMACION = [
  { etiqueta: 'Sincronización', valor: 'Actualización Inmediata en Docks' },
  { etiqueta: 'Seguridad bancaria', valor: 'Cifrado PSE & Pasarela Directa' },
  { etiqueta: 'Red municipal', valor: 'Tunja - Estaciones Activas' },
];

function RecargarSaldoPaso1Page() {
  const [texto, setTexto] = useState('20000');
  const monto = Number(texto);
  const valido = texto !== '' && monto >= MINIMO && monto <= MAXIMO;

  return (
    <UsuarioLayout itemActivo="Mi billetera">
      <div className={styles.raiz}>
        <button type="button" className={`enlace ${styles.volver}`}>
          ← Volver a Mi Billetera
        </button>

        <header className={styles.cabecera}>
          <div className={styles.textoCabecera}>
            <h1 className={styles.titulo}>Recargar Saldo</h1>
            <p className={styles.subtitulo}>
              Paso 1 de 2: Ingresa el monto que deseas recargar en tu billetera institucional.
            </p>
          </div>
          <span className={`insignia ${styles.paso}`}>PASO 1 / 2</span>
        </header>

        <div className={styles.contenido}>
          <section className={`tarjeta ${styles.principal}`} aria-labelledby="recarga-titulo">
            <div className={styles.estadoCuenta}>
              <div>
                <p className={styles.etiqueta}>Estado de cuenta</p>
                <p className={styles.saldo}>
                  Saldo actual: <strong>{formatearPesos(SALDO_ACTUAL)} COP</strong>
                </p>
              </div>
              <span className={styles.disponible}>
                <span className="punto-vivo" aria-hidden="true" />
                DISPONIBLE
              </span>
            </div>

            <div className={styles.filaCampo}>
              <label htmlFor="monto" className={styles.etiquetaCampo}>
                Monto a recargar (COP) <span className={styles.requerido}>*</span>
              </label>
              <span className={styles.minimo}>Mínimo: {formatearPesos(MINIMO)} COP</span>
            </div>

            <div className={styles.campoMonto}>
              <span className={styles.prefijo}>$</span>
              <input
                id="monto"
                className={styles.input}
                inputMode="numeric"
                value={texto}
                onChange={(evento) => setTexto(evento.target.value.replace(/\D/g, ''))}
              />
              <span className={styles.sufijo}>COP</span>
            </div>

            <div className={styles.ayuda}>
              <p className={styles.ayudaTitulo}>
                <IconoCheck /> Escribe libremente el monto o elige una opción predefinida abajo.
              </p>
              <p className={styles.ayudaDetalle}>
                Valor entero positivo sin decimales ({formatearPesos(MINIMO)} - {formatearPesos(MAXIMO)} COP).
                Saldo máx: <strong>{formatearPesos(SALDO_MAXIMO)} COP</strong> (Cupo disponible:{' '}
                <strong>{formatearPesos(CUPO_DISPONIBLE)} COP</strong>).
              </p>
            </div>

            <p className={styles.tituloSeccion}>Montos sugeridos de selección rápida</p>
            <div className={styles.sugeridos}>
              {SUGERIDOS.map((sugerido) => {
                const activo = monto === sugerido.valor;
                return (
                  <button
                    key={sugerido.valor}
                    type="button"
                    aria-pressed={activo}
                    className={`${styles.sugerido} ${activo ? styles.sugeridoActivo : ''}`}
                    onClick={() => setTexto(String(sugerido.valor))}
                  >
                    <span className={styles.valorSugerido}>{formatearPesos(sugerido.valor)} COP</span>
                    <span className={styles.detalleSugerido}>{sugerido.detalle}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.acciones}>
              <button type="button" className={`boton ${styles.cancelar}`}>Cancelar</button>
              <button type="button" className={`boton ${styles.continuar}`} disabled={!valido}>
                Continuar <IconoFlecha />
              </button>
            </div>
          </section>

          <aside className={styles.lateral} aria-label="Información de la recarga">
            <div className={`tarjeta ${styles.bloqueInformacion}`}>
              <p className={styles.textoInformacion}>
                <IconoInfo /> La acreditación se realiza de forma directa en el saldo de StationBike una vez
                verificado el medio de pago.
              </p>
              {INFORMACION.map((dato) => (
                <div key={dato.etiqueta} className={styles.datoInformacion}>
                  <span className={styles.etiquetaDato}>{dato.etiqueta}</span>
                  <span className={styles.valorDato}>{dato.valor}</span>
                </div>
              ))}
            </div>

            <div className={`tarjeta ${styles.tarjetaNfc}`}>
              <div className={styles.nfcCabecera}>
                <span className={styles.iconoNfc}>
                  <IconoNfc />
                </span>
                <div>
                  <p className={styles.nfcTitulo}>Tarjeta NFC #TUN-8831</p>
                  <p className={styles.nfcDetalle}>Vinculación instantánea a credencial física.</p>
                </div>
              </div>
              <div className={styles.nfcPie}>
                <span className={styles.etiquetaDato}>Estado</span>
                <span className={styles.telemetria}>TELEMETRÍA EN LÍNEA</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default RecargarSaldoPaso1Page;
