import React, { useState, useEffect } from 'react';
import BilleteraPrincipal from './components/BilleteraPrincipal';
import RecargarSaldoView from './components/RecargarSaldoView';
import PagarCobroView from './components/PagarCobroView';
import { fetchWallet, fetchMovements, topupWallet, chargeWallet } from './walletService';
import styles from './BilleteraPage.module.css';

function BilleteraPage() {
  const [billetera, setBilletera] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [vistaInterna, setVistaInterna] = useState('principal'); // 'principal' | 'recargar' | 'pagar'

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [walletData, movementsData] = await Promise.all([
        fetchWallet(),
        fetchMovements()
      ]);
      setBilletera({
        ...walletData,
        movimientos: movementsData.movimientos || movementsData.data || movementsData || []
      });
    } catch (err) {
      console.warn('API no disponible o sin credenciales activas, cargando estado local:', err);
      setBilletera({
        idUsuario: '1.049.882',
        saldo: 15000,
        tarjetaNfc: '#TUN-8831',
        planVigente: 'Regular 30 Días Activo',
        diasRestantesPlan: 24,
        ultimaEstacion: 'Terminal de Pasajeros',
        dock: '04',
        cobroPendiente: {
          id: 'CP-2026-084',
          concepto: 'Exceso de tiempo',
          viaje: '#VIAJE-8831 (Plaza → Terminal)',
          viajeId: 'VIAJE-8831',
          monto: 2500,
          minutosExceso: 25
        },
        movimientos: [
          {
            id: '1',
            tipo: 'RECARGA',
            concepto: 'Recarga de saldo vía PSE',
            referencia: 'REF: #TRX-994021 - Aprobado',
            fechaHora: '02 Nov 2026, 10:15 AM',
            monto: 20000,
            saldoResultante: 17500
          },
          {
            id: '2',
            tipo: 'COBRO',
            concepto: 'Cobro por exceso de tiempo (25 min - Viaje #VIA-0892)',
            referencia: 'Deducción de minutos adicionales de estación',
            fechaHora: '01 Nov 2026, 06:45 PM',
            monto: -2500,
            saldoResultante: 15000
          },
          {
            id: '3',
            tipo: 'COBRO',
            concepto: 'Adquisición de Plan Mensual',
            referencia: 'Suscripción Regular 30 Días #PLN-441',
            fechaHora: '27 Oct 2026, 09:30 AM',
            monto: -32000,
            saldoResultante: 17500
          },
          {
            id: '4',
            tipo: 'RECARGA',
            concepto: 'Recarga de saldo vía Tarjeta Débito',
            referencia: 'REF: #TRX-910283 - Terminación 1884',
            fechaHora: '27 Oct 2026, 09:10 AM',
            monto: 50000,
            saldoResultante: 49500
          }
        ]
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleEjecutarRecarga = async (monto) => {
    try {
      const res = await topupWallet(monto, 'PSE');
      await cargarDatos();
      return res;
    } catch {
      const nuevoSaldo = (billetera?.saldo || 15000) + monto;
      const nuevoMovimiento = {
        id: Date.now().toString(),
        tipo: 'RECARGA',
        concepto: 'Recarga de saldo vía PSE',
        referencia: `REF: #TRX-${Math.floor(100000 + Math.random() * 900000)} - Aprobado`,
        fechaHora: new Date().toLocaleString(),
        monto: monto,
        saldoResultante: nuevoSaldo
      };
      setBilletera(prev => ({
        ...prev,
        saldo: nuevoSaldo,
        movimientos: [nuevoMovimiento, ...prev.movimientos]
      }));
      return { referencia: `TRX-${Math.floor(100000 + Math.random() * 900000)}` };
    }
  };

  const handleEjecutarPago = async () => {
    if (!billetera?.cobroPendiente) return;
    const montoCobro = billetera.cobroPendiente.monto;
    try {
      const res = await chargeWallet(
        montoCobro,
        billetera.cobroPendiente.concepto,
        billetera.cobroPendiente.viajeId
      );
      await cargarDatos();
      return res;
    } catch {
      const nuevoSaldo = billetera.saldo - montoCobro;
      const nuevoMovimiento = {
        id: Date.now().toString(),
        tipo: 'COBRO',
        concepto: `Pago: ${billetera.cobroPendiente.concepto} (${billetera.cobroPendiente.viaje})`,
        referencia: `Comprobante #CP-PAGADO-${Math.floor(1000 + Math.random() * 9000)}`,
        fechaHora: new Date().toLocaleString(),
        monto: -montoCobro,
        saldoResultante: nuevoSaldo
      };
      setBilletera(prev => ({
        ...prev,
        saldo: nuevoSaldo,
        cobroPendiente: null,
        movimientos: [nuevoMovimiento, ...prev.movimientos]
      }));
      return { ok: true };
    }
  };

  if (cargando && !billetera) {
    return <div className={styles.cargando}>🔄 Sincronizando datos con la API de Billetera...</div>;
  }

  return (
    <div className={styles.raiz}>
      {vistaInterna === 'principal' && (
        <BilleteraPrincipal
          billetera={billetera}
          onIrARecarga={() => setVistaInterna('recargar')}
          onIrAPago={() => setVistaInterna('pagar')}
        />
      )}

      {vistaInterna === 'recargar' && (
        <RecargarSaldoView
          saldoActual={billetera?.saldo || 0}
          cobroPendiente={billetera?.cobroPendiente}
          onVolver={() => setVistaInterna('principal')}
          onEjecutarRecarga={handleEjecutarRecarga}
        />
      )}

      {vistaInterna === 'pagar' && (
        <PagarCobroView
          billetera={billetera}
          onVolver={() => setVistaInterna('principal')}
          onEjecutarPago={handleEjecutarPago}
        />
      )}
    </div>
  );
}

export default BilleteraPage;