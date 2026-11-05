import VisitanteLayout from '../../../layouts/VisitanteLayout/VisitanteLayout.jsx';
import TarjetaPaso from './components/TarjetaPaso.jsx';
import TarjetaRegla from './components/TarjetaRegla.jsx';
import PreguntaFrecuente from './components/PreguntaFrecuente.jsx';
import { Icono } from '../components/IconosVisitante.jsx';
import styles from './ComoUsarServicio.module.css';

// Contenido de la guía (estático). Los textos vienen del mockup.
const PASOS = [
  { numero: '01', etiqueta: 'PREVIO', titulo: 'Explorar las estaciones', texto: 'Consulta en tiempo real la disponibilidad de bicicletas y anclajes libres en el mapa de Tunja sin necesidad de iniciar sesión.', icono: 'mapa', fase: 'Fase: Consulta' },
  { numero: '02', etiqueta: 'CATÁLOGO', titulo: 'Elegir un plan', texto: 'Compara las tarifas y beneficios de los planes disponibles en la sección Planes y tarifas según tus necesidades diarias o mensuales.', icono: 'etiqueta', fase: 'Fase: Selección' },
  { numero: '03', etiqueta: 'REGISTRO', titulo: 'Crear la cuenta', texto: 'Regístrate en la plataforma completando tus datos básicos de identidad, valida tu correo electrónico e inicia sesión en el sistema.', icono: 'usuarioMas', fase: 'Fase: Identidad' },
  { numero: '04', etiqueta: 'PUNTO FÍSICO', titulo: 'Obtener la tarjeta NFC', texto: 'Acércate a un punto de atención presencial donde el administrador autorizará y vinculará tu tarjeta física NFC a tu cuenta.', icono: 'nfc', fase: 'Fase: Vinculación' },
  { numero: '05', etiqueta: 'BILLETERA', titulo: 'Recargar la billetera', texto: 'Agrega saldo seguro a tu billetera virtual desde el módulo Mi billetera para contar con fondos disponibles de respaldo.', icono: 'billetera', fase: 'Fase: Fondos' },
  { numero: '06', etiqueta: 'ACTIVACIÓN', titulo: 'Adquirir el plan', texto: 'Selecciona el plan que prefieras; el costo se debita directamente del saldo de tu billetera y queda listo para viajar de inmediato.', icono: 'tarjeta', fase: 'Fase: Suscripción' },
  { numero: '07', etiqueta: 'EN ESTACIÓN', titulo: 'Desbloquear la bicicleta', texto: 'Acerca tu tarjeta física NFC al lector del anclaje en la estación elegida; el cerrojo se abrirá emitiendo una señal lumínica y sonora.', icono: 'candadoAbierto', fase: 'Fase: Salida' },
  { numero: '08', etiqueta: 'DESTINO', titulo: 'Devolver la bicicleta', texto: 'Encájala firmemente en un anclaje libre de cualquier estación y confirma el bloqueo pasando nuevamente tu tarjeta en el lector.', icono: 'bici', fase: 'Fase: Cierre de viaje' },
];

const REGLAS = [
  { numero: '01', etiqueta: 'REGLA CLAVE', titulo: 'Un viaje a la vez', texto: 'Cada usuario solo puede tener una bicicleta activa en uso al mismo tiempo. No es posible retirar múltiples vehículos con una misma cuenta.', icono: 'usuario', dato: 'Uso estrictamente unipersonal' },
  { numero: '02', etiqueta: 'DURACIÓN', titulo: 'Límites del plan', texto: 'Cada plan define una cantidad máxima de viajes por día y un tiempo límite incluido por viaje conforme a su descripción.', icono: 'reloj', dato: 'Control por intervalos' },
  { numero: '03', etiqueta: 'TOPE MÁXIMO', titulo: 'Exceso de tiempo', texto: 'Si superas el tiempo incluido, se cobra cada minuto extra (con un tope máximo de $5.000 COP por viaje) debitado de tu billetera.', icono: 'tarjeta', dato: 'Límite de cobro: $5.000 COP' },
  { numero: '04', etiqueta: 'SUSPENSIÓN', titulo: 'Cobro pendiente', texto: 'Si el saldo de tu billetera no cubre el exceso, el cobro queda pendiente y el servicio se suspende hasta que recargues y lo pagues.', icono: 'alerta', dato: 'Reactivación automática tras pago' },
  { numero: '05', etiqueta: 'PROTECCIÓN', titulo: 'Tarjeta bloqueada', texto: 'Si bloqueas tu tarjeta NFC por seguridad, esta no abrirá anclajes, pero tu plan continúa activo y su vigencia sigue corriendo.', icono: 'escudo', dato: 'Bloqueo preventivo en Mi Perfil' },
  { numero: '06', etiqueta: 'FINALIZACIÓN', titulo: 'Plan vencido', texto: 'Una vez vencido el plan, la tarjeta no desbloqueará nuevas bicicletas; no obstante, cualquier viaje en curso puede ser finalizado con total normalidad.', icono: 'calendario', dato: 'Entrega sin bloqueo ni multas' },
  { numero: '07', etiqueta: 'TÉRMINOS', titulo: 'Cancelación sin reembolso', texto: 'Cancelar un plan se aplica de forma inmediata; no genera devoluciones de dinero ni conserva los días no utilizados.', icono: 'cancelar', dato: 'Acción voluntaria irreversible' },
  { numero: '08', etiqueta: 'CLARIDAD', titulo: 'Sin cobro por distancia', texto: 'No existe cobro por kilómetros recorridos; solo se calcula el tiempo de uso transcurrido entre desanclaje y anclaje.', icono: 'mapa', dato: 'Recorridos libres por la ciudad' },
];

const PREGUNTAS = [
  { pregunta: '¿Cómo obtengo mi tarjeta física NFC?', icono: 'tarjeta', respuesta: 'La tarjeta es entregada y vinculada a tu cuenta por el administrador en las estaciones principales o puntos autorizados de Tunja tras registrarte en el portal web.' },
  { pregunta: '¿Qué pasa si paso del tiempo incluido por viaje?', icono: 'reloj', respuesta: 'Se aplicará una tarifa por minuto de exceso hasta un tope de $5.000 COP por trayecto, que se descontará automáticamente del saldo libre en tu billetera.' },
  { pregunta: '¿Qué pasa si no me alcanza el saldo para pagar el exceso?', icono: 'billetera', respuesta: 'El monto pendiente quedará registrado en tu billetera. Tu servicio quedará inactivo para nuevos viajes hasta cancelar el saldo adeudado mediante recarga.' },
  { pregunta: '¿Puedo recuperar mi dinero si cancelo mi plan?', icono: 'cancelar', respuesta: 'No. La cancelación es voluntaria e inmediata, sin devolución de dinero ni retención de vigencia restante según los términos y condiciones del sistema.' },
  { pregunta: '¿Qué hago si pierdo o daño mi tarjeta NFC?', icono: 'escudo', respuesta: 'Debes ingresar de inmediato a Mi Perfil y bloquear tu tarjeta para evitar usos indebidos de terceros, luego reportar la incidencia para recibir un reemplazo.' },
  { pregunta: '¿Qué pasa si mi plan vence durante un viaje en curso?', icono: 'calendario', respuesta: 'Puedes completar y finalizar tu recorrido con normalidad en cualquier anclaje libre sin penalidad; únicamente no podrás iniciar un trayecto nuevo.' },
  { pregunta: '¿Qué hago si la estación de destino no tiene anclajes libres?', icono: 'mapa', respuesta: 'Consulta en tiempo real la aplicación o el mapa interactivo para dirigirte a la estación más cercana con anclajes disponibles para devolver la bicicleta de manera segura.' },
];

const DATOS = [
  { valor: '08 ETAPAS', texto: 'FLUJO PASO A PASO', icono: 'mapa' },
  { valor: 'NFC + APP', texto: 'DESBLOQUEO INSTANTÁNEO', icono: 'nfc' },
  { valor: 'TOPE $5.000', texto: 'TARIFA TRANSPARENTE', icono: 'billetera' },
];

// Tono de cada regla, como en el mockup: oscuro, verde o alerta (rojo).
const TONOS_REGLAS = ['oscuro', 'verde', 'oscuro', 'alerta', 'verde', 'verde', 'verde', 'verde'];

function ComoUsarServicio() {
  return (
    <VisitanteLayout itemActivo="Cómo usar el servicio">
      <div className={styles.raiz}>
        <section className={`tarjeta ${styles.cabeceraGuia}`} aria-labelledby="titulo-guia">
          <div className={styles.cabeceraTexto}>
            <span className={`insignia ${styles.chipGuia} ${styles.etiquetaLarga}`}>
              GUÍA INTERACTIVA | <span className={styles.chipGuiaVerde}>MOVILIDAD ÁGIL · TUNJA</span>
            </span>

            <h1 id="titulo-guia" className={styles.titulo}>
              Cómo usar el servicio <span className={styles.tituloMarca}>StationBike</span>
            </h1>

            <p className={styles.descripcion}>
              Guía paso a paso, condiciones de operación y preguntas frecuentes para moverte en
              bicicleta pública por la ciudad de manera eficiente, sostenible y 100% segura.
            </p>

            <div className={styles.acciones}>
              <a href="#pasos" className={`boton ${styles.botonNegro}`}>Ver recorrido paso a paso</a>
              <a href="#reglas" className="boton">Reglas y condiciones</a>
            </div>
          </div>

          <dl className={styles.datos}>
            {DATOS.map((dato) => (
              <div key={dato.valor} className={styles.dato}>
                <div className={styles.datoInfo}>
                  <dt className={styles.datoValor}>{dato.valor}</dt>
                  <dd className={styles.datoTexto}>{dato.texto}</dd>
                </div>
                <span className={styles.datoIcono} aria-hidden="true">
                  <Icono nombre={dato.icono} />
                </span>
              </div>
            ))}
          </dl>
        </section>

        <section id="pasos" className={styles.bloque} aria-labelledby="titulo-pasos">
          <span className={styles.etiquetaSeccion}>[ RUTA DE USO ]</span>
          <div className={styles.encabezadoSeccion}>
            <h2 id="titulo-pasos" className={styles.tituloSeccion}>Pasos para utilizar el sistema</h2>
            <span className="insignia insignia--neutra">08 ETAPAS SECUENCIALES</span>
          </div>

          <div className={styles.grillaPasos}>
            {PASOS.map((paso) => (
              <TarjetaPaso key={paso.numero} {...paso} />
            ))}
          </div>
        </section>

        <section id="reglas" className={styles.bloque} aria-labelledby="titulo-reglas">
          <span className={styles.etiquetaSeccion}>[ POLÍTICAS DEL SERVICIO ]</span>
          <div className={styles.encabezadoSeccion}>
            <h2 id="titulo-reglas" className={styles.tituloSeccion}>
              Reglas importantes y condiciones de operación
            </h2>
            <span className="insignia insignia--neutra">NORMATIVA INSTITUCIONAL</span>
          </div>

          <div className={styles.grillaReglas}>
            {REGLAS.map((regla, indice) => (
              <TarjetaRegla key={regla.numero} {...regla} tono={TONOS_REGLAS[indice]} />
            ))}
          </div>
        </section>

        <section className={styles.bloque} aria-labelledby="titulo-preguntas">
          <span className={styles.etiquetaSeccion}>[ CENTRO DE RESOLUCIÓN ]</span>
          <div className={styles.encabezadoSeccion}>
            <h2 id="titulo-preguntas" className={styles.tituloSeccion}>Preguntas frecuentes</h2>
            <span className="insignia insignia--neutra">RESPUESTAS RÁPIDAS</span>
          </div>

          <div className={styles.grillaPreguntas}>
            {PREGUNTAS.map((item) => (
              <PreguntaFrecuente key={item.pregunta} {...item} />
            ))}
          </div>
        </section>

        <section className={`contexto-oscuro ${styles.llamada}`} aria-labelledby="titulo-llamada">
          <span className={styles.etiquetaLlamada}>SISTEMA PÚBLICO DE BICICLETAS DE TUNJA</span>
          <h2 id="titulo-llamada" className={styles.llamadaTitulo}>¿Listo para rodar en StationBike?</h2>
          <p className={styles.llamadaTexto}>
            Regístrate ahora para acceder al sistema público de bicicletas y moverte de forma
            sostenible, saludable y económica por toda la ciudad.
          </p>

          <div className={styles.acciones}>
            <a href="/registro" className={`boton ${styles.botonVerde}`}>Registrarse ahora</a>
            <a href="/login" className="boton">Iniciar sesión</a>
          </div>

          <p className={styles.nota}>
            ATENCIÓN PRESENCIAL EN ESTACIONES DE LA RED · SOPORTE TÉCNICO ACTIVO
          </p>
        </section>
      </div>
    </VisitanteLayout>
  );
}

export default ComoUsarServicio;
