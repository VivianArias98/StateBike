-- Datos propios de la cuenta que TunjaAPI no guarda
CREATE TABLE IF NOT EXISTS perfiles (
  usuario_id INTEGER PRIMARY KEY,          -- id del usuario en TunjaAPI
  rol TEXT NOT NULL DEFAULT 'USUARIO'
    CHECK (rol IN ('USUARIO', 'ADMINISTRADOR')),
  fecha_nacimiento TEXT,
  telefono TEXT,
  creado TEXT NOT NULL DEFAULT (datetime('now'))
);