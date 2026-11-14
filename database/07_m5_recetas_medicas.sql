-- ============================================================
--  07_m5_recetas_medicas.sql — Módulo M5: Récipes Médicos Oficiales Formato 001 MPPS
--  Instituto Municipal de Salud "Ana Francisca Pérez de León"
--  Ministerio del Poder Popular para la Salud · Distrito Sanitario N° 7
--  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
-- ============================================================

-- Tabla principal de récipes médicos oficiales con integridad SHA-256
CREATE TABLE IF NOT EXISTS recetas_medicas (
    id                  SERIAL          PRIMARY KEY,
    folio               VARCHAR(50)     NOT NULL UNIQUE,

    -- Expediente del Paciente
    paciente_id         UUID            NOT NULL REFERENCES pacientes(id),
    cedula_paciente     VARCHAR(20)     NOT NULL,
    nombre_paciente     VARCHAR(200)    NOT NULL,
    numero_historia     VARCHAR(50)     NOT NULL,

    -- Facultativo Emisor
    medico_id           UUID            NOT NULL REFERENCES usuarios(id),
    medico_nombre       VARCHAR(200)    NOT NULL,
    medico_cedula       VARCHAR(20)     NOT NULL,
    medico_mpps         VARCHAR(50),

    -- Diagnóstico y Prescripción
    diagnostico_cie10   VARCHAR(20),
    diagnostico_desc    VARCHAR(300),
    prescripcion_rp     TEXT            NOT NULL,
    indicaciones        TEXT            NOT NULL,

    -- Vigencia
    dias_validez        INTEGER         NOT NULL DEFAULT 7,
    fecha_emision       DATE            NOT NULL DEFAULT CURRENT_DATE,
    fecha_vencimiento   DATE            NOT NULL,
    estado              VARCHAR(20)     NOT NULL DEFAULT 'activo'
                        CHECK (estado IN ('activo', 'dispensado', 'vencido', 'anulado')),

    -- Integridad Criptográfica Inmutable
    hash_integridad     VARCHAR(64)     NOT NULL,

    -- Auditoría
    activo              BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Índices para consulta por folio, paciente, médico e historia
CREATE UNIQUE INDEX IF NOT EXISTS ix_recetas_medicas_folio         ON recetas_medicas (folio);
CREATE INDEX IF NOT EXISTS idx_recetas_cedula_paciente             ON recetas_medicas (cedula_paciente);
CREATE INDEX IF NOT EXISTS idx_recetas_paciente_id                 ON recetas_medicas (paciente_id);
CREATE INDEX IF NOT EXISTS idx_recetas_medico_id                   ON recetas_medicas (medico_id);
CREATE INDEX IF NOT EXISTS idx_recetas_numero_historia             ON recetas_medicas (numero_historia);
CREATE INDEX IF NOT EXISTS idx_recetas_fecha_emision               ON recetas_medicas (fecha_emision DESC);
CREATE INDEX IF NOT EXISTS idx_recetas_estado                      ON recetas_medicas (estado);

COMMENT ON TABLE recetas_medicas IS 'Récipes Médicos Oficiales Formato 001 MPPS emitidos en el Instituto Municipal de Salud Ana Francisca Pérez de León. Cada registro incluye folio institucional secuencial, prescripción médica con indicaciones, vigencia y hash SHA-256 de integridad inmutable.';
COMMENT ON COLUMN recetas_medicas.folio IS 'Folio institucional correlativo anual: REC-YYYY-NNNNNN generado automáticamente por el backend.';
COMMENT ON COLUMN recetas_medicas.hash_integridad IS 'SHA-256 calculado sobre: folio | cedula_paciente | medico_cedula | prescripcion_rp | fecha_emision | MPPS-DS7. Garantiza inmutabilidad del documento.';
