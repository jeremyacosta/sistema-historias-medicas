-- ============================================================
--  06_morbilidad_actividades.sql — Módulo M3: Registro de Morbilidad y Control Médico
--  Instituto Municipal de Salud "Ana Francisca Pérez de León"
--  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
-- ============================================================

CREATE TABLE IF NOT EXISTS actividades_morbilidad (
    id                      UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id             UUID            NOT NULL REFERENCES pacientes(id),
    cedula_paciente         VARCHAR(15)     NOT NULL,
    nombre_paciente         VARCHAR(150)    NOT NULL,
    numero_historia         VARCHAR(20)     NOT NULL,
    
    -- Control del Médico y Actividad
    medico_id               UUID            NOT NULL REFERENCES usuarios(id),
    medico_nombre           VARCHAR(150)    NOT NULL,
    medico_cedula           VARCHAR(15)     NOT NULL,
    servicio                VARCHAR(100)    NOT NULL DEFAULT 'Emergencia Adultos',
    tipo_atencion           VARCHAR(50)     NOT NULL DEFAULT 'Emergencia'
                            CHECK (tipo_atencion IN (
                                'Emergencia', 'Consulta Primera Vez', 'Consulta Sucesiva', 
                                'Triaje Ambulatorio', 'Control Post-Operatorio', 'Interconsulta'
                            )),

    -- Diagnóstico y Registro Epidemiológico (CIE-10)
    motivo_atencion         TEXT            NOT NULL,
    diagnostico_cie10       VARCHAR(20),
    diagnostico_desc        TEXT,
    conducta_tratamiento    TEXT,
    destino_egreso          VARCHAR(50)     NOT NULL DEFAULT 'Alta Médica'
                            CHECK (destino_egreso IN (
                                'Alta Médica', 'En Observación', 'Hospitalización', 
                                'Quirófano / Cirugía', 'Referido', 'Fallecido'
                            )),

    -- Temporalidad
    fecha_actividad         DATE            NOT NULL DEFAULT CURRENT_DATE,
    hora_actividad          TIME            NOT NULL DEFAULT CURRENT_TIME,
    
    -- Auditoría
    registrado_en           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    actualizado_en          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    activo                  BOOLEAN         NOT NULL DEFAULT TRUE
);

-- Índices optimizados para consulta por día y por cédula
CREATE INDEX IF NOT EXISTS idx_morbilidad_fecha     ON actividades_morbilidad (fecha_actividad DESC);
CREATE INDEX IF NOT EXISTS idx_morbilidad_cedula    ON actividades_morbilidad (cedula_paciente);
CREATE INDEX IF NOT EXISTS idx_morbilidad_medico    ON actividades_morbilidad (medico_id, fecha_actividad DESC);
CREATE INDEX IF NOT EXISTS idx_morbilidad_historia  ON actividades_morbilidad (numero_historia);
CREATE INDEX IF NOT EXISTS idx_morbilidad_servicio  ON actividades_morbilidad (servicio);

CREATE TRIGGER trg_morbilidad_actualizado
    BEFORE UPDATE ON actividades_morbilidad
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

COMMENT ON TABLE actividades_morbilidad IS 'Registro oficial de morbilidad diaria y control de actividades médicas del Instituto Municipal de Salud Ana Francisca Pérez de León.';
