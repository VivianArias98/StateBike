import { useEffect, useState } from 'react';
import UsuarioLayout from '../../../layouts/UsuarioLayout/UsuarioLayout.jsx';
import MiBilletera from './MiBilletera.jsx';
import RecargarSaldo from './RecargarSaldo.jsx';
import PagarCobro from './PagarCobro.jsx';
import {
  obtenerBilletera,
  recargarSaldo,
  pagarCobroPendiente,
} from '../../../services/billeteraService.js';
import { MOVIMIENTOS_POR_PAGINA } from './billeteraMock.js';
import styles from './BilleteraPage.module.css';

// Calcula los minutos de exceso y el total del cobro (el backend puede traerlos ya calculados)
function completarCobro(cobro) {
  if (!cobro) return null;
  const minutosExceso = Math.max(cobro.minutosUsados - cobro.minutosLimite, 0);
  return { ...cobro, minutosExceso, total: minutosExceso * cobro.tarifaMinuto };
}

// Página del módulo Mi Billetera. Guarda el estado y la lógica; las vistas solo dibujan.
// «Ver más» muestra los movimientos siguientes; con la API será una consulta paginada.
// vista: 'resumen' | 'recargar' | 'pagar'. Cuando exista React Router, cada vista será una ruta.
function BilleteraPage() {
  const [vista, setVista] = useState('resumen');
  const [billetera, setBilletera] = useState(null);
  const [comprobante, setComprobante] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [visibles, setVisibles] = useState(MOVIMIENTOS_POR_PAGINA); // movimientos mostrados

  useEffect(() => {
    obtenerBilletera()
      .then((datos) => setBilletera({ ...datos, cobroPendiente: completarCobro(datos.cobroPendiente) }))
      .catch(() => setError('No se pudo consultar la billetera. Intente de nuevo'))
      .finally(() => setCargando(false));
  }, []);

  function irA(nuevaVista) {
    setVista(nuevaVista);
    setComprobante(null);
    setError('');
  }

  async function confirmarRecarga(monto) {
    setEnviando(true);
    setError('');
    try {
      const recibo = await recargarSaldo(monto, billetera.saldo);
      setBilletera((anterior) => ({
        ...anterior,
        saldo: recibo.saldoNuevo,
        movimientos: [
          {
            id: Date.now(),
            tipo: 'RECARGA',
            concepto: 'Recarga de saldo',
            detalle: `Ref. ${recibo.referencia} · Aprobado`,
            fecha: recibo.fecha,
            monto: recibo.monto,
            saldoResultante: recibo.saldoNuevo,
          },
          ...anterior.movimientos,
        ],
      }));
      setComprobante(recibo);
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setEnviando(false);
    }
  }

  async function confirmarPago() {
    setEnviando(true);
    setError('');
    try {
      const recibo = await pagarCobroPendiente(billetera.cobroPendiente, billetera.saldo);
      setBilletera((anterior) => ({
        ...anterior,
        saldo: recibo.saldoNuevo,
        cobroPendiente: null,
        movimientos: [
          {
            id: Date.now(),
            tipo: 'COBRO',
            concepto: 'Exceso de tiempo',
            detalle: `Viaje #${recibo.cobro.viaje} · ${recibo.cobro.minutosExceso} min de exceso`,
            fecha: recibo.fecha,
            monto: -recibo.cobro.total,
            saldoResultante: recibo.saldoNuevo,
          },
          ...anterior.movimientos,
        ],
      }));
      setComprobante(recibo);
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setEnviando(false);
    }
  }

  let contenido;
  if (cargando) {
    contenido = <p className={styles.estado}>Cargando tu billetera…</p>;
  } else if (!billetera) {
    contenido = (
      <p className="mensaje-error" role="alert">
        {error}
      </p>
    );
  } else if (vista === 'recargar') {
    contenido = (
      <RecargarSaldo
        saldo={billetera.saldo}
        cobroPendiente={billetera.cobroPendiente}
        comprobante={comprobante}
        enviando={enviando}
        error={error}
        onConfirmar={confirmarRecarga}
        onVolver={() => irA('resumen')}
      />
    );
  } else if (vista === 'pagar' && (billetera.cobroPendiente || comprobante)) {
    contenido = (
      <PagarCobro
        saldo={billetera.saldo}
        cobro={billetera.cobroPendiente}
        comprobante={comprobante}
        enviando={enviando}
        error={error}
        onConfirmar={confirmarPago}
        onRecargar={() => irA('recargar')}
        onVolver={() => irA('resumen')}
      />
    );
  } else {
    contenido = (
      <MiBilletera
        billetera={{ ...billetera, movimientos: billetera.movimientos.slice(0, visibles) }}
        hayMasMovimientos={billetera.movimientos.length > visibles}
        onRecargar={() => irA('recargar')}
        onPagarCobro={() => irA('pagar')}
        onVerMasMovimientos={() => setVisibles((actual) => actual + MOVIMIENTOS_POR_PAGINA)}
      />
    );
  }

  return (
    <UsuarioLayout itemActivo="Mi Billetera">
      <div className={styles.raiz}>{contenido}</div>
    </UsuarioLayout>
  );
}

export default BilleteraPage;
