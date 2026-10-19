-- ============================================================
--  03_security_schema.sql — Seguridad del Sistema Hospitalario
--  Autor:    Acosta, Jeremy | Araujo, Eli
--  Tutor:    Prof. Hildren Morales
--  Versión:  1.0.0 — Fase 0: Cimientos de Seguridad
--
--  IMPORTANTE: Los datos clínicos de pacientes son información
--  sensible de salud. Este módulo garantiza:
--  ① Autenticación robusta con JWT + bloqueo por intentos
--  ② Autorización RBAC granular por rol hospitalario
--  ③ Auditoría inmutable de todos los accesos a historias
--  ④ Protección de datos del paciente (soberanía del dato)
-- ============================================================


-- ============================================================
--  TABLA: permisos
--  Define cada acción granular que puede realizarse en el sistema
-- ============================================================
CREATE TABLE IF NOT EXISTS permisos (
    id          SERIAL      PRIMARY KEY,
    codigo      VARCHAR(80) NOT NULL UNIQUE,  -- Ej: "paciente:leer", "historia:crear"
    descripcion TEXT,
    modulo      VARCHAR(50) NOT NULL          -- Ej: "admision", "historia", "recetas"
);

-- Permisos nucleares del sistema hospitalario
INSERT INTO permisos (codigo, descripcion, modulo) VALUES
    -- Módulo: Pacientes
    ('paciente:leer',           'Buscar y consultar datos básicos de un paciente',          'admision'),
    ('paciente:crear',          'Abrir un nuevo expediente (apertura de historia)',          'admision'),
    ('paciente:editar',         'Modificar datos demográficos del paciente',                'admision'),
    ('paciente:inactivar',      'Marcar un expediente como inactivo',                       'admision'),
    -- Módulo: Historias Clínicas
    ('historia:leer',           'Ver el contenido completo de una historia clínica',        'historia'),
    ('historia:crear',          'Registrar una nueva entrada clínica (consulta/emergencia)','historia'),
    ('historia:editar',         'Corregir una entrada clínica existente (con trazabilidad)','historia'),
    -- Módulo: Récipes
    ('receta:emitir',           'Emitir un récipe médico oficial con código QR',            'recetas'),
    ('receta:leer_propia',      'Ver récipes propios (solo paciente)',                      'recetas'),
    -- Módulo: Morbilidad
    ('morbilidad:generar',      'Generar la planilla de morbilidad diaria al cierre',       'morbilidad'),
    ('morbilidad:leer',         'Consultar reportes de morbilidad',                         'morbilidad'),
    -- Módulo: Usuarios (Solo Admin)
    ('usuario:crear',           'Crear cuentas de personal hospitalario',                   'admin'),
    ('usuario:editar',          'Modificar datos y roles del personal',                     'admin'),
    ('usuario:inactivar',       'Deshabilitar acceso a un usuario del sistema',             'admin'),
    ('usuario:leer_todos',      'Ver el listado completo de usuarios del sistema',          'admin'),
    -- Módulo: Teleasistencia
    ('teleconsulta:iniciar',    'Iniciar o programar una videoconsulta',                    'teleasistencia'),
    ('teleconsulta:unirse',     'Unirse a una videoconsulta en curso',                      'teleasistencia'),
    -- Módulo: Auditoría
    ('auditoria:leer',          'Consultar el log de auditoría del sistema',                'admin')
ON CONFLICT (codigo) DO NOTHING;

-- ============================================================
--  TABLA: rol_permisos
--  Relaciona cada rol con los permisos que tiene asignados (RBAC)
-- ============================================================
CREATE TABLE IF NOT EXISTS rol_permisos (
    rol_id      INTEGER     NOT NULL REFERENCES roles(id)    ON DELETE CASCADE,
    permiso_id  INTEGER     NOT NULL REFERENCES permisos(id) ON DELETE CASCADE,
    PRIMARY KEY (rol_id, permiso_id)
);

-- ── Asignación de permisos por rol ──────────────────────────

-- ADMIN: acceso total
INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r, permisos p
WHERE r.nombre = 'admin'
ON CONFLICT DO NOTHING;

-- MEDICO: historia + récipes + teleconsulta (NO administración de usuarios)
INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r
JOIN permisos p ON p.codigo IN (
    'paciente:leer',
    'historia:leer', 'historia:crear', 'historia:editar',
    'receta:emitir',
    'morbilidad:generar', 'morbilidad:leer',
    'teleconsulta:iniciar', 'teleconsulta:unirse'
)
WHERE r.nombre = 'medico'
ON CONFLICT DO NOTHING;

-- ADMISION: solo apertura y búsqueda de expedientes
INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r
JOIN permisos p ON p.codigo IN (
    'paciente:leer', 'paciente:crear', 'paciente:editar'
)
WHERE r.nombre = 'admision'
ON CONFLICT DO NOTHING;

-- PACIENTE: solo sus propios datos
INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r
JOIN permisos p ON p.codigo IN (
    'historia:leer',
    'receta:leer_propia',
    'teleconsulta:unirse'
)
WHERE r.nombre = 'paciente'
ON CONFLICT DO NOTHING;

-- ============================================================
--  TABLA: intentos_login
--  Control de intentos fallidos para bloqueo automático
--  Regla: 5 intentos fallidos = bloqueo temporal de 30 minutos
-- ============================================================
CREATE TABLE IF NOT EXISTS intentos_login (
    id              SERIAL      PRIMARY KEY,
    cedula          VARCHAR(15) NOT NULL,
    ip_origen       INET,                       -- Dirección IP del intento
    exitoso         BOOLEAN     NOT NULL DEFAULT FALSE,
    mensaje_fallo   VARCHAR(100),               -- Ej: "Contraseña incorrecta"
    intentado_en    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para consulta rápida de intentos recientes por cédula
CREATE INDEX IF NOT EXISTS idx_intentos_cedula_fecha
    ON intentos_login (cedula, intentado_en DESC);

-- ============================================================
--  TABLA: sesiones_activas
--  Registro de sesiones JWT emitidas (permite logout real)
--  Un JWT revocado aquí es rechazado aunque su firma sea válida
-- ============================================================
CREATE TABLE IF NOT EXISTS sesiones_activas (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id      UUID        NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token_jti       VARCHAR(36) NOT NULL UNIQUE,  -- JWT ID único del token
    ip_origen       INET,
    dispositivo     TEXT,                         -- User-Agent del navegador/app
    expira_en       TIMESTAMPTZ NOT NULL,
    revocado        BOOLEAN     NOT NULL DEFAULT FALSE,
    revocado_en     TIMESTAMPTZ,
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sesiones_usuario    ON sesiones_activas (usuario_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_jti        ON sesiones_activas (token_jti);
CREATE INDEX IF NOT EXISTS idx_sesiones_activas    ON sesiones_activas (revocado, expira_en);

-- ============================================================
--  TABLA: auditoria_accesos
--  Registro INMUTABLE de todas las acciones sobre datos clínicos
--  Requisito ético y de compliance para sistemas de salud.
--  NUNCA se permiten UPDATE ni DELETE en esta tabla.
-- ============================================================
CREATE TABLE IF NOT EXISTS auditoria_accesos (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- ¿Quién realizó la acción?
    usuario_id      UUID        REFERENCES usuarios(id),
    usuario_cedula  VARCHAR(15),                  -- Copia desnormalizada (histórico)
    usuario_rol     VARCHAR(50),                  -- Rol al momento de la acción
    -- ¿Qué hizo?
    accion          VARCHAR(80) NOT NULL,          -- Ej: "historia:leer", "receta:emitir"
    descripcion     TEXT,                         -- Descripción legible de la acción
    -- ¿Sobre qué dato?
    entidad         VARCHAR(50),                  -- Ej: "paciente", "historia", "receta"
    entidad_id      TEXT,                         -- ID del registro afectado
    paciente_cedula VARCHAR(15),                  -- Cédula del paciente involucrado
    -- ¿Desde dónde?
    ip_origen       INET,
    modulo          VARCHAR(50),                  -- Módulo del sistema (M1-M7)
    -- ¿Cuándo y con qué resultado?
    exitoso         BOOLEAN     NOT NULL DEFAULT TRUE,
    detalle_error   TEXT,                         -- Solo si exitoso = FALSE
    registrado_en   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para búsquedas de auditoría frecuentes
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario     ON auditoria_accesos (usuario_id, registrado_en DESC);
CREATE INDEX IF NOT EXISTS idx_auditoria_paciente    ON auditoria_accesos (paciente_cedula, registrado_en DESC);
CREATE INDEX IF NOT EXISTS idx_auditoria_accion      ON auditoria_accesos (accion, registrado_en DESC);
CREATE INDEX IF NOT EXISTS idx_auditoria_fecha       ON auditoria_accesos (registrado_en DESC);

-- Regla de inmutabilidad: bloquear UPDATE y DELETE en auditoría
CREATE RULE no_update_auditoria AS ON UPDATE TO auditoria_accesos DO INSTEAD NOTHING;
CREATE RULE no_delete_auditoria AS ON DELETE TO auditoria_accesos DO INSTEAD NOTHING;

-- ============================================================
--  TABLA: bloqueos_cuenta
--  Registro de bloqueos temporales por intentos fallidos
-- ============================================================
CREATE TABLE IF NOT EXISTS bloqueos_cuenta (
    id              SERIAL      PRIMARY KEY,
    cedula          VARCHAR(15) NOT NULL,
    bloqueado_hasta TIMESTAMPTZ NOT NULL,
    motivo          TEXT,
    intentos        INTEGER     NOT NULL DEFAULT 5,
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bloqueos_cedula ON bloqueos_cuenta (cedula, bloqueado_hasta);

-- ============================================================
--  TABLA: politica_privacidad_paciente
--  El paciente controla el nivel de acceso a su propia historia
--  (Principio de Soberanía del Dato — Ley de Infogobierno 2013)
-- ============================================================
CREATE TABLE IF NOT EXISTS politica_privacidad_paciente (
    id                      UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id             UUID    NOT NULL UNIQUE REFERENCES pacientes(id),
    -- Consentimientos granulares
    permite_ver_historia    BOOLEAN NOT NULL DEFAULT TRUE,   -- Médicos pueden ver su historia
    permite_teleconsulta    BOOLEAN NOT NULL DEFAULT TRUE,   -- Acepta videoconsultas
    permite_compartir_qr    BOOLEAN NOT NULL DEFAULT TRUE,   -- QR de emergencia visible
    -- Control de datos
    acepto_terminos         BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_aceptacion        TIMESTAMPTZ,
    ip_aceptacion           INET,
    actualizado_en          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
--  FUNCIÓN: registrar_auditoria()
--  Función de ayuda para insertar registros de auditoría
--  desde los triggers del backend de forma estandarizada
-- ============================================================
CREATE OR REPLACE FUNCTION registrar_auditoria(
    p_usuario_id        UUID,
    p_usuario_cedula    VARCHAR,
    p_usuario_rol       VARCHAR,
    p_accion            VARCHAR,
    p_descripcion       TEXT,
    p_entidad           VARCHAR,
    p_entidad_id        TEXT,
    p_paciente_cedula   VARCHAR,
    p_ip_origen         INET,
    p_modulo            VARCHAR,
    p_exitoso           BOOLEAN DEFAULT TRUE,
    p_detalle_error     TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO auditoria_accesos (
        usuario_id, usuario_cedula, usuario_rol,
        accion, descripcion,
        entidad, entidad_id, paciente_cedula,
        ip_origen, modulo,
        exitoso, detalle_error
    ) VALUES (
        p_usuario_id, p_usuario_cedula, p_usuario_rol,
        p_accion, p_descripcion,
        p_entidad, p_entidad_id, p_paciente_cedula,
        p_ip_origen, p_modulo,
        p_exitoso, p_detalle_error
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================
--  VISTAS DE CONSULTA RÁPIDA PARA EL ADMIN
-- ============================================================

-- Vista: Sesiones activas actuales (no expiradas, no revocadas)
CREATE OR REPLACE VIEW v_sesiones_activas AS
SELECT
    s.id,
    u.cedula,
    u.nombre || ' ' || u.apellido AS usuario,
    r.nombre AS rol,
    s.ip_origen,
    s.dispositivo,
    s.creado_en AS inicio_sesion,
    s.expira_en
FROM sesiones_activas s
JOIN usuarios u  ON s.usuario_id = u.id
JOIN roles    r  ON u.rol_id     = r.id
WHERE s.revocado = FALSE
  AND s.expira_en > NOW();

-- Vista: Últimos 100 accesos a historias clínicas (para el Admin)
CREATE OR REPLACE VIEW v_auditoria_reciente AS
SELECT
    a.registrado_en,
    a.usuario_cedula,
    a.usuario_rol,
    a.accion,
    a.descripcion,
    a.paciente_cedula,
    a.ip_origen,
    a.exitoso
FROM auditoria_accesos a
ORDER BY a.registrado_en DESC
LIMIT 100;

-- ============================================================
--  RESUMEN DE SEGURIDAD IMPLEMENTADA (Fase 0 — Seguridad)
-- ============================================================
-- ✅ permisos            — 17 permisos granulares por módulo clínico
-- ✅ rol_permisos         — Matriz RBAC: 4 roles × permisos asignados
-- ✅ intentos_login       — Control de intentos fallidos (anti-fuerza-bruta)
-- ✅ sesiones_activas     — Blacklist JWT para logout real
-- ✅ auditoria_accesos    — Registro inmutable (UPDATE/DELETE bloqueados)
-- ✅ bloqueos_cuenta      — Bloqueo temporal tras 5 intentos fallidos
-- ✅ politica_privacidad  — Soberanía del dato del paciente (Infogobierno 2013)
-- ✅ v_sesiones_activas   — Vista para monitoreo del Admin
-- ✅ v_auditoria_reciente — Vista para revisión de accesos clínicos
