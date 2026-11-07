-- Datos propios de la cuenta que TunjaAPI no guarda
CREATE TABLE IF NOT EXISTS perfiles (
  usuario_id INTEGER PRIMARY KEY,          -- id del usuario en TunjaAPI
  rol TEXT NOT NULL DEFAULT 'USUARIO'
    CHECK (rol IN ('USUARIO', 'ADMINISTRADOR')),
  fecha_nacimiento TEXT,
  telefono TEXT,
  ultimo_acceso TEXT,
  correo TEXT,   -- copia local: TunjaAPI no busca usuarios por correo
  nombre TEXT,
  creado TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Una tarjeta por usuario (HU_18). SIN VINCULAR = el usuario no tiene fila aquí
CREATE TABLE IF NOT EXISTS tarjetas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL UNIQUE REFERENCES perfiles(usuario_id),
  uid TEXT NOT NULL UNIQUE,
  estado TEXT NOT NULL DEFAULT 'ACTIVA' CHECK (estado IN ('ACTIVA', 'BLOQUEADA')),
  fecha_vinculacion TEXT NOT NULL DEFAULT (datetime('now')),  -- UTC
  fecha_cambio_estado TEXT                                    -- UTC
);

CREATE TABLE IF NOT EXISTS estaciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE COLLATE NOCASE,   -- único sin distinguir mayúsculas
  direccion TEXT NOT NULL,
  capacidad_maxima INTEGER NOT NULL CHECK (capacidad_maxima > 0),
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  estado TEXT NOT NULL DEFAULT 'ACTIVE'
    CHECK (estado IN ('ACTIVE', 'INACTIVE')),
  creado TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS anclajes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  estacion_id INTEGER NOT NULL REFERENCES estaciones(id),
  numero INTEGER NOT NULL,
  codigo TEXT NOT NULL UNIQUE,                  -- p. ej. ANC-001-01
  estado TEXT NOT NULL DEFAULT 'LIBRE'
    CHECK (estado IN ('LIBRE', 'OCUPADO')),
  UNIQUE (estacion_id, numero)
);

CREATE TABLE IF NOT EXISTS bicicletas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT NOT NULL UNIQUE COLLATE NOCASE,
  estado TEXT NOT NULL DEFAULT 'DISPONIBLE'
    CHECK (estado IN ('DISPONIBLE', 'EN_USO', 'MANTENIMIENTO', 'INACTIVA')),
  anclaje_id INTEGER UNIQUE REFERENCES anclajes(id),  -- NULL si está en uso o inactiva
  creado TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS planes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE COLLATE NOCASE,
  costo_base INTEGER NOT NULL CHECK (costo_base >= 100),
  vigencia_dias INTEGER NOT NULL CHECK (vigencia_dias > 0),
  viajes_por_dia INTEGER NOT NULL CHECK (viajes_por_dia > 0),
  tiempo_viaje_min INTEGER NOT NULL CHECK (tiempo_viaje_min > 0),
  valor_minuto_exceso INTEGER NOT NULL
    CHECK (valor_minuto_exceso = 0 OR valor_minuto_exceso >= 100),
  estado TEXT NOT NULL DEFAULT 'ACTIVO'
    CHECK (estado IN ('ACTIVO', 'INACTIVO')),
  creado TEXT NOT NULL DEFAULT (datetime('now'))
);