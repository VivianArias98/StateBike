import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout/AdminLayout.jsx';
import Aviso from '../../../components/Avisos/Aviso.jsx';
import PlanesTable from './components/PlanesTable.jsx';
import PlanForm from './components/PlanForm.jsx';
import styles from './PlanesTarifasPage.module.css';

function leerToken() {
  try {
    const sesion = JSON.parse(localStorage.getItem('stationbike.sesion'));
    return sesion?.acceso || null;
  } catch {
    return null;
  }
}

function PlanesTarifasPage() {
  const navigate = useNavigate();
  const [planes, setPlanes] = useState([]);
  const [planEditando, setPlanEditando] = useState(null);
  const [aviso, setAviso] = useState('');
  const [cargando, setCargando] = useState(false);

  const cargarPlanes = async () => {
    try {
      const token = leerToken();
      const respuesta = await fetch('/api/admin/planes', {
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!respuesta.ok) {
        if (respuesta.status === 401 || respuesta.status === 403) {
          navigate('/login');
          return;
        }
        throw new Error('Error al cargar planes');
      }

      const datos = await respuesta.json();
      setPlanes(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.error(error);
      setAviso('No se pudo conectar con el servidor');
    }
  };

  useEffect(() => {
    cargarPlanes();
  }, []);

  const handleGuardar = async (datos) => {
    setCargando(true);
    try {
      const token = leerToken();
      const esEdicion = Boolean(datos.id);
      const url = esEdicion ? `/api/admin/planes/${datos.id}` : '/api/admin/planes';
      const metodo = esEdicion ? 'PUT' : 'POST';

      const respuesta = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(datos),
      });

      const resJson = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        if (resJson.error === 'nombre_plan_duplicado') {
          throw new Error('El nombre del plan ya se encuentra registrado');
        }
        if (resJson.error === 'costo_invalido') {
          throw new Error('Error: Verifique que el costo base sea un entero mínimo de $100 y el valor por minuto de exceso sea $0 o mínimo $100');
        }
        if (resJson.error === 'numeros_plan_invalidos') {
          throw new Error('Error: La vigencia, los viajes por día y el tiempo por viaje deben ser números enteros mayores a cero');
        }
        throw new Error(resJson.mensaje || 'Error al guardar el plan');
      }

      setAviso('Plan guardado y actualizado correctamente');
      setPlanEditando(null);
      await cargarPlanes();
    } finally {
      setCargando(false);
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      const token = leerToken();
      const accion = nuevoEstado === 'ACTIVO' ? 'activar' : 'inactivar';
      const respuesta = await fetch(`/api/admin/planes/${id}/${accion}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!respuesta.ok) {
        const resJson = await respuesta.json().catch(() => ({}));
        setAviso(resJson.mensaje || 'Error al cambiar estado del plan');
        return;
      }

      setAviso('Plan guardado y actualizado correctamente');
      await cargarPlanes();
    } catch {
      setAviso('Error de conexión al actualizar el plan');
    }
  };

  const handleEditar = (plan) => {
    setPlanEditando(plan);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelarEdicion = () => {
    setPlanEditando(null);
  };

  return (
    <AdminLayout itemActivo="Planes y tarifas">
      <h1 className="titulo-pagina">Planes y tarifas</h1>

      <div className={styles.contenido}>
        <PlanesTable
          planes={planes}
          onEditar={handleEditar}
          onCambiarEstado={handleCambiarEstado}
        />
        <PlanForm
          planEditando={planEditando}
          onGuardar={handleGuardar}
          onCancelarEdicion={handleCancelarEdicion}
          cargando={cargando}
        />
      </div>

      <Aviso mensaje={aviso} onCerrar={() => setAviso('')} />
    </AdminLayout>
  );
}

export default PlanesTarifasPage;
