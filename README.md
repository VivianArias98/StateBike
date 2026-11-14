# StateBike (StationBike)

Sistema de bicicletas con tarjeta NFC para Tunja. Desarrollado con **React (Vite)** en el frontend, **Node.js (Express)** en el backend. Las cuentas, saldos y tarjetas NFC se gestionan a través de TunjaAPI.


## 1. Requisitos
- **Node.js:** Versión 20.6 o superior (se recomienda Node.js 22 LTS).
- **npm:** Incluido con Node.js.
- **Acceso a red:** Conexión a internet para consultar TunjaAPI y cargar los mapas de OpenStreetMap.

---

## 2. Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone (https://github.com/VivianArias98/StateBike.git)
   cd StateBike
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea el archivo `.env` a partir de la plantilla:
   ```bash
   cp .env.example .env   # Linux / macOS / Git Bash
   copy .env.example .env # Windows (CMD)
   ```

   Edita el `.env` con tus credenciales (las demás variables tienen valores por defecto):
   ```env
   PORT=4000
   NODE_ENV=development
   FRONT_ORIGIN=http://localhost:5173
   DB_FILE=./server/data/stationbike.db

   TUNJA_API=[https://nfc.multimediaudeb.com/api/v1](https://nfc.multimediaudeb.com/api/v1)
   TUNJA_CLAVE=tk_tu_clave_real
   CLAVE_INTERNA=una_clave_larga_y_secreta

   ADMIN_EMAIL=admin@ejemplo.com
   ADMIN_PASSWORD=ClaveSegura123*
   ADMIN_NOMBRE=Administrador StationBike
   ```
   *(Opcional) Genera una `CLAVE_INTERNA` segura ejecutando:*
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Inicializar la base de datos (Seed):**
   ```bash
   npm run seed
   ```

---

## 3. Ejecución

* **Iniciar frontend y backend al mismo tiempo:**
  ```bash
  npm run dev:all
  ```
  * **Frontend:** `http://localhost:5173`
  * **Backend:** `http://localhost:4000/api` *(Vite redirige automáticamente `/api` al backend)*

* **Ejecutar por separado (en dos terminales):**
  ```bash
  npm run server   # Inicia el backend
  npm run dev      # Inicia el frontend
  ```

---

## 4. Verificación rápida

* **Estado del servidor:** Abre `http://localhost:4000/api/health` en el navegador. Debe responder:
  ```json
  { "servidor": "ok", "sqlite": true, "tunja": true }
  ```
* **Conexión con API NFC:** Las rutas `/api/interno/*` requieren el header `X-Clave-Interna`. Puedes probarlo con:
  ```bash
  curl -H "X-Clave-Interna: TU_CLAVE_INTERNA" http://localhost:4000/api/interno/ping
  ```
  *(Respuesta esperada: `{"ok":true}`)*

---

## 5. Scripts Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el frontend en modo desarrollo. |
| `npm run server` | Inicia el backend con recarga automática. |
| `npm run dev:all` | Inicia frontend y backend simultáneamente. |
| `npm run seed` | Crea el esquema de BD, planes iniciales y administrador. |
| `npm run build` | Compila el frontend en la carpeta `dist/`. |
| `npm run preview` | Sirve el build compilado localmente. |
| `npm run lint` | Revisa el código con ESLint. |