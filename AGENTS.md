# ============================================================
#  AGENTS.md — Reglas Obligatorias y Guía Maestra del Proyecto
#  Sistema Interoperable de Historias Médicas y Teleasistencia
#  Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"
# ============================================================

## 1. PROTOCOLO OBLIGATORIO DE DESARROLLO (REGLA DE ORO)
Todo agente, subagente o asistente de IA que opere en este repositorio DEBE seguir este ciclo cerrado sin excepción:

$$\text{1. Fase Creada} \longrightarrow \text{2. Fase Probada en Vivo} \longrightarrow \text{3. Reporte al Usuario} \longrightarrow \text{4. Aprobación Explícita} \longrightarrow \text{Pase a la Siguiente}$$

- **NUNCA** avanzar a un nuevo módulo o fase sin la confirmación y el visto bueno del usuario.
- **NUNCA** dar por terminado un cambio sin verificar su compilación y ejecución en vivo (FastAPI + Vite + PostgreSQL).

---

## 2. ESTÁNDARES DE DISEÑO VISUAL Y FRONTEND (UI/UX)
- **REGLA PRINCIPAL INQUEBRANTABLE — FORMATO VISUAL "COSMOS MEDICAL / CLINICAL COMMAND":**
  Todo componente, vista, dashboard o módulo del sistema DEBE construirse obligatoriamente bajo el lenguaje de diseño visual de alta fidelidad **Cosmos Medical** (referencia: *Epic Systems Cosmos*, *Linear Healthcare*, *NHS Digital System*). Queda terminantemente prohibido el uso de interfaces planas, cajas vacías genéricas, estilos tipo plantilla bootstrap o aspectos infantiles. Todo desarrollo debe cumplir:
  1. **Headers de Comando Clínico:** Telemetría en vivo del servicio activo, datos del profesional (nombre, rol, matrícula MPPS, turno activo con tiempo transcurrido, cédula), reloj tabular en tiempo real y botón de acción principal de alto impacto con micro-interacción.
  2. **Widgets HUD de Alta Densidad:** Métricas clave con barras de distribución porcentual de semáforo Manchester (Niveles I a V), micro-gráficos/sparklines, badges de estado con pulse animado, datos tabulares (`tabular-nums`) y progress rings.
  3. **Consolas Clínicas de Emergencia:** Tablas con HUD de signos vitales integrados en fila (T.A., SpO₂, FC, T°), semáforo Manchester con punto pulsante iluminado, contadores SLA de tiempo de espera real vs reglamentario, y botones directos de acción clínica (*"Atender F-052"*).
  4. **Billetera Digital del Paciente:** Estilo carnet clínico biométrico de alta gama, chip EMV médico, código QR vital offline ISO/IEC 18004 con marco escaneable de emergencia, prescripciones verificadas con hash criptográfico SHA-256 y paneles de consentimiento/soberanía de datos con switches interactivos.
  5. **Sidebars Especializados:** Hospitalario en azul navy profundo (`#091528`), Paciente en verde esmeralda profundo (`#022c22`), con halos de estado, badges de protocolo (M1, M2, M5, M6) y perfiles integrados.

- **Fondo Blanco Institucional:** Prohibido el uso de modo oscuro en el área de trabajo clínico, degradados negros o interfaces tipo videojuego. Los fondos de trabajo deben ser blanco puro (`#ffffff`) o gris clínico perla (`#f8fafc`).
- **Cero Emojis en Código Clínico:** Prohibido el uso de emojis (`🚨`, `💊`, `📋`, `🪪`, etc.) en componentes de producción. Toda la iconografía debe ser SVG vectorial médica uniforme, sobria y profesional.
- **100% Responsive Obligatorio:** Todo componente, tabla, formulario o modal debe adaptarse fluidamente a dispositivos móviles (`< 768px`), tablets y monitores de alta resolución sin desbordamientos horizontales.
- **Identidad Institucional Exacta:**
  - Nombre: **Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León"**.
  - Entidad: Ministerio del Poder Popular para la Salud (MPPS) · Distrito Sanitario N° 7.
  - Academia: Universidad Santa María (USM) · Escuela de Ingeniería de Sistemas · 2026.
  - Autores: Jeremy Acosta & Eli Araujo · Tutor: Prof. Hildren Morales.

---

## 3. ESTÁNDARES DE BACKEND Y SEGURIDAD (FASTAPI + POSTGRESQL)
- **Base de Datos:** Motor oficial PostgreSQL 16 en puerto 5432. Toda alteración estructural debe quedar registrada en `database/*.sql`.
- **Contrato Universal de API:**
  - Éxito: `{"status": "success", "data": {...}, "message": "..."}`
  - Error: `{"status": "error", "error_code": 404, "message": "...", "details": []}`
- **Seguridad y Auditoría Inmutable:**
  - Toda consulta, edición o emisión de recetas/historias debe registrarse en la tabla `auditoria_accesos` con usuario, cédula, acción e IP.
  - El cierre de sesión (logout) debe ser real, revocando el identificador `token_jti` en la tabla `sesiones_activas`.
  - Contraseñas protegidas mediante hashing nativo Bcrypt con Salt Factor 12.

---

## 4. PACK DE HABILIDADES DISPONIBLES EN EL PROYECTO
Las siguientes habilidades especializadas están configuradas en `.agents/skills/`:
1. `clinical-module-builder`: Procedimiento estandarizado para construir cualquier nuevo módulo hospitalario (de BD a UI).
2. `qa-clinical-audit`: Protocolo de verificación y pruebas automatizadas de endpoints, base de datos y responsive.
3. `git-team-sync`: Flujo de trabajo de Git para sincronizar el trabajo de dos desarrolladores sin conflictos de fusión.
