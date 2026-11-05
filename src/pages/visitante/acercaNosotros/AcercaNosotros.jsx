import VisitanteLayout from '../../../layouts/VisitanteLayout/VisitanteLayout.jsx';
import TarjetaSeccion from './components/TarjetaSeccion.jsx';
import TarjetaValor from './components/TarjetaValor.jsx';
import TarjetaPersona from './components/TarjetaPersona.jsx';
import { IconoBicicleta, IconoUbicacion, IconoUsuario, IconoNfc } from '../../../components/Iconos/Iconos.jsx';
import { Icono } from '../components/IconosVisitante.jsx';
import styles from './AcercaNosotros.module.css';

// Contenido institucional (estático, no requiere inicio de sesión)
const VALORES = [
  { codigo: 'VALOR_01', titulo: 'Accesibilidad', texto: 'Planes con precios claros para el bolsillo.', etiqueta: '[SIN_BARRERAS]', icono: <IconoUsuario /> },
  { codigo: 'VALOR_02', titulo: 'Sostenibilidad', texto: 'Menos trayectos en vehículo, más movilidad limpia.', etiqueta: '[CERO_EMISIONES]', icono: <IconoBicicleta /> },
  { codigo: 'VALOR_03', titulo: 'Transparencia', texto: 'Sin cobros ocultos.', etiqueta: '[TARIFA_LINEAL]', icono: <IconoUbicacion /> },
  { codigo: 'VALOR_04', titulo: 'Confianza', texto: 'Bicicletas y estaciones en buen estado, con reportes atendidos por el equipo.', etiqueta: '[SOPORTE_ACTIVO]', icono: <IconoNfc /> },
];

const EQUIPO = [
  { iniciales: 'VA', nombre: 'Vivian María Arias Patiño', rol: 'PRODUCT & UX', cita: 'Piensa cada función desde lo que tú necesitas.' },
  { iniciales: 'YM', nombre: 'Yeimy Andrea Martínez', rol: 'PROJECT LEAD', cita: 'Hace que todo el equipo avance junto y a tiempo.' },
  { iniciales: 'TH', nombre: 'Theofilo Henrique Mendes de Brito', rol: 'CORE APP DEV', cita: 'Construye la app para que sea rápida y fácil de usar.' },
  { iniciales: 'JE', nombre: 'Joel Esteban Báez Torres', rol: 'DATA & TELEMETRY', cita: 'Cuida que cada viaje quede bien registrado.' },
  { iniciales: 'JP', nombre: 'Jenifer Pamela Nossa Gómez', rol: 'QA & VALIDATION', cita: 'Prueba todo antes de que llegue a tus manos.' },
];

function AcercaNosotros() {
  return (
    <VisitanteLayout itemActivo="Acerca de nosotros">
      <div className={styles.raiz}>
        <header className={styles.encabezado}>
          <span className={`insignia ${styles.chipProyecto}`}>PROYECTO TUNJA · 2025</span>
          <h1 className={styles.titulo}>Acerca de nosotros</h1>
          <p className={styles.subtitulo}>
            Conoce el propósito, la visión y el equipo detrás de StationBike en Tunja.
          </p>
        </header>

        <section className={`contexto-oscuro ${styles.hero}`} aria-labelledby="titulo-hero">
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
          <span className={styles.heroMarca}>[ RED URBANA TUNJA ]</span>
        </section>

        <section className={styles.dosColumnas} aria-label="Quiénes somos y por qué existimos">
          <TarjetaSeccion
            titulo="Quiénes somos"
            icono={<IconoBicicleta />}
            conImagen
            texto="StationBike es un servicio de préstamo de bicicletas con tarjeta NFC en estaciones de Tunja. Nació para que moverse por la ciudad sea rápido, económico y sostenible."
            etiquetas={['SISTEMA: MICRO-MOVILIDAD NFC', 'COBERTURA: TUNJA URBANO']}
          />
          <TarjetaSeccion
            titulo="Por qué existimos"
            icono={<IconoNfc />}
            conImagen
            texto="En trayectos cortos, el bus y el taxi cuestan más y toman más tiempo de lo necesario. Queremos que una bicicleta esté siempre a unos pasos, lista para usar."
            etiquetas={['OPTIMIZACIÓN: TIEMPO & COSTO', 'MODELO: COMPARTIDO']}
          />
        </section>

        <section className={styles.dosColumnas} aria-label="Misión y visión">
          <TarjetaSeccion
            etiqueta="MISIÓN"
            variante="negra"
            marca="[ACTUAL_2025]"
            titulo="Propósito operativo"
            texto="Ofrecer una forma práctica y accesible de recorrer Tunja en bicicleta, con estaciones cercanas, planes claros y un proceso de uso sencillo."
          />
          <TarjetaSeccion
            etiqueta="VISIÓN"
            variante="verdeClaro"
            marca="[ALCANCE_FUTURO]"
            titulo="Proyección de impacto"
            texto="Ser la red de bicicletas compartidas preferida de Tunja, con estaciones en los puntos de mayor movimiento de la ciudad."
          />
        </section>

        <section className={styles.valores} aria-label="Nuestros valores">
          {VALORES.map((valor) => (
            <TarjetaValor key={valor.codigo} {...valor} />
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
          “Hecho en Tunja, para quienes se mueven por Tunja.”
        </blockquote>

        <section className={`tarjeta ${styles.contacto}`} aria-labelledby="titulo-contacto">
          <div>
            <span className={styles.canal}>
              <span className={styles.canalIcono} aria-hidden="true"><Icono nombre="sobre" /></span>
              CANAL INSTITUCIONAL DIRECTO
            </span>
            <p id="titulo-contacto" className={styles.contactoTexto}>
              Correo: <a href="mailto:stationbike@gmail.com" className={styles.correo}>stationbike@gmail.com</a>
              {' · '}Ciudad: Tunja, Boyacá.
            </p>
            <p className={styles.nota}>
              Contenido institucional estático · No requiere inicio de sesión para consulta.
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
