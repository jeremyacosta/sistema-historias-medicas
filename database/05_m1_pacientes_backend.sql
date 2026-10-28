-- ============================================================
--  05_m1_pacientes_backend.sql — Módulo M1: Admisión y Expedientes
--  Agrega la secuencia correlativa de Número de Historia Clínica
--  y la tabla de historias de emergencia 051 (48h)
--  Instituto Municipal de Salud "Ana Francisca Pérez de León"
--  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
-- ============================================================

-- ── 1. Secuencia para Número de Historia Único HPL-YYYY-NNNNN ──
CREATE SEQUENCE IF NOT EXISTS historia_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    CACHE 1;

-- ── 2. Tabla de Historias de Emergencia 051 (48 horas) ─────────
CREATE TABLE IF NOT EXISTS historias_emergencia_051 (
    id                  UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id         UUID            NOT NULL REFERENCES pacientes(id),
    numero_historia     VARCHAR(20)     NOT NULL,               -- Referencia al expediente 052
    cedula_paciente     VARCHAR(15)     NOT NULL,
    medico_id           UUID            NOT NULL REFERENCES usuarios(id),
    fecha_atencion      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    -- Signos vitales al ingreso
    ta_sistolica        SMALLINT,                               -- mmHg
    ta_diastolica       SMALLINT,                               -- mmHg
    spo2                SMALLINT,                               -- %
    frecuencia_cardiaca SMALLINT,                               -- lpm
    temperatura         NUMERIC(4,1),                           -- °C
    -- Datos clínicos
    motivo_consulta     TEXT            NOT NULL,
    examen_fisico       TEXT,
    diagnostico_cie10   VARCHAR(20),                            -- Código CIE-10
    diagnostico_desc    TEXT,
    tratamiento         TEXT,
    -- Control de hospitalización
    requiere_hospitalizacion BOOLEAN    NOT NULL DEFAULT FALSE,
    derivado_cirugia    BOOLEAN         NOT NULL DEFAULT FALSE,
    resolucion          VARCHAR(50)     DEFAULT 'En Atención'
                        CHECK (resolucion IN ('En Atención', 'Alta Médica', 'Hospitalizado', 'Referido', 'Fallecido')),
    -- Timestamps y auditoría
    creado_en           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    actualizado_en      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    activo              BOOLEAN         NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_he051_paciente   ON historias_emergencia_051 (paciente_id);
CREATE INDEX IF NOT EXISTS idx_he051_cedula     ON historias_emergencia_051 (cedula_paciente);
CREATE INDEX IF NOT EXISTS idx_he051_fecha      ON historias_emergencia_051 (fecha_atencion DESC);
CREATE INDEX IF NOT EXISTS idx_he051_medico     ON historias_emergencia_051 (medico_id);

CREATE TRIGGER trg_he051_actualizado
    BEFORE UPDATE ON historias_emergencia_051
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

COMMENT ON TABLE historias_emergencia_051 IS 'Historia clínica de emergencia (F-051). Validez 48 horas. Solo Médico de Guardia. Nivel Manchester I y II.';
