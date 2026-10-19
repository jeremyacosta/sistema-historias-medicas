-- ============================================================
--  02_seed_data.sql — Datos de Prueba (Seeds)
--  SOLO para ambiente de DESARROLLO. NO ejecutar en producción.
--  Genera 1 admin, 2 médicos, 1 personal de admisión y
--  3 pacientes ficticios para verificar el sistema desde día 1.
-- ============================================================

-- NOTA: Las contraseñas están hasheadas con bcrypt.
-- Contraseña real de todos los usuarios de prueba: "Test1234!"
-- Recuerda cambiarlas antes de cualquier piloto hospitalario.

-- ── Usuarios del Hospital (Personal) ─────────────────────────
INSERT INTO usuarios (cedula, nombre, apellido, email, telefono, password_hash, rol_id)
VALUES
    -- Admin del sistema
    ('12345678',
     'Carlos', 'Medina',
     'admin@hospitalbaquero.gob.ve',
     '0412-1234567',
     '$2b$12$/fMuCO3VMYdzlxSZCGsvIehqa8pAzavyrnOCnxs2eY87yQfAd5z5W',
     (SELECT id FROM roles WHERE nombre = 'admin')),

    -- Médico 1 — Medicina General
    ('18765432',
     'Hildren', 'Morales',
     'hmorales@hospitalbaquero.gob.ve',
     '0414-9876543',
     '$2b$12$/fMuCO3VMYdzlxSZCGsvIehqa8pAzavyrnOCnxs2eY87yQfAd5z5W',
     (SELECT id FROM roles WHERE nombre = 'medico')),

    -- Médico 2 — Pediatría
    ('20111222',
     'Ana', 'Rodríguez',
     'arodriguez@hospitalbaquero.gob.ve',
     '0416-5551234',
     '$2b$12$/fMuCO3VMYdzlxSZCGsvIehqa8pAzavyrnOCnxs2eY87yQfAd5z5W',
     (SELECT id FROM roles WHERE nombre = 'medico')),

    -- Personal de Admisión
    ('25333444',
     'María', 'González',
     'mgonzalez@hospitalbaquero.gob.ve',
     '0424-7778888',
     '$2b$12$/fMuCO3VMYdzlxSZCGsvIehqa8pAzavyrnOCnxs2eY87yQfAd5z5W',
     (SELECT id FROM roles WHERE nombre = 'admision'))

ON CONFLICT (cedula) DO NOTHING;

-- ── Pacientes Ficticios de Prueba ─────────────────────────────
INSERT INTO pacientes (
    numero_historia, cedula, nombre, apellido,
    fecha_nacimiento, sexo, estado_civil,
    direccion, municipio, estado_residencia,
    telefono_principal, telefono_emergencia,
    nombre_contacto_emergencia,
    tipo_sangre, alergias_conocidas,
    usuario_id
)
VALUES
    -- Paciente 1 — Adulto masculino
    ('HBG-2024-00001',
     '30047210', 'Jeremy', 'Acosta',
     '2000-05-15', 'M', 'soltero',
     'Barrio 24 de Marzo, Calle 5, Casa 12', 'Sucre', 'Miranda',
     '0412-3334455', '0412-9998877', 'Laura Acosta',
     'O+', 'Penicilina',
     (SELECT id FROM usuarios WHERE cedula = '12345678')),

    -- Paciente 2 — Adulta femenina
    ('HBG-2024-00002',
     '29921654', 'Eli', 'Araujo',
     '2001-03-22', 'F', 'soltera',
     'Urb. La Dolorita, Bloque 8, Apto 4-B', 'Sucre', 'Miranda',
     '0414-6667788', '0414-1112233', 'Rosa Araujo',
     'A+', 'Ninguna conocida',
     (SELECT id FROM usuarios WHERE cedula = '12345678')),

    -- Paciente 3 — Adulto mayor
    ('HBG-2024-00003',
     '5100200', 'Roberto', 'Pérez',
     '1955-11-08', 'M', 'casado',
     'Petare Norte, Calle Real, Casa 88', 'Sucre', 'Miranda',
     '0416-4445566', '0416-7778899', 'Carmen Pérez',
     'B+', 'Aspirina, Ibuprofeno',
     (SELECT id FROM usuarios WHERE cedula = '12345678'))

ON CONFLICT (cedula) DO NOTHING;

-- ── Verificación rápida post-inserción ───────────────────────
-- SELECT u.nombre, u.apellido, r.nombre AS rol FROM usuarios u JOIN roles r ON u.rol_id = r.id;
-- SELECT numero_historia, cedula, nombre, apellido, tipo_sangre FROM pacientes;
