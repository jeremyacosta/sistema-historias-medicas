# ============================================================
#  ESTADO_MODULOS_PROYECTO.md
#  Sistema Interoperable de Historias Médicas y Teleasistencia
#  Instituto Municipal de Salud Ana Francisca Pérez de León
#  Trabajo Especial de Grado — Universidad Santa María (USM) 2026
#  Desarrolladores: Jeremy Acosta (30.047.210) & Eli Araujo (29.921.654)
#  Tutor: Prof. Hildren Morales
# ============================================================

## 📌 Balance General de Arquitectura (Octubre 2026)

El sistema hospitalario está concebido sobre una arquitectura de **4 Espacios de Trabajo Estrictamente Aislados (RBAC)** y **7 Módulos Clínicos Nucleares (M1 a M7)**, respaldado por PostgreSQL 16, FastAPI (Python 3.11+) y React con Tailwind CSS bajo el lenguaje visual institucional de alta fidelidad **Cosmos Medical**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   MAPA DE AVANCE GLOBAL: ~70% COMPLETADO               │
├───────┬──────────────────────────────────────────┬───────────┬─────────┤
│ MÓD.  │ NOMBRE Y ALCANCE CLÍNICO                 │ ESTADO    │ AVANCE  │
├───────┼──────────────────────────────────────────┼───────────┼─────────┤
│ M1    │ Admisión Central & Triaje Manchester     │ Operativo │   95%   │
│ M2    │ Historias Clínicas & Emergencia 051      │ Operativo │   75%   │
│ M3    │ Morbilidad Diaria de Triaje (EPI-12)     │ Operativo │   90%   │
│ M4    │ Consola Admin & Soporte de Usuarios      │ Pendiente │   35%   │
│ M5    │ Récipes Médicos Digitales & Código QR    │ Parcial   │   60%   │
│ M6    │ Teleasistencia Hospitalaria 24H          │ Pendiente │   15%   │
│ M7    │ Auditoría Inmutable Forense              │ Operativo │   70%   │
│ BDP   │ Billetera Digital del Paciente (Portal)  │ Operativo │   95%   │
└───────┴──────────────────────────────────────────┴───────────┴─────────┘
```

---

## 🏥 Detalle Módulo por Módulo: Qué está listo y qué falta

### Módulo M1 — Admisión Central & Apertura F-052 (95% Completado)
* **Lo que está listo y probado:**
  - Base de datos relacional con secuencia correlativa `historia_seq` (`HPL-2026-NNNNN`).
  - Formato 052 Parte 1 (Admisión y Filiación Inicial) con regla médico-legal de inmutabilidad (Append-Only).
  - Censo activo de pacientes hospitalarios con filtros por triaje Manchester (Niveles I al V) y servicios hospitalarios.
  - Creación automática de usuario con credenciales provisionales para el portal del paciente.
  - Búsqueda en vivo de cédula en PostgreSQL con fallback y botón de limpieza inmediata.
* **Lo que falta para el 100%:**
  - Generación de vista de impresión / exportación directa en formato PDF membretado reglamentario MPPS del Formato 052.

---

### Módulo M2 — Historias Médicas & Emergencia F-051 (75% Completado)
* **Lo que está listo y probado:**
  - Tabla relacional `historias_emergencia_051` con signos vitales, severidad del caso, antecedentes y CIE-10.
  - Endpoints `POST /api/v1/historias/emergencia-051` y `GET /api/v1/historias/paciente/{cedula}`.
  - Panel de Historial Clínico Unificado flotante en modal superpuesto (*Dialog Overlay*) con pestañas de atenciones de emergencia, récipes y curva de signos vitales.
  - Modales de Formato 051 (Trauma Shock / Emergencia 48h) y Notas de Evolución Oficiales.
* **Lo que falta para el 100%:**
  - Implementar la vista dedicada `/medico/historias` (actualmente con pantalla de *Placeholder*) para que el médico pueda listar y buscar el archivo general de historias clínicas sin estar forzosamente en el triage de guardia.
  - Implementar la vista `/medico/notas` para el listado de evoluciones médicas de hospitalización.

---

### Módulo M3 — Control y Registro de Morbilidad Diaria (90% Completado)
* **Lo que está listo y probado:**
  - Tabla relacional `actividades_morbilidad` con desglose por fecha, servicio, médico tratante y diagnóstico CIE-10.
  - Consola oficial en Admisión (`/admision/morbilidad`) con telemetría en vivo, resumen por servicio y tabla cronológica.
  - Retiro definitivo del acceso en el perfil médico (para que el médico se concentre en atención clínica y la morbilidad quede centralizada en Admisión y Estadísticas Sanitarias).
* **Lo que falta para el 100%:**
  - Botón de exportación de la sábana de morbilidad en archivo Excel/CSV con el formato reglamentario del Ministerio (MPPS Distrito Sanitario N° 7).

---

### Módulo M4 — Consola Administrativa, Usuarios & Soporte (35% Completado) — [PRIORIDAD INMEDIATA]
* **Lo que está listo:**
  - Esquema de base de datos con tablas `usuarios`, `roles`, `sesiones_activas` y contraseñas hasheadas con Bcrypt.
  - Dashboard de dirección con KPIs y métricas del sistema (`AdminDashboard.jsx`).
* **Lo que falta por construir (Faltante crítico):**
  - Backend `sistema/backend/app/api/v1/admin.py`:
    * `GET /api/v1/admin/usuarios` (listar todo el personal con estado activo/inactivo).
    * `POST /api/v1/admin/usuarios` (dar de alta a médicos, enfermeros y secretarios).
    * `PATCH /api/v1/admin/usuarios/{id}/estado` (activar, suspender o bloquear acceso ante incidentes).
    * `POST /api/v1/admin/usuarios/{id}/reset-password` (blanqueo o reseteo de claves de soporte técnico).
    * `GET /api/v1/admin/telemetria` (estado de conexión PostgreSQL, sesiones concurrentes y uptime).
  - Frontend: Construir `GestionUsuariosPage.jsx` para reemplazar el placeholder actual de `/admin/usuarios`.

---

### Módulo M5 — Récipes Médicos Digitales & QR (60% Completado)
* **Lo que está listo:**
  - Componente modal oficial `Formato001Modal.jsx` con división en dos columnas reglamentarias: *Rp. Prescripción* (para farmacia) e *Indicaciones* (para el paciente).
  - Incorporación del Formato 001 como folio documental anexo al expediente inmutable.
  - Visualización de récipes activos en la Billetera Digital del Paciente.
* **Lo que falta por construir:**
  - Endpoint dedicado `sistema/backend/app/api/v1/recetas.py` para almacenar las prescripciones en tabla propia con hash criptográfico SHA-256 inalterable.
  - Vista del médico `/medico/recetas` para emisión directa con recetario rápido y catálogo farmacéutico básico.

---

### Módulo M6 — Teleasistencia Hospitalaria 24H (15% Completado)
* **Lo que está listo:**
  - Permisos RBAC en base de datos (`teleconsulta:iniciar`, `teleconsulta:unirse`).
  - Panel de soberanía de datos en el portal del paciente con switch interactivo para autorizar u omitir teleasistencia remota.
* **Lo que falta por construir:**
  - Módulo de videoconsulta WebRTC / Jitsi integrado o canal de telemonitoreo con chat clínico y notas de teleconsulta.

---

### Módulo M7 — Auditoría Inmutable Forense (70% Completado)
* **Lo que está listo:**
  - Tabla `auditoria_accesos` con trazabilidad absoluta: fecha, hora, usuario, rol, IP de origen, entidad afectada y acción realizada.
  - Sanitización estricta de IPs (tipo `INET` de PostgreSQL) y registro automático en todos los endpoints de autenticación, admisión, cambios de perfil y consulta de historias.
* **Lo que falta por construir:**
  - Interfaz visual para el Administrador en `/admin/auditoria` con filtros de búsqueda por cédula, rango de fechas, IP y tipo de acción para auditorías médico-legales.

---

### Billetera Digital del Paciente (Portal del Paciente) (95% Completado)
* **Lo que está listo y probado:**
  - Carnet Clínico Biométrico de alta fidelidad con tipografía monospace y datos esenciales.
  - Código QR Vital Offline ISO/IEC 18004 con información de primeros auxilios (filiación, tipo de sangre, alergias críticas y contacto de auxilio) preservando la intimidad de diagnósticos y tratamientos.
  - Autogestión de datos vitales (sangre/alergias) y datos de contacto/domicilio (teléfonos, dirección, municipio) con auditoría inmutable.
  - Panel de soberanía de datos con switches para habilitar/restringir visualización de historial o código QR público.

---

## 🎯 Plan de Trabajo para la Culminación del Proyecto

Para cerrar el sistema al 100% de cara a la defensa del Trabajo Especial de Grado, los pasos exactos a desarrollar en orden son:

1. **Sprint 1 (Soporte y Control — Inmediato):** Módulo M4 completo (Gestión de personal hospitalario, activación/desactivación y visor forense de auditoría M7).
2. **Sprint 2 (Estación Médica Completa):** Módulo M5 (Emisión directa de récipes en `/medico/recetas` con firma SHA-256) y vistas generales de historias M2 (`/medico/historias`).
3. **Sprint 3 (Exportación y Cierre):** Exportación de reportes PDF/Excel para M1 y M3.
4. **Sprint 4 (Teleconsulta):** Módulo M6 de teleasistencia básica WebRTC.
