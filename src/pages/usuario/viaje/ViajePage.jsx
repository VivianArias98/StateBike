import React, { useState, useEffect } from 'react';
import ViajeEnCursoView from './components/ViajeEnCursoView';
import styles from './ViajePage.module.css';

function ViajePage() {
  const [viajeActivo, setViajeActivo] = useState({
    idViaje: '#VJ-2026-88392',
    idBicicleta: 'BIC-003',
    estacionOrigen: 'Estación Centro (Anclaje 03)',
    direccion: 'Cra. 10 #20-15',
    horaInicio: '14:32:00',
    idUsuario: '#TUN-8831',
    estado: 'EN CURSO',
    minutosIncluidos: 40,
    minutosTranscurridos: 29,
    segundosTranscurridos: 47,
    porcentajeUsado: 74,
    tiempoRestante: '10:15'
  });

  // Simulación de cronómetro en vivo
  useEffect(() => {
    const timer = setInterval(() => {
      setViajeActivo(prev => {
        let nuevosSegs = prev.segundosTranscurridos + 1;
        let nuevosMins = prev.minutosTranscurridos;
        if (nuevosSegs >= 60) {
          nuevosSegs = 0;
          nuevosMins += 1;
        }
        return {
          ...prev,
          minutosTranscurridos: nuevosMins,
          segundosTranscurridos: nuevosSegs
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDevolverBicicleta = () => {
    alert('Iniciando proceso de devolución de bicicleta en dock libre...');
    // Aquí puedes conectar el endpoint de devolución de la API del profesor
  };

  const handleReportarIncidencia = () => {
    alert('Abriendo módulo de reporte de incidencias...');
  };

  return (
    <div className={styles.raiz}>
      <ViajeEnCursoView 
        viaje={viajeActivo}
        onDevolver={handleDevolverBicicleta}
        onReportar={handleReportarIncidencia}
      />
    </div>
  );
}

export default ViajePage;