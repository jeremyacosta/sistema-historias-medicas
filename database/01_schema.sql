-- ============================================================
--  01_schema.sql — Esquema Base del Sistema Hospital Baquero
--  Autor:    Acosta, Jeremy | Araujo, Eli
--  Tutor:    Prof. Hildren Morales
--  Versión:  1.0.0 — Fase 0: Cimientos
--  Norma:    Formatos clínicos oficiales Hospital Dr. Ricardo
--            Baquero González, Petare, Caracas
-- ============================================================

-- ── Extensiones ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- Para hashing de contraseñas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- Para UUIDs únicos globales

-- ============================================================
--  TABLA: roles
--  Define los perfiles de acceso del sistema
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
    id          SERIAL          PRIMARY KEY,
    nombre      VARCHAR(50)     NOT NULL UNIQUE,
    descripcion TEXT,
    creado_en   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    activo      BOOLEAN         NOT NULL DEFAULT TRUE
);

-- Roles iniciales del sistema hospitalario
INSERT INTO roles (nombre, descripcion) VALUES
    ('admin',       'Administrador del sistema con acceso total'),
    ('medico',      'Médico tratante — registra y firma historias clínicas'),
    ('admision',    'Personal de admisión — apertura de expedientes y búsqueda'),
    ('paciente',    'Paciente ciudadano — consulta propia historia y récipes')
ON CONFLICT (nombre) DO NOTHING;

-- ============================================================
--  TABLA: usuarios
--  Personal del hospital y pacientes con acceso al sistema
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id              UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    cedula          VARCHAR(15)     NOT NULL UNIQUE,
    nombre          VARCHAR(100)    NOT NULL,
    apellido        VARCHAR(100)    NOT NULL,
    email           VARCHAR(150)    UNIQUE,
    telefono        VARCHAR(20),
    password_hash   TEXT            NOT NULL,
    rol_id          INTEGER         NOT NULL REFERENCES roles(id),
    activo          BOOLEAN         NOT NULL DEFAULT TRUE,
    ultimo_acceso   TIMESTAMPTZ,
    creado_en       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    actualizado_en  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Índices para búsqueda rápida por cédula y email
CREATE INDEX IF NOT EXISTS idx_usuarios_cedula ON usuarios (cedula);
CREATE INDEX IF NOT EXISTS idx_usuarios_email  ON usuarios (email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol    ON usuarios (rol_id);

-- ============================================================
--  TABLA: pacientes
--  Expediente digital según Formato Oficial 052 del Hospital
--  Dr. Ricardo Baquero González — Datos de Identificación
-- ============================================================
CREATE TABLE IF NOT EXISTS pacientes (
    id                  UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_historia     VARCHAR(20)     NOT NULL UNIQUE,    -- N° Historia Clínica oficial
    cedula              VARCHAR(15)     NOT NULL UNIQUE,
    nombre              VARCHAR(100)    NOT NULL,
    apellido            VARCHAR(100)    NOT NULL,
    fecha_nacimiento    DATE            NOT NULL,
    sexo                CHAR(1)         NOT NULL CHECK (sexo IN ('M', 'F')),
    estado_civil        VARCHAR(20)     CHECK (estado_civil IN (
                            'soltero', 'soltera', 'casado', 'casada', 
                            'divorciado', 'divorciada', 'viudo', 'viuda', 'union_libre'
                        )),
    -- Contacto y domicilio (Formato 052)
    direccion           TEXT,
    municipio           VARCHAR(100),
    estado_residencia   VARCHAR(100),
    telefono_principal  VARCHAR(20),
    telefono_emergencia VARCHAR(20),
    nombre_contacto_emergencia VARCHAR(150),
    -- Datos de salud básicos
    tipo_sangre         VARCHAR(5)      CHECK (tipo_sangre IN (
                            'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
                        )),
    alergias_conocidas  TEXT,
    -- Control de registro
    usuario_id          UUID            REFERENCES usuarios(id),  -- Quién abrió el expediente
    creado_en           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    actualizado_en      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    activo              BOOLEAN         NOT NULL DEFAULT TRUE
);

-- Índices críticos para búsqueda clínica en Admisión (M1)
CREATE INDEX IF NOT EXISTS idx_pacientes_cedula          ON pacientes (cedula);
CREATE INDEX IF NOT EXISTS idx_pacientes_numero_historia ON pacientes (numero_historia);
CREATE INDEX IF NOT EXISTS idx_pacientes_apellido        ON pacientes (apellido);

-- ============================================================
--  FUNCIÓN: actualizar_timestamp
--  Mantiene "actualizado_en" sincronizado automáticamente
-- ============================================================
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Disparadores para actualización automática
CREATE TRIGGER trg_usuarios_actualizado
    BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

CREATE TRIGGER trg_pacientes_actualizado
    BEFORE UPDATE ON pacientes
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

-- ============================================================
--  RESUMEN DE TABLAS CREADAS (Fase 0)
-- ============================================================
-- ✅ roles           — 4 perfiles: admin, medico, admision, paciente
-- ✅ usuarios        — Personal y acceso al sistema (Auth JWT)
-- ✅ pacientes       — Expediente base según Formato 052 Baquero González
-- ── Próxima Fase: historia_emergencia, historia_adulto, recipes, morbilidad
