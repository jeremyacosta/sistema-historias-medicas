-- ============================================================
--  04_paciente_seguridad.sql
--  Seguridad, Onboarding y Recuperación Híbrida de Pacientes
--  Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"
--  © 2026 · Jeremy Acosta & Eli Araujo · USM · MPPS DS-7
-- ============================================================

-- 1. Agregar columnas de control a la tabla usuarios
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS debe_cambiar_pass BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS pregunta_seguridad VARCHAR(200),
ADD COLUMN IF NOT EXISTS respuesta_seguridad_hash TEXT,
ADD COLUMN IF NOT EXISTS telefono_verificado BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verificado BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Asegurar que los pacientes de prueba tengan debe_cambiar_pass = FALSE inicialmente
UPDATE usuarios 
SET debe_cambiar_pass = FALSE 
WHERE rol_id = (SELECT id FROM roles WHERE nombre = 'paciente');

-- 3. Crear índice para optimizar búsquedas por pregunta de seguridad si aplica
COMMENT ON COLUMN usuarios.debe_cambiar_pass IS 'Indica si el usuario tiene una clave provisional generada en admisión y debe completar el onboarding';
COMMENT ON COLUMN usuarios.pregunta_seguridad IS 'Pregunta secreta elegida por el paciente durante el onboarding';
COMMENT ON COLUMN usuarios.respuesta_seguridad_hash IS 'Hash Bcrypt de la respuesta de seguridad para recuperación de clave';
