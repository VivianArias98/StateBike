import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import MapaTunja from '../../../components/MapaTunja/MapaTunja.jsx';
import {
  IconoBicicleta,
  IconoCalendario,
  IconoCandado,
  IconoNfc,
  IconoReloj,
  IconoUbicacion,
} from '../../../components/Iconos/Iconos.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import MetricaUsuario from '../components/MetricaUsuario.jsx';
import { ESTACIONES, USUARIO } from '../datos.js';
import TarjetaEstacion from './components/TarjetaEstacion.jsx';
import styles from './InicioPage.module.css';

const LEYENDAS = [{ id: 'numero', contenido: 'El número indica la cantidad de bicicletas disponibles' }];

// Pantalla principal del usuario: resumen de su plan, mapa de estaciones y estaciones cercanas
function InicioPage() {
  // Pendiente: al elegir una estación, abrir su detalle (React Router)
  const abrirEstacion = () => {};
  // Pendiente: centrar el mapa en la ubicación del usuario
  const centrarUbicacion = () => {};
  // Pendiente: iniciar el desbloqueo de la bicicleta
  const desbloquear = () => {};

  const cercanas = ESTACIONES.slice(0, 3);

  return (
    <UsuarioLayout itemActivo="Viajes">
      <div className={styles.raiz}>
        <EncabezadoPagina
          etiqueta="Usuario / Inicio y estaciones / Pantalla principal"
          titulo={`Hola, ${USUARIO.nombre.split(' ')[0]}`}
          subtitulo="Consulta las estaciones de Tunja y encuentra una bicicleta para tu próximo viaje."
          acciones={
            <span className={styles.red}>
              <span className="punto-vivo" aria-hidden="true" />
              Red operativa Tunja
            </span>
          }
        />

        <div className={styles.metricas}>
          <MetricaUsuario
            etiqueta="Mi plan"
            valor="Plan mensual"
            detalle="45 min incluidos por viaje"
            icono={<IconoCalendario />}
          />
          <MetricaUsuario
            etiqueta="Tiempo disponible"
            valor="45 minutos"
            detalle="Disponibles para tu próximo viaje"
            icono={<IconoReloj />}
          />
          <MetricaUsuario
            etiqueta="Tarjeta NFC"
            valor={`•••• ${USUARIO.nfc.slice(-4)}`}
            detalle="ACTIVA · Lista para usar"
            icono={<IconoNfc />}
          />
        </div>

        <div className={styles.contenido}>
          <div className={styles.mapa}>
            <MapaTunja titulo={null} estaciones={ESTACIONES} leyendas={LEYENDAS} />
            <button type="button" className={styles.ubicacion} onClick={centrarUbicacion} aria-label="Centrar en mi ubicación">
              <IconoUbicacion />
            </button>
          </div>

          <section className={styles.lateral} aria-labelledby="estaciones-cercanas">
            <div className={styles.cabeceraLista}>
              <h2 id="estaciones-cercanas" className={styles.tituloLista}>
                Estaciones cercanas
              </h2>
              <span className={styles.conteo}>{cercanas.length} estaciones</span>
            </div>

            <div className={styles.lista}>
              {cercanas.map((estacion) => (
                <TarjetaEstacion
                  key={estacion.id}
                  nombre={estacion.nombre}
                  direccion={estacion.direccion}
                  bicicletas={estacion.bicicletas}
                  anclajesLibres={estacion.anclajesLibres}
                  onAbrir={abrirEstacion}
                />
              ))}
            </div>

            <button type="button" className={`boton boton--acento boton--bloque ${styles.accion}`} onClick={desbloquear}>
              <IconoCandado /> DESBLOQUEAR BICICLETA
            </button>

            <p className={styles.ayuda}>
              <span className={styles.iconoAyuda} aria-hidden="true">
                <IconoNfc />
              </span>
              <span>
                También puedes acercar tu tarjeta física <strong>#{USUARIO.nfc}</strong> directamente al tótem del anclaje.
              </span>
            </p>
          </section>
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default InicioPage;
