import { useState } from 'react';
import Etiqueta from '../../../../components/Etiqueta/Etiqueta.jsx';
import { IconoNfc } from '../../../../components/Iconos/Iconos.jsx';
import { formatearFechaHora } from '../../../../utils/formatoMoneda.js';
import styles from './TarjetaNfc.module.css';

// Estado de la tarjeta NFC (la vincula el administrador). El usuario la bloquea o desbloquea
// con confirmación. onCambiarEstado('bloquear' | 'desbloquear').
function TarjetaNfc({ tarjeta, enviando, onCambiarEstado }) {
  const [confirmando, setConfirmando] = useState(false);

  if (!tarjeta) {
    return (
      <section className={`tarjeta ${styles.raiz}`}>
        <header className={styles.encabezado}>
          <h2 className={styles.titulo}>
            <IconoNfc /> Tarjeta NFC
          </h2>
          <Etiqueta texto="SIN VINCULAR" color="amarilla" />
        </header>
        <p className={styles.nota}>
          Aún no tienes una tarjeta NFC vinculada. La vinculación la gestiona el administrador.
        </p>
      </section>
    );
  }

  const activa = tarjeta.estado === 'ACTIVA';
  const accion = activa ? 'bloquear' : 'desbloquear';

  return (
    <section className={`tarjeta ${styles.raiz}`}>
      <header className={styles.encabezado}>
        <h2 className={styles.titulo}>
          <IconoNfc /> Tarjeta NFC
        </h2>
        <Etiqueta texto={tarjeta.estado} color={activa ? 'verde' : 'amarilla'} conPunto={activa} />
      </header>
      <p className={styles.codigo}>#{tarjeta.ultimosDigitos}</p>
      <p className={styles.detalle}>Últimos dígitos del identificador (UID)</p>
      {tarjeta.fechaCambio && (
        <p className={styles.detalle}>
          Último cambio de estado: {formatearFechaHora(tarjeta.fechaCambio)}
        </p>
      )}

      {!confirmando && (
        <button type="button" className="boton boton--bloque" onClick={() => setConfirmando(true)}>
          {activa ? 'Bloquear tarjeta' : 'Desbloquear tarjeta'}
        </button>
      )}

      {confirmando && (
        <div className={styles.confirmacion}>
          <p className={styles.nota}>
            {activa
              ? 'La tarjeta dejará de abrir anclajes y de confirmar devoluciones. Tu plan no se cancela y su vigencia sigue corriendo.'
              : 'La tarjeta volverá a abrir anclajes y a confirmar devoluciones.'}
          </p>
          <div className={styles.acciones}>
            <button type="button" className="boton boton--s" onClick={() => setConfirmando(false)}>
              Cancelar
            </button>
            <button
              type="button"
              className="boton boton--secundario boton--s"
              disabled={enviando}
              onClick={() => {
                onCambiarEstado(accion);
                setConfirmando(false);
              }}
            >
              {activa ? 'Confirmar bloqueo' : 'Confirmar desbloqueo'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default TarjetaNfc;
