import VisitanteLayout from '../../../layouts/VisitanteLayout/VisitanteLayout.jsx';
import TarjetaSeccion from './components/TarjetaSeccion.jsx';
import TarjetaValor from './components/TarjetaValor.jsx';
import TarjetaPersona from './components/TarjetaPersona.jsx';
import { IconoBicicleta, IconoUbicacion, IconoUsuario, IconoNfc } from '../../../components/Iconos/Iconos.jsx';
import { Icono } from '../components/IconosVisitante.jsx';
import styles from './AcercaNosotros.module.css';

// Imágenes (carpeta ./img)
import imgHero from './img/tunja1.jpg';
import imgQuienesSomos from './img/tunja.png';
import imgPorQueExistimos from './img/ciclistas.jpeg';
import fotoVivian from './img/PO.jpeg';
import fotoYeimy from './img/SM.jpg';
import fotoTheofilo from './img/Dev1.jpeg';
import fotoJoel from './img/Dev2.jpg';
import fotoJenifer from './img/QA.jpeg';

// Contenido institucional
const VALORES = [
  { titulo: 'Precios accesibles', texto: 'Planes económicos con tarifas claras para el bolsillo.', icono: <IconoUsuario /> },
  { titulo: 'Sostenibilidad', texto: 'Menos trayectos en vehículo, más movilidad limpia.', icono: <IconoBicicleta /> },
  { titulo: 'Transparencia', texto: 'Sin cobros ocultos.', icono: <IconoUbicacion /> },
  { titulo: 'Confianza', texto: 'Bicicletas y estaciones en buen estado, con reportes atendidos por el equipo.', icono: <IconoNfc /> },
];

const EQUIPO = [
  { iniciales: 'VA', nombre: 'Vivian Arias', rol: 'Product Owner', foto: fotoVivian, cita: 'Define qué construir y por qué, siempre pensando en lo que tú necesitas.' },
  { iniciales: 'YM', nombre: 'Yeimy Martínez', rol: 'Scrum Master', foto: fotoYeimy, cita: 'Hace que el equipo avance junto, sin obstáculos y a tiempo.' },
  { iniciales: 'TH', nombre: 'Theofilo Mendes', rol: 'Lead Developer', foto: fotoTheofilo, cita: 'Programa cada detalle pensando en que la uses sin complicaciones.' },
  { iniciales: 'JE', nombre: 'Joel Báez', rol: 'Junior Developer', foto: fotoJoel, cita: 'Da vida a cada función para que todo funcione sin fallos.' },
  { iniciales: 'JP', nombre: 'Jenifer Nossa', rol: 'QA Engineer', foto: fotoJenifer, cita: 'Prueba todo antes de que llegue a tus manos.' },
];

function AcercaNosotros() {
  return (
    <VisitanteLayout itemActivo="Acerca de nosotros">
      <div className={styles.raiz}>
        <header className={styles.encabezado}>
          <h1 className={styles.titulo}>Acerca de nosotros</h1>
          <p className={styles.subtitulo}>
            Conoce el propósito, la visión y el equipo detrás de StationBike en Tunja.
          </p>
        </header>

        <section className={`contexto-oscuro ${styles.hero}`} aria-labelledby="titulo-hero">
          <img src={imgHero} alt="" className={styles.heroImagen} />
          <div className={styles.heroTexto}>
            <span className="insignia insignia--activa">Tunja, Boyacá</span>
            <h2 id="titulo-hero" className={styles.heroTitulo}>
              Movilidad inteligente sobre dos ruedas
            </h2>
            <p className={styles.heroDescripcion}>
              Transformando el transporte intercampus y el centro histórico mediante estaciones
              solares inteligentes y tecnología NFC sin contacto.
            </p>
          </div>
        </section>

        <section className={styles.dosColumnas} aria-label="Quiénes somos y por qué existimos">
          <TarjetaSeccion
            titulo="Quiénes somos"
            icono={<IconoBicicleta />}
            imagen={imgQuienesSomos}
            altImagen="Ciclista en una plaza del centro histórico de Tunja"
            texto="StationBike es un servicio de préstamo de bicicletas con tarjeta NFC en estaciones de Tunja. Nació para que moverse por la ciudad sea rápido, económico y sostenible."
            etiquetas={['Bicicletas con tarjeta NFC', 'Estaciones en Tunja']}
          />
          <TarjetaSeccion
            titulo="Por qué existimos"
            icono={<IconoNfc />}
            imagen={imgPorQueExistimos}
            altImagen="Grupo de ciclistas recorriendo una vía de la ciudad"
            texto="En trayectos cortos, el bus y el taxi cuestan más y toman más tiempo de lo necesario. Queremos que una bicicleta esté siempre a unos pasos, lista para usar."
            etiquetas={['Ahorra tiempo y dinero', 'Bicicletas compartidas']}
          />
        </section>

        <section className={styles.dosColumnas} aria-label="Misión y visión">
          <TarjetaSeccion
            etiqueta="Misión"
            variante="negra"
            titulo="Propósito operativo"
            texto="Ofrecer una forma práctica y accesible de recorrer Tunja en bicicleta, con estaciones cercanas, planes claros y un proceso de uso sencillo."
          />
          <TarjetaSeccion
            etiqueta="Visión"
            variante="verdeClaro"
            titulo="Proyección de impacto"
            texto="Ser la red de bicicletas compartidas preferida de Tunja, con estaciones en los puntos de mayor movimiento de la ciudad."
          />
        </section>

        <section className={styles.valores} aria-label="Nuestros valores">
          {VALORES.map((valor) => (
            <TarjetaValor key={valor.titulo} {...valor} />
          ))}
        </section>

        <section className={styles.equipoBloque} aria-labelledby="titulo-equipo">
          <h2 id="titulo-equipo" className={styles.tituloSeccion}>Las personas detrás de StationBike</h2>
          <p className={styles.subtitulo}>
            Un equipo que trabaja para que moverse por Tunja sea más fácil.
          </p>

          <div className={styles.equipo}>
            {EQUIPO.map((persona) => (
              <TarjetaPersona key={persona.nombre} {...persona} />
            ))}
          </div>
        </section>

        <blockquote className={styles.cita}>
          “Muévete por Tunja”
        </blockquote>

        <section className={`tarjeta ${styles.contacto}`} aria-labelledby="titulo-contacto">
          <div>
            <span className={styles.canal}>
              <span className={styles.canalIcono} aria-hidden="true"><Icono nombre="sobre" /></span>
              Contáctanos
            </span>
            <p id="titulo-contacto" className={styles.contactoTexto}>
              Correo: <a href="mailto:stationbike@gmail.com" className={styles.correo}>stationbike@gmail.com</a>
              {' · '}Ciudad: Tunja, Boyacá.
            </p>
          </div>

          <a href="mailto:stationbike@gmail.com" className={`boton ${styles.botonVerde}`}>
            Escribir al equipo
          </a>
        </section>
      </div>
    </VisitanteLayout>
  );
}

export default AcercaNosotros;