import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import Etiqueta from '../../../components/Etiqueta/Etiqueta.jsx';
import { IconoFlecha, IconoInfo } from '../../../components/Iconos/Iconos.jsx';
import EncabezadoPagina from '../components/EncabezadoPagina.jsx';
import FormularioDatos from './components/FormularioDatos.jsx';
import TarjetaNfcPerfil from './components/TarjetaNfcPerfil.jsx';
import styles from './MiPerfilPage.module.css';

// Datos de ejemplo (solo maquetación). Después llegarán del backend.
const PERFIL = {
  id: 'TNJ-08942',
  nombre: 'Camila Rojas',
  telefono: '300 123 4567',
  documento: '1.049.876.543',
  fechaNacimiento: '14/03/2001',
  edad: 24,
};

const TARJETA = { referencia: 'TUN-4821', ultimos: '4821', titular: 'Camila Rojas', expira: '12/28' };

// Perfil del usuario: datos personales, credenciales y tarjeta NFC
function MiPerfilPage() {
  // Pendiente: abrir el centro de ayuda (React Router)
  const abrirAyuda = () => {};

  return (
    <UsuarioLayout itemActivo="Mi perfil">
      <div className={styles.raiz}>
        <EncabezadoPagina
          titulo={
            <>
              Mi Perfil <Etiqueta texto="Titular" color="menta" />
            </>
          }
          subtitulo="Gestión centralizada de credenciales, datos de identidad y acceso NFC a estaciones"
          acciones={
            <span className={styles.idPerfil}>
              <span className={styles.punto} aria-hidden="true" />
              ID: {PERFIL.id}
            </span>
          }
        />

        <section className={`tarjeta ${styles.aviso}`} aria-label="Estado de la identidad">
          <span className={styles.iconoAviso} aria-hidden="true">
            <IconoInfo />
          </span>
          <p className={styles.textoAviso}>
            <strong>Identidad verificada:</strong> Tus datos personales están validados con el Registro Municipal. Para
            actualizar tu clave, usa una combinación alfanumérica segura.
          </p>
          <button type="button" className={`boton boton--s ${styles.ayuda}`} onClick={abrirAyuda}>
            Centro de ayuda <IconoFlecha />
          </button>
        </section>

        <div className={styles.contenido}>
          <FormularioDatos perfil={PERFIL} />
          <TarjetaNfcPerfil
            referencia={TARJETA.referencia}
            ultimos={TARJETA.ultimos}
            titular={TARJETA.titular}
            expira={TARJETA.expira}
          />
        </div>
      </div>
    </UsuarioLayout>
  );
}

export default MiPerfilPage;
