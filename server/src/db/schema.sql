-- Datos propios de la cuenta que TunjaAPI no guarda
CREATE TABLE IF NOT EXISTS perfiles (
  usuario_id INTEGER PRIMARY KEY,          -- id del usuario en TunjaAPI
  rol TEXT NOT NULL DEFAULT 'USUARIO'
    CHECK (rol IN ('USUARIO', 'ADMINISTRADOR')),
  fecha_nacimiento TEXT,
  telefono TEXT,
  ultimo_acceso TEXT,
  creado TEXT NOT NULL DEFAULT (datetime('now'))
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