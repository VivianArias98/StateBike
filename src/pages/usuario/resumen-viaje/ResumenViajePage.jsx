import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import BannerEstado from './components/BannerEstado.jsx';
import MapaResumen from './components/MapaResumen.jsx';
import EspecificacionServicio from './components/EspecificacionServicio.jsx';
import { formatearCOP, formatearFechaHora } from '../../../utils/formatoMoneda.js';
import styles from './ResumenViajePage.module.css';

// Datos de ejemplo (solo maquetación). Después llegarán del backend.
const VIAJE = {
  referencia: 'TJA-88421',
  estado: 'Viaje finalizado con éxito (Anclaje verificado por NFC)',
  origen: 'Estación Parque Central (5:10 p. m.)',
  destino: 'Estación Terminal (6:02 p. m.)',
  duracion: '52 min',
  tiempoIncluido: '45 min',
  bicicletaAnclaje: 'Anclaje #14',
  tramoCiclorruta: 'Tramo Ciclorruta Av. Colón · 3.4 km',
  velocidad: '11.8 km/h',
  desnivel: '+24 m',
};

const ESTACIONES = [
  { id: 1, nombre: 'Centro / Plaza de Bolívar', lat: 5.5353, lng: -73.3678, bicicletas: 4 },
  { id: 2, nombre: 'UPTC Central',              lat: 5.5528, lng: -73.3562, bicicletas: 11 },
  { id: 3, nombre: 'Viva Tunja',                lat: 5.5455, lng: -73.3505, bicicletas: 6 },
  { id: 4, nombre: 'Terminal',                  lat: 5.5412, lng: -73.3590, bicicletas: 3 },
  { id: 5, nombre: 'Parque Central',            lat: 5.5370, lng: -73.3600, bicicletas: 7 },
  { id: 6, nombre: 'Mercado',                   lat: 5.5420, lng: -73.3540, bicicletas: 2 },
];

const RUTA = [
  [5.5370, -73.3600],
  [5.5395, -73.3578],
  [5.5415, -73.3555],
  [5.5435, -73.3570],
  [5.5412, -73.3590],
];

const FILAS_SERVICIO = [
  { etiqueta: 'Origen',              valor: 'Estación Parque Central (5:10 p. m.)',  destacado: true },
  { etiqueta: 'Destino',             valor: 'Estación Terminal (6:02 p. m.)',         destacado: true },
  { etiqueta: 'Duración',            valor: '52 min',                                destacado: true },
  { etiqueta: 'Tiempo incluido en plan', valor: '45 min',                            destacado: false },
];

// Arma las filas de la tabla a partir del resumen que entrega el servicio de viajes
function filasDesdeResumen(resumen) {
  const filas = [
    { etiqueta: 'Origen', valor: resumen.origen, destacado: true },
    { etiqueta: 'Destino', valor: `${resumen.destino} (${formatearFechaHora(resumen.horaFin)})`, destacado: true },
    { etiqueta: 'Duración', valor: `${resumen.minutosUsados} min`, destacado: true },
    { etiqueta: 'Tiempo incluido en plan', valor: `${resumen.minutosIncluidos} min`, destacado: false },
    { etiqueta: 'Minutos de exceso', valor: `${resumen.minutosExceso} min`, destacado: false },
  ];
  if (resumen.minutosExceso > 0) {
    filas.push(
      { etiqueta: 'Valor por minuto de exceso', valor: `${formatearCOP(resumen.tarifaMinuto)} COP`, destacado: false },
      {
        etiqueta: 'Cobro por exceso',
        valor: `${formatearCOP(resumen.cobro)} COP${resumen.topeAplicado ? ' (tope por viaje aplicado)' : ''}`,
        destacado: true,
      },
      {
        etiqueta: 'Estado del cobro',
        valor: resumen.estadoCobro === 'PAGADO' ? 'Pagado con saldo de billetera' : 'Pendiente de pago',
        destacado: true,
      },
    );
  }
  return filas;
}

// resumen: resultado de finalizarViaje(). Sin resumen se muestran los datos de ejemplo.
// onVerHistorial / onNuevoViaje: la página que controla la navegación los pasa.
function ResumenViajePage({ resumen, onVerHistorial, onNuevoViaje }) {
  const irAHistorial = () => onVerHistorial?.();
  const liberarBicicleta = () => onNuevoViaje?.();

  const filas = resumen ? filasDesdeResumen(resumen) : FILAS_SERVICIO;
  const referencia = resumen ? resumen.referencia : VIAJE.referencia;
  const cobroPendiente = resumen && resumen.estadoCobro === 'PENDIENTE';

  return (
    <UsuarioLayout itemActivo="Viajes">
      <div className={styles.raiz}>

        {/* Encabezado del módulo */}
        <header className={styles.encabezado}>
          <p className={styles.modulo}>Operación Tunja Bici / Comprobante de entrega</p>
          <h1 className={styles.titulo}>Resumen del Último Viaje</h1>
        </header>

        {/* Banner de estado: viaje finalizado + referencia */}
        <BannerEstado
          mensaje={resumen ? resumen.mensaje : `Estado: ${VIAJE.estado}`}
          referencia={referencia}
        />

        {/* Aviso cuando el saldo no alcanzó para pagar el exceso */}
        {cobroPendiente && (
          <p className="mensaje-error" role="alert">
            {resumen.mensajeCobro}
          </p>
        )}

        {/* Contenido principal: mapa + especificación del servicio */}
        <div className={styles.contenido}>
          <MapaResumen
            estaciones={ESTACIONES}
            ruta={RUTA}
            velocidad={VIAJE.velocidad}
            desnivel={VIAJE.desnivel}
            tramoCiclorruta={VIAJE.tramoCiclorruta}
          />

          <EspecificacionServicio
            filas={filas}
            filaBicicleta={VIAJE.bicicletaAnclaje}
            onVerHistorial={irAHistorial}
            onLiberarBicicleta={liberarBicicleta}
          />
        </div>

      </div>
    </UsuarioLayout>
  );
}

export default ResumenViajePage;
