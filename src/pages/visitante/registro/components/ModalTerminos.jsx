import { useEffect } from 'react';
import styles from './ModalTerminos.module.css';

function ModalTerminos({ abierto, onCerrar, onAceptar }) {
  // Cerrar con la tecla Escape
  useEffect(() => {
    function manejarTecla(e) {
      if (e.key === 'Escape') onCerrar();
    }
    if (abierto) {
      document.addEventListener('keydown', manejarTecla);
      // Evitar scroll del fondo mientras el modal está abierto
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', manejarTecla);
      document.body.style.overflow = '';
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div
      className={styles.fondo}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-terminos"
    >
      <div className={styles.tarjeta}>
        <header className={styles.cabecera}>
          <div>
            <h2 id="titulo-terminos" className={styles.titulo}>
              Términos, Condiciones y Privacidad
            </h2>
            <p className={styles.subtitulo}>
              StationBike · Sistema de Bicicletas Compartidas de Tunja
            </p>
          </div>
          <button
            type="button"
            className={styles.botonCerrar}
            onClick={onCerrar}
            aria-label="Cerrar términos y condiciones"
          >
            ×
          </button>
        </header>

        <div className={styles.cuerpo}>
          <section className={styles.seccion}>
            <h3 className={styles.seccionTitulo}>1. Objeto del Servicio</h3>
            <p>
              StationBike es el sistema público de bicicletas compartidas de la ciudad de Tunja,
              destinado a facilitar la movilidad urbana sostenible de los ciudadanos y visitantes
              mediante estaciones automatizadas de retiro y devolución.
            </p>
          </section>

          <section className={styles.seccion}>
            <h3 className={styles.seccionTitulo}>2. Requisitos de Acceso y Mayoría de Edad</h3>
            <p>
              El usuario declara bajo juramento ser <strong>mayor de 18 años</strong> y haber
              suministrado información verídica, exacta y actualizada en el proceso de registro.
              El uso del sistema por parte de menores de edad se encuentra restringido por
              motivos de seguridad vial y normatividad legal.
            </p>
          </section>

          <section className={styles.seccion}>
            <h3 className={styles.seccionTitulo}>3. Uso Unipersonal e Intransferible</h3>
            <p>
              La cuenta y la tarjeta física NFC asignada son de carácter <strong>estrictamente personal e intransferible</strong>.
              Cada usuario registrado podrá tener únicamente <strong>una (1) bicicleta activa en uso al mismo tiempo</strong>.
              Queda prohibido ceder, prestar o alquilar la tarjeta o la cuenta a terceros.
            </p>
          </section>

          <section className={styles.seccion}>
            <h3 className={styles.seccionTitulo}>4. Planes, Tiempos de Uso y Cobro por Exceso</h3>
            <p>
              Cada plan contratado establece un tiempo límite incluido por viaje y una cantidad
              máxima de trayectos por día. En caso de superar el tiempo incluido por recorrido:
            </p>
            <ul className={styles.lista}>
              <li>Se debitará de la billetera virtual la tarifa correspondiente por cada minuto adicional.</li>
              <li>El cobro por exceso cuenta con un <strong>tope máximo de $5.000 COP por viaje</strong>.</li>
              <li>
                Si el saldo de la billetera no cubre el valor del exceso, el servicio quedará suspendido
                preventivamente hasta que se realice la recarga y el pago del cobro pendiente.
              </li>
            </ul>
          </section>

          <section className={styles.seccion}>
            <h3 className={styles.seccionTitulo}>5. Retiro, Custodia y Devolución del Vehículo</h3>
            <p>
              Al retirar la bicicleta, el usuario asume la guarda y custodia del vehículo durante el viaje.
              El trayecto finaliza únicamente cuando la bicicleta es encajada con éxito en un anclaje libre
              de una estación autorizada en Tunja y se confirma el bloqueo acústico y lumínico.
              Cualquier daño, avería o pérdida debe ser reportada inmediatamente a través del módulo de incidencias.
            </p>
          </section>

          <section className={styles.seccion}>
            <h3 className={styles.seccionTitulo}>6. Cancelaciones y Reembolsos</h3>
            <p>
              La cancelación voluntaria de un plan es inmediata y definitiva. De acuerdo con las
              condiciones operativas del servicio, la cancelación <strong>no genera devolución de dinero</strong> ni
              conserva días o viajes no utilizados.
            </p>
          </section>

          <section className={styles.seccion}>
            <h3 className={styles.seccionTitulo}>7. Tratamiento de Datos Personales (Habeas Data)</h3>
            <p>
              En cumplimiento de la <strong>Ley Estatutaria 1581 de 2012</strong> de la República de Colombia,
              los datos personales recolectados (nombre, identificación, correo, fecha de nacimiento,
              registros de viajes y transacciones) serán tratados para:
            </p>
            <ul className={styles.lista}>
              <li>Creación, autenticación y administración de la cuenta de usuario.</li>
              <li>Vinculación y control de acceso mediante tarjetas NFC.</li>
              <li>Control operativo, trazabilidad de viajes y facturación en la billetera virtual.</li>
              <li>Atención de incidencias, soporte técnico y seguridad del sistema.</li>
            </ul>
            <p>
              Como titular, tienes derecho a conocer, actualizar, rectificar o revocar la autorización
              sobre tus datos personales en cualquier momento desde tu perfil o a través de nuestros canales de atención.
            </p>
          </section>
        </div>

        <footer className={styles.pie}>
          <button
            type="button"
            className={`boton boton--s ${styles.botonSecundario}`}
            onClick={onCerrar}
          >
            Cerrar
          </button>
          <button
            type="button"
            className={`boton boton--primario boton--s ${styles.botonAceptar}`}
            onClick={() => {
              onAceptar();
              onCerrar();
            }}
          >
            Aceptar términos y condiciones
          </button>
        </footer>
      </div>
    </div>
  );
}

export default ModalTerminos;

