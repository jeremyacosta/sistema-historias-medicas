---
name: clinical-module-builder
description: >-
  Use this skill whenever a new clinical module or hospital feature needs to be created or expanded.
  Enforces the full vertical stack: database DDL, ORM models, Pydantic schemas, FastAPI endpoints with
  RBAC and audit logging, and responsive React frontend components adhering to white clinical design.
---

# Flujo de Trabajo: Constructor de Módulos Clínicos

Este runbook define los 5 pasos obligatorios para construir cualquier nuevo módulo hospitalario en el sistema, asegurando que ningún desarrollador ni agente omita capas de seguridad o calidad.

## Pasos de Ejecución Obligatorios

### Paso 1: Base de Datos Relacional (`sistema/database/`)
1. Diseñar el script SQL DDL con nombres en `snake_case` y claves foráneas explícitas.
2. Definir claves primarias UUID (`uuid_generate_v4()`) o correlativos clínicos oficiales (ej. `HBG-2024-XXXXX`).
3. Crear índices para búsquedas frecuentes por `cedula` o `numero_historia`.
4. Incluir disparadores de actualización automática `actualizado_en` mediante la función `actualizar_timestamp()`.
5. Ejecutar y validar el script en PostgreSQL 16:
   ```powershell
   $env:PGPASSWORD = "admin1234"; & "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d hospital_baquero -f "sistema\database\<archivo>.sql"
   ```

### Paso 2: Capa ORM (`sistema/backend/app/models/`)
1. Crear el modelo SQLAlchemy heredando de `app.db.session.Base`.
2. Mapear todas las columnas, restricciones y relaciones bidireccionales (`relationship`).
3. Registrar el nuevo modelo en `sistema/backend/app/models/__init__.py`.

### Paso 3: Capa de Validación Pydantic (`sistema/backend/app/schemas/`)
1. Crear esquemas de entrada (`CreateRequest`, `UpdateRequest`) con validadores de formato.
2. Crear esquemas de salida (`Response`) con `from_attributes = True`.
3. Garantizar compatibilidad con el contrato universal `APIResponse`.

### Paso 4: Capa de Controladores y Endpoints (`sistema/backend/app/api/v1/`)
1. Crear el sub-router FastAPI con su respectivo `prefix` y `tags`.
2. Proteger cada endpoint sensible con la dependencia `require_permission('<codigo_permiso>')`.
3. Inyectar siempre el registro en la tabla `auditoria_accesos` tras cualquier operación de lectura/escritura sensible.
4. Registrar el router en `sistema/backend/app/api/v1/router.py`.
5. Verificar el endpoint en Swagger UI (`http://localhost:8000/docs`).

### Paso 5: Capa de Interfaz de Usuario React (`sistema/frontend/portal/src/`)
1. Crear el servicio de consumo HTTP en `src/api/<modulo>.js` utilizando `apiClient`.
2. Construir la vista React en `src/modules/<modulo>/<Vista>.jsx`.
3. Cumplir estrictamente con la **Regla Principal de Formato "Cosmos Medical / Clinical Command"**:
   - Header de comando clínico con telemetría del servicio y badges de protocolo MPPS.
   - Widgets HUD con barras de semáforo Manchester, micro-gráficos o progress rings.
   - Consolas y tablas de alta densidad con signos vitales en fila, semáforos iluminados y SLAs de espera.
   - Fondo blanco institucional (`bg-white` / `bg-slate-50`).
   - Cero emojis (usar únicamente SVG médicos de alta precisión).
   - 100% responsive (celulares, tablets y monitores).
4. Registrar la ruta protegida en `src/App.jsx`.
5. Probar en vivo en el navegador antes de presentar al usuario.
