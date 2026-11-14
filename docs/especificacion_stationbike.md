# Especificación y Guías Maestras de StationBike

Documento de referencia centralizado basado en la documentación oficial de requisitos (Universidad de Boyacá), historias de usuario, catálogo de módulos y guías técnicas de Backend, CSS y Mapas.

---

## 1. Reglas de Oro de Arquitectura y Desarrollo

### A. Backend (`server/`)
1. **Flujo estricto en capas:** `routes → controllers → services → repositories → SQLite / TunjaAPI`.
   - **Controladores:** Delgados, solo leen `req` y responden `res`.
   - **Servicios:** Contienen las reglas de negocio y validaciones en el orden exacto de las HU.
   - **Repositorios:** Solo consultas SQL (`better-sqlite3`), preparadas dentro de cada función. Transacciones con `db.transaction`.
2. **Dos fuentes de verdad:**
   - **TunjaAPI** (`https://nfc.multimediaudeb.com/api/v1`): Cuentas, contraseñas cifradas, tokens JWT, saldo, recargas/cobros en billetera, y tarjetas NFC en hardware. Es el único punto de contacto con `clients/tunja.client.js` usando `TUNJA_CLAVE`.
   - **SQLite** (`server/data/stationbike.db`): Roles (`perfiles`), estaciones, anclajes, bicicletas, planes de suscripción, tarjetas registradas localmente y viajes.
3. **Manejo de Errores y Mensajes:**
   - Errores lanzados con `throw new AppError(status, 'codigo_en_snake_case')`.
   - Textos de usuario centralizados en `server/src/utils/mensajes.js`. **Prohibido inventar textos:** deben coincidir carácter por carácter con las Historias de Usuario.
4. **Seguridad y Permisos:**
   - Rutas de admin protegidas con `autenticar, requerirRol('ADMINISTRADOR')`.
   - Rutas `/api/interno` protegidas con `requerirClaveInterna` (header `X-Clave-Interna` compartido con la API NFC). Sin sesión de usuario.

---

### B. Frontend y CSS (`src/`)
1. **Modularidad CSS:**
   - Cada componente tiene su propio `Nombre.module.css` (`import styles from './Nombre.module.css'`).
   - Clases en `camelCase` sin prefijos (`styles.raiz`, `styles.titulo`).
2. **Sistema de Tokens Semánticos (`src/index.css`):**
   - **Prohibido escribir colores a mano:** Nada de `#hex`, `rgb()`, `rgba()` ni nombres en `.module.css`. Solo `var(--color-...)`.
   - Prohibido usar `--paleta-*` fuera de `src/index.css`.
   - Espaciados (`--espacio-1` a `--espacio-8`), tipografía (`--texto-xs` a `--texto-5xl`), radios (`--radio-s`, `-m`, `-l`, `-circulo`), alturas (`--alto-control`, `--alto-fila`).
3. **Clases Globales Reutilizables:**
   - Usar clases de `index.css`: `boton` (`boton--primario`, `boton--secundario`, `boton--acento`), `input`, `campo`, `tarjeta`, `tabla`, `insignia`, `punto-vivo`, `contexto-oscuro`.
4. **Componentes Compartidos (`src/components/`):**
   - No recrear: `Etiqueta`, `BarraProgreso`, `MapaTunja`, `Iconos`, `Avisos`.
5. **Mobile-First Responsivo:**
   - Estilos base para móvil. Breakpoints únicos: `@media (min-width: 768px)` (tablet) y `@media (min-width: 1024px)` (desktop).
6. **Tema Oscuro:**
   - Compatible mediante `document.documentElement.dataset.tema = 'oscuro'` utilizando los tokens semánticos correspondientes.

---

### C. Componente de Mapa (`MapaTunja`)
1. Componente puramente presentacional basado en `leaflet` y `react-leaflet`.
2. Centro Tunja: `TUNJA_CENTRO = [5.5353, -73.3678]`, Límites: `[[5.49, -73.42], [5.58, -73.32]]`.
3. Coordenadas siempre en orden `[latitud, longitud]`.
4. Muestra marcadores de estaciones con círculo de bicicletas disponibles (`Number(bicicletas) || 0`) y nombre en tooltip permanente.
5. Permite punto seleccionable (`onSeleccionar(lat, lng)` y arrastrable).
6. Los créditos de atribución de Leaflet deben permanecer visibles siempre.
7. Altura configurable mediante variable CSS `--alto-mapa`.

---

### D. Estándar de Commits (Conventional Commits)
Para mantener la trazabilidad e historial claro de los cambios, el equipo aplicará la convención de mensajes estructurados utilizando los siguientes prefijos estándar:
* **`feat:`** Implementación de nuevas funcionalidades (ej. `feat(front): ...`, `feat: ...`).
* **`fix:`** Solución o corrección de errores (bugs) (ej. `fix(front): ...`, `fix: ...`).
* **`docs:`** Cambios o adiciones en la documentación.
* **`refactor:`** Reestructuración o reescritura del código sin alterar su comportamiento.
* **`test:`** Adición o modificación de pruebas unitarias o de integración.

---

## 2. Matriz de Historias de Usuario (HU_1 a HU_26)

| No. HU | Rol | Módulo / Funcionalidad | Peso | Descripción y Reglas Clave |
| :--- | :--- | :--- | :--- | :--- |
| **HU_1** | Usuario | Gestionar perfil | Bajo | Consulta y edición de nombre, teléfono y contraseña (mín 8 caract., letras y números). Documento y nacimiento no editables. Consulta de últimos dígitos de tarjeta NFC vinculada. Bloquear/Desbloquear tarjeta con confirmación (no permite bloquear con viaje en curso). Tarjeta bloqueada no abre anclajes pero plan sigue activo. |
| **HU_2** | Usuario | Adquirir o cancelar un plan | Alto | Compra con saldo de billetera. Precondiciones: tarjeta NFC activa vinculada y sin plan vigente. Descuenta saldo, activa inmediatamente (fecha inicio a fecha fin). Cancelación inmediata sin reembolso, requiere confirmación y sin viaje en curso. Un cobro pendiente sobrevive a la cancelación. Vencimiento automático. |
| **HU_3** | Usuario | Desbloquear bicicleta e iniciar viaje | Alto | Lector NFC en anclaje. Valida: tarjeta activa, plan vigente, viajes disponibles del día, sin cobro pendiente, sin otro viaje en curso, bici DISPONIBLE. Envía orden de desbloqueo, bici pasa a `EN_USO`, anclaje a `LIBRE`. Mensaje de confirmación: *"VIAJE INICIADO. ¡BUEN RECORRIDO! Tiene [N] minutos incluidos en su plan"*. |
| **HU_4** | Usuario | Devolver bicicleta y finalizar viaje | Alto | Encajar en anclaje libre de estación ACTIVE y confirmar con tarjeta NFC del viaje. Valida sensor de bloqueo. Calcula duración y exceso (redondeo hacia arriba al minuto iniciado). Cobro: minutos exceso × tarifa plan (tope $5.000 por viaje). Se descuenta del saldo; si falta saldo, cobro pasa a `PENDIENTE` y bloquea nuevos viajes. Bici pasa a `DISPONIBLE`, anclaje a `OCUPADO`. |
| **HU_5** | Usuario | Consultar historial de viajes y pagos | Bajo | Consulta por rango de fechas (fecha fin no menor a inicio). Viajes: origen, destino, duración, exceso, cobro. Pagos: recargas, compras de plan, cobros por exceso (tipo, monto, pagado/pendiente). Ordenados del más reciente al más antiguo. |
| **HU_6** | Usuario | Reportar daño o incidencia | Medio | Tipos: daño en bicicleta, daño en anclaje/estación, tarjeta NFC perdida/dañada u otro. Bici o estación obligatoria salvo para tarjeta NFC. Descripción máx 500. Registra estado `ABIERTA`. |
| **HU_7** | Visitante | Registrar cuenta de usuario | Alto | Nombre completo, fecha nacimiento (mayor de 18 años), correo único, contraseña (mín 8, letras y números), confirmación idéntica, aceptación de términos. Contraseña cifrada, rol `USUARIO`, estado `ACTIVE`, saldo $0, sin tarjeta ni plan. Redirige a login. |
| **HU_8** | Visitante | Iniciar sesión | Alto | Valida correo y contraseña en TunjaAPI. Valida estado `ACTIVE`. Guarda fecha/hora acceso. Redirige: Administrador a su Panel de Control, Usuario al inicio con mapa de estaciones. |
| **HU_9** | Visitante | Consultar mapa y disponibilidad | Medio | Mapa y lista de estaciones exclusivamente `ACTIVE`. Muestra bicis disponibles y anclajes libres. Buscador por nombre. Alerta al intentar retirar: *"Para usar una bicicleta debe registrarse e iniciar sesión"*. |
| **HU_10**| Visitante | Consultar planes y tarifas | Bajo | Catálogo público: nombre, costo base (COP), vigencia en días, viajes/día, tiempo/viaje y valor min exceso. Al elegir plan pide iniciar sesión/registrarse. |
| **HU_11**| Admin | Registrar estación y puntos físicos | Alto | Nombre único (máx 70), dirección (máx 70), capacidad (entero > 0), punto en mapa de Tunja. Genera anclajes `LIBRE` automáticamente (`ANC-xxx-xx`). Estado inicial `ACTIVE`. |
| **HU_12**| Admin | Modificar estación | Medio | Edita nombre, dirección y ubicación de estaciones `ACTIVE`. Id y número de anclajes bloqueados. Estaciones `INACTIVE` tienen botón de editar deshabilitado. |
| **HU_13**| Admin | Inactivar estación | Medio | Solo se puede inactivar si NO tiene bicicletas en sus anclajes. Modal de confirmación. Pasa a `INACTIVE`, no se borra. Viajes abiertos que salieron de ella no se cancelan. |
| **HU_14**| Admin | Registrar bicicleta | Medio | Código único (máx 20), estación `ACTIVE` con anclajes libres. Asigna automáticamente el anclaje libre menor, anclaje pasa a `OCUPADO`, bici a `DISPONIBLE`. |
| **HU_15**| Admin | Gestionar catálogo de planes y tarifas | Alto | Costo base (mín $100), vigencia días (> 0), viajes por día (> 0), tiempo viaje min (> 0), valor minuto exceso ($0 o mín $100). Catálogo inicial: Diario ($4.000, 1d, 2v, 30m), Mensual ($32.000, 30d, 4v, 45m), Semestral ($150.000, 180d, 4v, 45m), Anual ($240.000, 365d, 4v, 60m). Exceso $100/min en todos. Tope exceso por viaje: $5.000. |
| **HU_16**| Visitante | Información institucional (Acerca de) | Bajo | Contenido estático: quiénes somos, misión, visión, valores, equipo (Vivian Arias, Yeimy Martínez, Theofilo Mendes, Joel Báez, Jenifer Nossa) y contacto. |
| **HU_17**| Usuario | Consultar mi plan | Bajo | Muestra plan actual (nombre, costo, fechas, días restantes con barra, pagos, tarjeta asociada). Debajo catálogo indicando *"TU PLAN ACTUAL"*. Si no tiene plan, muestra *"No tiene un plan activo"*. |
| **HU_18**| Admin | Vincular y desvincular tarjeta NFC | Alto | Vincular: UID hexadecimal (4 a 32 caracteres, máx 20 guardados), una tarjeta por usuario. La tarjeta nace `ACTIVA`. Si el usuario tiene plan activo, se asocia a la nueva tarjeta. Desvincular: no permite con viaje en curso; tarjeta pasa a `SIN VINCULAR`; el plan activo no se cancela ni se detiene. |
| **HU_19**| Admin | Gestionar incidencias | Medio | Lista con `ABIERTA` primero. Atender con observación (pasa a `ATENDIDA`). Cerrar con confirmación (pasa a `CERRADA`). No se puede cerrar sin haber atendido primero. Incidencias nunca se borran. |
| **HU_20**| Admin | Consultar, modificar e inactivar bicicleta | Medio | Lista con buscador por código. Modificar: alterna solo entre `DISPONIBLE` y `MANTENIMIENTO` (código bloqueado). Inactivar: pasa a `INACTIVA`, libera anclaje y cupos. No permite editar ni inactivar si está `EN_USO`. Nunca se borra el registro. |
| **HU_21**| Admin | Gestionar cuentas de usuario | Medio | Lista de cuentas con buscador por correo. Inactivar / Reactivar con confirmación. No permite inactivar con viaje en curso ni la propia cuenta del administrador. Cuenta `INACTIVE` no puede iniciar sesión. |
| **HU_22**| Admin | Panel de control del administrador | Medio | Resumen en tiempo real: viajes en curso, estaciones activas/inactivas, bicicletas disponibles, incidencias abiertas, ocupación de anclajes y 5 incidencias recientes. Accesos a los 6 módulos: Estaciones, Bicicletas, Planes, Tarjetas NFC, Incidencias, Cuentas. |
| **HU_23**| Usuario | Consultar billetera | Medio | Saldo en COP, alerta de cobro pendiente con botón de pago, lista de movimientos ordenada de más reciente a más antiguo (tipo, concepto, monto, saldo resultante, fecha). Botón recargar. |
| **HU_24**| Usuario | Recargar saldo | Alto | Monto entero entre $100 y $500.000. Saldo resultante máximo $2.000.000. Sin pasarela de pagos externa. No salda automáticamente un cobro pendiente (debe pagarse explícitamente). |
| **HU_25**| Usuario | Pagar cobro pendiente | Alto | Muestra valor del cobro y saldo disponible. Descuenta el valor total del saldo (sin pagos parciales). Pasa a `PAGADO` y rehabilita el retiro de bicicletas. |
| **HU_26**| Visitante | Cómo usar el servicio | Bajo | Guía paso a paso (1 a 8), reglas clave (viaje a la vez, límites diarios, exceso y topes, no cobro por km, tarjeta bloqueada, plan vencido, sin reembolso) y preguntas frecuentes. |

---

## 3. Catálogo Oficial de Mensajes del Sistema

### Mensajes de Éxito / Confirmación
* `"CUENTA CREADA CON ÉXITO"`
* `"Estación registrada con éxito"`
* `"Estación modificada con éxito"`
* `"La estación ha sido inactivada de forma correcta"`
* `"REGISTRO DE BICICLETA EXITOSO"`
* `"BICICLETA ACTUALIZADA CORRECTAMENTE"`
* `"BICICLETA INACTIVADA CORRECTAMENTE"`
* `"Plan guardado y actualizado correctamente"`
* `"TARJETA VINCULADA CORRECTAMENTE"`
* `"TARJETA DESVINCULADA CORRECTAMENTE"`
* `"TARJETA BLOQUEADA CORRECTAMENTE"`
* `"TARJETA DESBLOQUEADA CORRECTAMENTE"`
* `"PERFIL ACTUALIZADO CORRECTAMENTE"`
* `"PLAN ADQUIRIDO CON ÉXITO"`
* `"PLAN CANCELADO CORRECTAMENTE"`
* `"VIAJE INICIADO. ¡BUEN RECORRIDO! Tiene [N] minutos incluidos en su plan"`
* `"VIAJE FINALIZADO CON ÉXITO"`
* `"VIAJE FINALIZADO CON ÉXITO. Tiempo excedido: [N] min. Cobro: [$X]"`
* `"REPORTE ENVIADO CON ÉXITO"`
* `"INCIDENCIA ATENDIDA CORRECTAMENTE"`
* `"INCIDENCIA CERRADA CORRECTAMENTE"`
* `"CUENTA INACTIVADA CORRECTAMENTE"`
* `"CUENTA REACTIVADA CORRECTAMENTE"`
* `"RECARGA EXITOSA"`
* `"COBRO PENDIENTE PAGADO CORRECTAMENTE"`

### Mensajes de Error y Validación
* `"Hay campos obligatorios vacíos"` / `"Campos obligatorios vacíos"`
* `"Correo inválido"`
* `"La contraseña no cumple los requisitos"`
* `"Las contraseñas no coinciden"`
* `"Debe ser mayor de edad para registrarse"`
* `"Debe aceptar los términos y condiciones para registrarse"`
* `"El correo ya se encuentra registrado"`
* `"Correo o contraseña incorrectos"`
* `"La cuenta se encuentra inactiva. Contacte al administrador"`
* `"No tiene permisos para acceder a esta sección"`
* `"Descripción inválida (nombre máx 70, dirección máx 70)"`
* `"Número inválido"`
* `"Ubicación Inválida"`
* `"El nombre de la estación ya se encuentra registrado"`
* `"La estación tiene bicicletas asignadas, reubíquelas antes de inactivar"`
* `"El código de la bicicleta ya se encuentra registrado"`
* `"La estación no tiene anclajes libres"`
* `"La bicicleta está en uso"`
* `"Error: Verifique que el costo base sea un entero mínimo de $100 y el valor por minuto de exceso sea $0 o mínimo $100"`
* `"Error: La vigencia, los viajes por día y el tiempo por viaje deben ser números enteros mayores a cero"`
* `"El nombre del plan ya se encuentra registrado"`
* `"El usuario ya tiene una tarjeta vinculada"`
* `"La tarjeta ya está vinculada a otro usuario"`
* `"El usuario no tiene una tarjeta vinculada"`
* `"No tiene una tarjeta NFC vinculada"`
* `"No se puede desvincular con un viaje en curso"`
* `"No puede bloquear la tarjeta con un viaje en curso"`
* `"Tarjeta no vinculada o bloqueada"`
* `"No se pudo leer la tarjeta. Intente de nuevo"`
* `"Ya tiene un plan activo"`
* `"Su plan ha vencido"`
* `"Debe tener una tarjeta NFC activa para adquirir un plan"`
* `"Saldo insuficiente para adquirir el plan. Le faltan $X. Recargue su saldo en MI BILLETERA"`
* `"No puede cancelar con un viaje en curso"`
* `"Alcanzó el límite de viajes de su plan por hoy"`
* `"Tiene un pago pendiente por exceso de tiempo. Recargue su saldo para continuar"`
* `"Ya tiene un viaje en curso"`
* `"La bicicleta no está disponible"`
* `"No se detectó el bloqueo de la bicicleta. Verifique que esté bien encajada"`
* `"La tarjeta no corresponde al viaje en curso"`
* `"El cobro por exceso quedó pendiente. Recargue su saldo para volver a usar el servicio"`
* `"La fecha final no puede ser anterior a la inicial"`
* `"Indique la bicicleta o la estación involucrada"`
* `"Debe atender la incidencia antes de cerrarla"`
* `"No puede inactivar una cuenta con viaje en curso"`
* `"Monto inválido"`
* `"El monto debe estar entre $100 y $500.000"`
* `"La recarga supera el saldo máximo permitido de $2.000.000"`
* `"No tiene cobros pendientes"`
* `"Saldo insuficiente. Le faltan $X. Recargue su saldo"`

### Mensajes Informativos
* `"No hay estaciones registradas"`
* `"No hay estaciones disponibles"`
* `"No se encontraron estaciones con ese nombre"`
* `"Para usar una bicicleta debe registrarse e iniciar sesión"`
* `"No hay planes disponibles por el momento"`
* `"Para adquirir un plan debe registrarse e iniciar sesión"`
* `"No tiene un plan activo"`
* `"No hay incidencias registradas"`
* `"No hay movimientos registrados"`
* `"No hay registros para el rango seleccionado"`
* `"La información no está disponible por el momento"`

