import { useState, useEffect, useRef } from 'react';
import styles from './SelectorFechaNacimiento.module.css';

const NOMBRES_MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const MESES_CORTOS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

const DIAS_SEMANA = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

function esMenorDeEdad(fechaTexto) {
  if (!fechaTexto || !/^\d{4}-\d{2}-\d{2}$/.test(fechaTexto)) return false;
  const [anio, mes, dia] = fechaTexto.split('-').map(Number);
  const hoy = new Date();
  let edad = hoy.getFullYear() - anio;
  const mesActual = hoy.getMonth() + 1;
  const yaCumplio = mesActual > mes || (mesActual === mes && hoy.getDate() >= dia);
  if (!yaCumplio) edad -= 1;
  return edad < 18;
}

function formatearAVisual(fechaBackend) {
  if (!fechaBackend || !/^\d{4}-\d{2}-\d{2}$/.test(fechaBackend)) return '';
  const [a, m, d] = fechaBackend.split('-');
  return `${d} / ${m} / ${a}`;
}

function SelectorFechaNacimiento({ valor = '', onChange, onFocus, id = 'nacimiento' }) {
  const anioActual = new Date().getFullYear();
  const anioMayorEdad = anioActual - 18; // ej. 2008
  const anioMinimo = anioActual - 100; // ej. 1926

  // Lista de años para la grilla visual (descendente desde el año actual hasta el mínimo)
  const anios = [];
  for (let a = anioActual; a >= anioMinimo; a--) {
    anios.push(a);
  }

  // Estado del texto escrito en el input (DD / MM / AAAA)
  const [textoInput, setTextoInput] = useState(() => formatearAVisual(valor));
  const [avisoFormato, setAvisoFormato] = useState('');
  const [calendarioAbierto, setCalendarioAbierto] = useState(false);

  // Modo de vista del calendario: 'dias' | 'meses' | 'anios'
  const [modoVista, setModoVista] = useState('dias');

  // Estado de navegación del calendario
  const [mesVista, setMesVista] = useState(() => {
    if (valor && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      return Number(valor.split('-')[1]) - 1;
    }
    return 0; // Enero
  });

  const [anioVista, setAnioVista] = useState(() => {
    if (valor && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      return Number(valor.split('-')[0]);
    }
    return anioMayorEdad; // Iniciar en el año de mayoría de edad (2008)
  });

  const contenedorRef = useRef(null);
  const inputRef = useRef(null);

  // Sincronizar texto visual si el valor backend cambia externamente
  useEffect(() => {
    setTextoInput(formatearAVisual(valor));
    if (valor && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      const [a, m] = valor.split('-').map(Number);
      setAnioVista(a);
      setMesVista(m - 1);
    }
  }, [valor]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function manejarClicFuera(evento) {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target)) {
        setCalendarioAbierto(false);
        setModoVista('dias');
      }
    }
    if (calendarioAbierto) {
      document.addEventListener('mousedown', manejarClicFuera);
      document.addEventListener('touchstart', manejarClicFuera);
    }
    return () => {
      document.removeEventListener('mousedown', manejarClicFuera);
      document.removeEventListener('touchstart', manejarClicFuera);
    };
  }, [calendarioAbierto]);

  function manejarKeyDown(e) {
    if (e.key === 'Backspace') {
      const val = textoInput;
      // Si termina en ' / ', borrar también el espacio y la barra
      if (val.endsWith(' / ')) {
        e.preventDefault();
        const nuevo = val.slice(0, -3);
        setTextoInput(nuevo);
        setAvisoFormato('');
        if (valor) onChange('');
      }
    }
  }

  // Manejo de entrada de teclado con máscara inteligente (DD / MM / AAAA)
  function manejarCambioTexto(e) {
    onFocus?.();
    setAvisoFormato('');
    const entrada = e.target.value;
    const previo = textoInput;

    // Si el usuario está borrando hacia atrás
    if (entrada.length < previo.length) {
      setTextoInput(entrada);
      if (valor) onChange('');
      return;
    }

    // Si el usuario tecleó una barra manual '/', '-', '.' o espacio ' ' para separar
    if (
      entrada.endsWith('/') ||
      entrada.endsWith('-') ||
      entrada.endsWith('.') ||
      entrada.endsWith(' ')
    ) {
      const digitosLimpios = entrada.replace(/\D/g, '');
      if (digitosLimpios.length === 1) {
        // Ej: tecleó '5/' -> '05 / '
        setTextoInput(`0${digitosLimpios} / `);
        return;
      }
      if (digitosLimpios.length === 2) {
        // Ej: tecleó '12/' -> '12 / '
        setTextoInput(`${digitosLimpios} / `);
        return;
      }
      if (digitosLimpios.length === 3) {
        // Ej: tecleó '12 / 5/' -> '12 / 05 / '
        setTextoInput(`${digitosLimpios.slice(0, 2)} / 0${digitosLimpios.slice(2)} / `);
        return;
      }
      if (digitosLimpios.length === 4) {
        // Ej: tecleó '12 / 05/' -> '12 / 05 / '
        setTextoInput(`${digitosLimpios.slice(0, 2)} / ${digitosLimpios.slice(2, 4)} / `);
        return;
      }
    }

    // Solo permitir números (máximo 8 dígitos: DDMMAAAA)
    const digitos = entrada.replace(/\D/g, '').slice(0, 8);

    let formateado = '';
    if (digitos.length === 0) {
      formateado = '';
    } else if (digitos.length === 1) {
      // Si el primer dígito del día es 4..9, no puede existir día de 2 dígitos (días van hasta 31),
      // así que se auto-completa como '0X / '
      if (digitos[0] >= '4') {
        formateado = `0${digitos[0]} / `;
      } else {
        formateado = digitos;
      }
    } else if (digitos.length === 2) {
      // Al ingresar los 2 dígitos del día, agregar automáticamente ' / '
      let dNum = Number(digitos);
      if (dNum > 31) {
        setAvisoFormato('El día debe estar entre 01 y 31');
        dNum = 31;
      }
      if (dNum === 0) dNum = 1;
      formateado = `${String(dNum).padStart(2, '0')} / `;
    } else if (digitos.length === 3) {
      // Tenemos día (2 dígitos) + primer dígito del mes.
      const primerDigitoMes = digitos[2];
      // Si el primer dígito del mes es 2..9, no puede existir un mes 20..99 (meses van de 01 a 12).
      // Por tanto, '5' se convierte automáticamente en '05 / '
      if (primerDigitoMes >= '2') {
        formateado = `${digitos.slice(0, 2)} / 0${primerDigitoMes} / `;
      } else {
        formateado = `${digitos.slice(0, 2)} / ${primerDigitoMes}`;
      }
    } else if (digitos.length === 4) {
      let mNum = Number(digitos.slice(2, 4));
      if (mNum > 12) {
        setAvisoFormato('El mes debe estar entre 01 y 12');
        mNum = 12;
      }
      if (mNum === 0) mNum = 1;
      formateado = `${digitos.slice(0, 2)} / ${String(mNum).padStart(2, '0')} / `;
    } else {
      formateado = `${digitos.slice(0, 2)} / ${digitos.slice(2, 4)} / ${digitos.slice(4)}`;
    }

    setTextoInput(formateado);

    // Si tiene los 8 dígitos (DDMMAAAA), validar y emitir al backend
    if (digitos.length === 8) {
      const d = Number(digitos.slice(0, 2));
      const m = Number(digitos.slice(2, 4));
      const a = Number(digitos.slice(4, 8));

      // Validar mes y día
      if (m >= 1 && m <= 12 && a >= 1900 && a <= anioActual) {
        const diasEnMes = new Date(a, m, 0).getDate();
        if (d >= 1 && d <= diasEnMes) {
          const dStr = String(d).padStart(2, '0');
          const mStr = String(m).padStart(2, '0');
          const fechaIso = `${a}-${mStr}-${dStr}`;
          setAnioVista(a);
          setMesVista(m - 1);
          onChange(fechaIso);
          return;
        } else {
          setAvisoFormato(`Ese mes solo tiene ${diasEnMes} días`);
        }
      }
    }

    // Si no está completo o es inválido, avisar fecha vacía
    if (valor) {
      onChange('');
    }
  }

  function aplicarFecha(diaNum, mesIndex, anioNum) {
    const dStr = String(diaNum).padStart(2, '0');
    const mStr = String(mesIndex + 1).padStart(2, '0');
    const fechaIso = `${anioNum}-${mStr}-${dStr}`;

    setTextoInput(`${dStr} / ${mStr} / ${anioNum}`);
    setAnioVista(anioNum);
    setMesVista(mesIndex);
    setCalendarioAbierto(false);
    setModoVista('dias');
    onChange(fechaIso);
  }

  // Navegación de meses
  function mesAnterior() {
    if (mesVista === 0) {
      setMesVista(11);
      setAnioVista((a) => a - 1);
    } else {
      setMesVista((m) => m - 1);
    }
  }

  function mesSiguiente() {
    if (mesVista === 11) {
      setMesVista(0);
      setAnioVista((a) => a + 1);
    } else {
      setMesVista((m) => m + 1);
    }
  }

  // Cuadrícula del mes actual
  const diasEnMes = new Date(anioVista, mesVista + 1, 0).getDate();
  const primerDiaSemana = new Date(anioVista, mesVista, 1).getDay();
  // Lunes=0, Domingo=6
  const offsetDias = (primerDiaSemana + 6) % 7;

  // Fecha seleccionada actual
  const [anioSel, mesSel, diaSel] = valor && valor.includes('-')
    ? valor.split('-').map(Number)
    : [null, null, null];

  return (
    <div className={styles.raiz} ref={contenedorRef}>
      <div className={styles.campoControl}>
        <input
          ref={inputRef}
          id={`${id}-dia`}
          type="text"
          inputMode="numeric"
          className={`input ${styles.entrada}`}
          placeholder="DD / MM / AAAA"
          value={textoInput}
          onChange={manejarCambioTexto}
          onKeyDown={manejarKeyDown}
          onFocus={onFocus}
          autoComplete="bday"
        />

        <button
          type="button"
          className={styles.botonCalendario}
          onClick={() => {
            onFocus?.();
            setCalendarioAbierto((prev) => !prev);
            setModoVista('dias');
          }}
          title={calendarioAbierto ? 'Cerrar calendario' : 'Abrir calendario para elegir fecha'}
          aria-label="Abrir calendario interactivo"
          aria-expanded={calendarioAbierto}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.iconoCalendario}
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>
      </div>

      {avisoFormato && (
        <p className={styles.avisoMenor} role="alert">
          {avisoFormato}
        </p>
      )}

      {esMenorDeEdad(valor) && (
        <p className={styles.avisoMenor} role="alert">
          Debe ser mayor de edad para poder crear una cuenta
        </p>
      )}

      {/* Calendario emergente interactivo integrado */}
      {calendarioAbierto && (
        <div className={styles.popover} role="dialog" aria-label="Selector de fecha">
          {/* Barra superior con selector rápido de Mes y Año */}
          <div className={styles.cabecera}>
            <button
              type="button"
              className={styles.btnFlecha}
              onClick={mesAnterior}
              title="Mes anterior"
              aria-label="Mes anterior"
            >
              ‹
            </button>

            <div className={styles.titulosCabecera}>
              <button
                type="button"
                className={`${styles.btnTitulo} ${modoVista === 'meses' ? styles.activo : ''}`}
                onClick={() => setModoVista(modoVista === 'meses' ? 'dias' : 'meses')}
                title="Elegir mes"
              >
                {NOMBRES_MESES[mesVista]} ▾
              </button>

              <button
                type="button"
                className={`${styles.btnTitulo} ${modoVista === 'anios' ? styles.activo : ''}`}
                onClick={() => setModoVista(modoVista === 'anios' ? 'dias' : 'anios')}
                title="Elegir año rápidamente"
              >
                {anioVista} ▾
              </button>
            </div>

            <button
              type="button"
              className={styles.btnFlecha}
              onClick={mesSiguiente}
              title="Mes siguiente"
              aria-label="Mes siguiente"
            >
              ›
            </button>

            <button
              type="button"
              className={styles.btnCerrar}
              onClick={() => setCalendarioAbierto(false)}
              aria-label="Cerrar calendario"
            >
              ×
            </button>
          </div>

          {/* VISTA 1: Selector rápido de AÑO en cuadrícula compacta y limpia */}
          {modoVista === 'anios' && (
            <div className={styles.contenedorAnios}>
              <p className={styles.instruccionVista}>Selecciona tu año de nacimiento:</p>
              <div className={styles.grillaAnios}>
                {anios.map((a) => {
                  const esSeleccionado = a === anioVista;
                  return (
                    <button
                      key={a}
                      type="button"
                      className={`${styles.btnPill} ${esSeleccionado ? styles.pillSeleccionada : ''}`}
                      onClick={() => {
                        setAnioVista(a);
                        setModoVista('dias');
                      }}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* VISTA 2: Selector rápido de MES en 12 cuadrículas */}
          {modoVista === 'meses' && (
            <div className={styles.contenedorMeses}>
              <p className={styles.instruccionVista}>Selecciona el mes:</p>
              <div className={styles.grillaMeses}>
                {MESES_CORTOS.map((mCorto, idx) => {
                  const esSeleccionado = idx === mesVista;
                  return (
                    <button
                      key={mCorto}
                      type="button"
                      className={`${styles.btnPill} ${esSeleccionado ? styles.pillSeleccionada : ''}`}
                      onClick={() => {
                        setMesVista(idx);
                        setModoVista('dias');
                      }}
                    >
                      {NOMBRES_MESES[idx]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* VISTA 3: Cuadrícula normal de DÍAS */}
          {modoVista === 'dias' && (
            <>
              <div className={styles.semana}>
                {DIAS_SEMANA.map((d) => (
                  <span key={d} className={styles.diaSemana}>
                    {d}
                  </span>
                ))}
              </div>

              <div className={styles.grillaDias}>
                {Array.from({ length: offsetDias }).map((_, i) => (
                  <span key={`v-${i}`} className={styles.diaVacio} />
                ))}

                {Array.from({ length: diasEnMes }, (_, i) => i + 1).map((dNum) => {
                  const esSeleccionado =
                    dNum === diaSel &&
                    mesVista === (mesSel - 1) &&
                    anioVista === anioSel;

                  return (
                    <button
                      key={dNum}
                      type="button"
                      className={`${styles.btnDia} ${esSeleccionado ? styles.diaActivo : ''}`}
                      onClick={() => aplicarFecha(dNum, mesVista, anioVista)}
                    >
                      {dNum}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Pie del calendario con atajo rápido para cumplir 18 años */}
          <div className={styles.pie}>
            <button
              type="button"
              className={styles.btnAtajo18}
              onClick={() => {
                const hoy = new Date();
                aplicarFecha(hoy.getDate(), hoy.getMonth(), anioMayorEdad);
              }}
            >
              Cumple 18 años ({anioMayorEdad})
            </button>
            <span className={styles.pistaFormato}>O escribe directamente en la casilla</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectorFechaNacimiento;
