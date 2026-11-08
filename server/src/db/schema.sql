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

-- Suscripciones / planes adquiridos por los usuarios (HU_2 y HU_17)
CREATE TABLE IF NOT EXISTS suscripciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL REFERENCES perfiles(usuario_id),
  plan_id INTEGER NOT NULL REFERENCES planes(id),
  nombre_plan TEXT NOT NULL,
  costo_base INTEGER NOT NULL,
  vigencia_dias INTEGER NOT NULL,
  viajes_por_dia INTEGER NOT NULL,
  tiempo_viaje_min INTEGER NOT NULL,
  valor_minuto_exceso INTEGER NOT NULL,
  fecha_inicio TEXT NOT NULL DEFAULT (datetime('now')),
  fecha_fin TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'ACTIVO'
    CHECK (estado IN ('ACTIVO', 'CANCELADO', 'VENCIDO')),
  fecha_cancelacion TEXT
);

-- Registro de viajes (HU_3, HU_4 y HU_5)
CREATE TABLE IF NOT EXISTS viajes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL REFERENCES perfiles(usuario_id),
  bicicleta_id INTEGER NOT NULL REFERENCES bicicletas(id),
  estacion_origen_id INTEGER NOT NULL REFERENCES estaciones(id),
  estacion_destino_id INTEGER REFERENCES estaciones(id),
  fecha_inicio TEXT NOT NULL DEFAULT (datetime('now')),
  fecha_fin TEXT,
  duracion_min INTEGER DEFAULT 0,
  minutos_exceso INTEGER DEFAULT 0,
  valor_cobrado INTEGER DEFAULT 0,
  estado TEXT NOT NULL DEFAULT 'EN_CURSO'
    CHECK (estado IN ('EN_CURSO', 'FINALIZADO')),
  estado_cobro TEXT NOT NULL DEFAULT 'SIN_COBRO'
    CHECK (estado_cobro IN ('SIN_COBRO', 'PAGADO', 'PENDIENTE'))
);

-- Reporte y gestión de incidencias (HU_6 y HU_19)
CREATE TABLE IF NOT EXISTS incidencias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL REFERENCES perfiles(usuario_id),
  tipo TEXT NOT NULL CHECK (tipo IN ('BICICLETA', 'ANCLAJE', 'TARJETA', 'OTRO')),
  bicicleta_id INTEGER REFERENCES bicicletas(id),
  estacion_id INTEGER REFERENCES estaciones(id),
  descripcion TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'ABIERTA'
    CHECK (estado IN ('ABIERTA', 'ATENDIDA', 'CERRADA')),
  observacion_admin TEXT,
  fecha_creacion TEXT NOT NULL DEFAULT (datetime('now')),
  fecha_atencion TEXT,
  fecha_cierre TEXT
);
