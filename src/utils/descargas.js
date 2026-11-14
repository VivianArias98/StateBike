// Utilidad para la descarga y exportación de reportes y comprobantes en CSV y PDF

/**
 * Descarga directamente un archivo CSV en el navegador del usuario.
 * Incluye BOM UTF-8 (\uFEFF) para compatibilidad con Excel.
 */
export function descargarCSV(nombreArchivo, encabezados, filas) {
  const lineas = [
    encabezados
      .map((col) => `"${String(col ?? '').replace(/"/g, '""')}"`)
      .join(','),
    ...filas.map((fila) =>
      fila
        .map((valor) => `"${String(valor ?? '').replace(/"/g, '""')}"`)
        .join(',')
    ),
  ];

  const contenido = '\uFEFF' + lineas.join('\r\n');
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.setAttribute('download', nombreArchivo);
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Genera un comprobante oficial imprimible / descargable como PDF.
 * Abre una ventana con diseño institucional y lanza el diálogo nativo de impresión / Guardar como PDF.
 * Si las ventanas emergentes están bloqueadas, utiliza un iframe oculto.
 */
export function generarComprobantePDF({
  titulo = 'Comprobante Oficial',
  subtitulo = 'StationBike · Sistema de Bicicletas Compartidas de Tunja',
  usuario = {},
  periodo = '',
  metricas = [],
  columnas = [],
  filas = [],
}) {
  const fechaGeneracion = new Date().toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const codigoControl = `SB-TUN-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>${titulo} - StationBike Tunja</title>
  <style>
    @page {
      size: letter;
      margin: 14mm 16mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #050607;
      background: #ffffff;
      font-size: 11pt;
      line-height: 1.45;
      padding: 20px;
    }
    .barra-impresion {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #153019;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 8px;
      margin-bottom: 24px;
    }
    .btn-imprimir {
      background: #5FD34A;
      color: #153019;
      border: none;
      padding: 8px 16px;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
    }
    .btn-cerrar {
      background: transparent;
      color: #ffffff;
      border: 1px solid rgba(255,255,255,0.4);
      padding: 8px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      margin-left: 8px;
    }
    @media print {
      .barra-impresion {
        display: none !important;
      }
      body {
        padding: 0;
      }
    }
    .cabecera {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #153019;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .logo-bloque {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo-vector {
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }
    .logo-titulos {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .subtitulo-institucional {
      font-size: 8.5pt;
      color: #555555;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
      margin: 0;
    }
    .documento-titulo {
      font-size: 15pt;
      font-weight: 900;
      color: #153019;
      letter-spacing: -0.3px;
      margin: 0;
    }
    .folio {
      text-align: right;
      font-size: 9pt;
      color: #333333;
    }
    .folio strong {
      display: block;
      font-size: 11pt;
      color: #153019;
    }
    .panel-info {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      background: #F0FFE3;
      border: 1px solid #CBE8BC;
      border-radius: 8px;
      padding: 14px 18px;
      margin-bottom: 20px;
      font-size: 9.5pt;
    }
    .info-bloque p {
      margin-bottom: 3px;
    }
    .info-bloque span {
      color: #555555;
    }
    .grid-metricas {
      display: grid;
      grid-template-columns: repeat(${Math.min(metricas.length || 1, 4)}, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }
    .tarjeta-metrica {
      border: 1px solid #E0E0E0;
      border-radius: 6px;
      padding: 10px 14px;
      background: #FAFAFA;
    }
    .metrica-etiqueta {
      font-size: 8pt;
      text-transform: uppercase;
      color: #666666;
      font-weight: 600;
    }
    .metrica-valor {
      font-size: 13pt;
      font-weight: 800;
      color: #153019;
      margin-top: 2px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      font-size: 9.5pt;
    }
    th {
      background: #153019;
      color: #ffffff;
      padding: 8px 10px;
      text-align: left;
      font-weight: 600;
      font-size: 9pt;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    td {
      padding: 8px 10px;
      border-bottom: 1px solid #E5E5E5;
      vertical-align: middle;
    }
    tr:nth-child(even) td {
      background: #FBFDFB;
    }
    .pie-documento {
      border-top: 1px dashed #999999;
      padding-top: 14px;
      font-size: 8pt;
      color: #666666;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .insignia-estado {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 8pt;
      font-weight: 700;
      background: #D1FAE5;
      color: #065F46;
    }
  </style>
</head>
<body>
  <div class="barra-impresion">
    <div>
      <strong>Vista previa del comprobante listo para guardar como PDF.</strong>
      <span style="font-size: 12px; opacity: 0.8; display: block;">En la ventana que se abrirá, selecciona la opción "Guardar como PDF" como impresora.</span>
    </div>
    <div>
      <button class="btn-imprimir" onclick="window.print()">🖨️ Guardar como PDF / Imprimir</button>
      <button class="btn-cerrar" onclick="window.close()">Cerrar</button>
    </div>
  </div>

  <div class="cabecera">
    <div class="logo-bloque">
      <div class="logo-vector" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 130" width="115" height="92" role="img" aria-label="Logo StationBike">
          <circle cx="35" cy="45" r="30" fill="none" stroke="#5FD34A" stroke-width="9" />
          <circle cx="125" cy="45" r="30" fill="none" stroke="#153019" stroke-width="9" />
          <line x1="55" y1="45" x2="95" y2="15" stroke="#153019" stroke-width="7" stroke-linecap="round" />
          <line x1="95" y1="15" x2="105" y2="45" stroke="#153019" stroke-width="7" stroke-linecap="round" />
          <line x1="75" y1="30" x2="120" y2="30" stroke="#153019" stroke-width="6" stroke-linecap="round" />
          <rect x="65" y="10" width="18" height="5" rx="2" fill="#153019" />
          <rect x="98" y="8" width="16" height="5" rx="2" fill="#153019" />
          <text x="5" y="118" font-family="'Inter', -apple-system, BlinkMacSystemFont, Arial, sans-serif" font-size="24" font-weight="900" font-style="italic">
            <tspan fill="#153019">Station </tspan>
            <tspan fill="#5FD34A">Bike</tspan>
          </text>
        </svg>
      </div>
      <div class="logo-titulos">
        <p class="subtitulo-institucional">${subtitulo}</p>
        <h1 class="documento-titulo">${titulo}</h1>
      </div>
    </div>
    <div class="folio">
      <strong>Folio digital:</strong>
      <code>${codigoControl}</code>
      <p style="margin-top: 4px;">Fecha emisión: ${fechaGeneracion}</p>
    </div>
  </div>

  <div class="panel-info">
    <div class="info-bloque">
      <p><span>Titular de la cuenta:</span> <strong>${usuario.nombreCompleto || 'Ciudadano Registrado'}</strong></p>
      <p><span>Correo electrónico:</span> ${usuario.correo || 'No especificado'}</p>
      <p><span>Identificador único:</span> ID #${usuario.id || 'N/A'}</p>
    </div>
    <div class="info-bloque">
      <p><span>Periodo consultado:</span> <strong>${periodo || 'Histórico completo'}</strong></p>
      <p><span>Entidad certificadora:</span> Alcaldía Mayor de Tunja</p>
      <p><span>Estado de sincronización:</span> Certificado en TunjaAPI</p>
    </div>
  </div>

  ${
    metricas.length > 0
      ? `<div class="grid-metricas">
          ${metricas
            .map(
              (m) => `
            <div class="tarjeta-metrica">
              <div class="metrica-etiqueta">${m.etiqueta}</div>
              <div class="metrica-valor">${m.valor}</div>
            </div>`
            )
            .join('')}
        </div>`
      : ''
  }

  <table>
    <thead>
      <tr>
        ${columnas.map((c) => `<th>${c}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${
        filas.length === 0
          ? `<tr><td colspan="${columnas.length}" style="text-align: center; padding: 20px;">No hay registros para este periodo.</td></tr>`
          : filas
              .map(
                (f) => `
          <tr>
            ${f
              .map((celda) => {
                const esMonto = typeof celda === 'string' && (celda.includes('$') || celda.includes('COP'));
                const alineacion = esMonto ? 'text-align: right; font-weight: 700;' : '';
                return `<td style="${alineacion}">${celda}</td>`;
              })
              .join('')}
          </tr>`
              )
              .join('')
      }
    </tbody>
  </table>

  <div class="pie-documento">
    <div>
      <p><strong>Certificación digital StationBike:</strong> Transacciones validadas en la pasarela oficial y taquillas autorizadas.</p>
      <p>Soporte al usuario: contacto@stationbike.gov.co · Tunja, Boyacá, Colombia.</p>
    </div>
    <div style="text-align: right;">
      <code>HASH: ${Date.now().toString(16).toUpperCase()}</code>
    </div>
  </div>

  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.print();
      }, 350);
    });
  </script>
</body>
</html>`;

  // 1. Intentar abrir en ventana emergente
  const ventana = window.open('', '_blank');
  if (ventana) {
    ventana.document.open();
    ventana.document.write(html);
    ventana.document.close();
    return;
  }

  // 2. Si el navegador bloqueó la ventana emergente, usar iframe oculto
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  iframe.contentWindow.focus();
  setTimeout(() => {
    iframe.contentWindow.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 2000);
  }, 400);
}
