import VisitanteLayout from '../../../layouts/VisitanteLayout/VisitanteLayout.jsx';
import { Icono } from '../components/IconosVisitante.jsx';
import styles from './NuevaContrasena.module.css';

const REQUISITOS = ['Al menos 8 caracteres', 'Una letra mayúscula', 'Un número'];

function CampoClave({ id, etiqueta }) {
  return (
    <div className={`campo ${styles.campo}`}>
      <label htmlFor={id} className={styles.etiqueta}>{etiqueta}</label>
      <div className={styles.control}>
        <input id={id} type="password" className={`input ${styles.entrada}`} defaultValue="contraseña123" />
        <button type="button" className={styles.ojo} aria-label="Mostrar contraseña">
          <Icono nombre="ojo" />
        </button>
      </div>
    </div>
  );
}

function NuevaContrasena() {
  return (
    <VisitanteLayout>
      <div className={styles.pagina}>
        <div className={styles.marco}>
          <section className={`contexto-oscuro ${styles.panel}`} aria-label="Bienvenida">
            <h1 className={styles.titulo}>
              Protege tu próximo <br />recorrido.
            </h1>
            <p className={styles.descripcion}>
              Elige una contraseña segura para volver a entrar a StationBike y seguir moviéndote por Tunja.
            </p>
          </section>

          <section className={styles.tarjeta} aria-labelledby="titulo-nueva">
            <h2 id="titulo-nueva" className={styles.titulo2}>Nueva contraseña</h2>
            <p className={styles.subtitulo}>Crea una nueva contraseña para tu cuenta</p>

            <CampoClave id="nueva-clave" etiqueta="Nueva contraseña" />
            <CampoClave id="confirmar-clave" etiqueta="Confirmar contraseña" />

            <div className={styles.requisitos}>
              <p className={styles.requisitosTitulo}>Tu contraseña debe incluir:</p>
              <ul className={styles.lista}>
                {REQUISITOS.map((texto) => (
                  <li key={texto}>{texto}</li>
                ))}
              </ul>
            </div>

            <button type="button" className={`boton boton--primario boton--bloque ${styles.accion}`}>
              Guardar contraseña
            </button>
          </section>
        </div>
      </div>
    </VisitanteLayout>
  );
}

export default NuevaContrasena;
