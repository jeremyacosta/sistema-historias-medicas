---
name: qa-clinical-audit
description: >-
  Use this skill to perform automated quality assurance audits, end-to-end endpoint verification,
  database consistency checks, and UI build/responsive validation before declaring any task complete.
---

# Flujo de Trabajo: Auditoría y Control de Calidad Clínico

Este procedimiento permite ejecutar una batería completa de pruebas automáticas para garantizar que el sistema mantenga una estabilidad del 100%.

## Pasos de Auditoría

### 1. Auditoría de Base de Datos (PostgreSQL)
Ejecutar la verificación de integridad referencial y recuento de registros:
```powershell
$env:PGPASSWORD = "admin1234"
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d hospital_baquero -c "
  SELECT table_name, (xpath('/row/cnt/text()', xml_count))[1]::text::int as total
  FROM (
    SELECT table_name, table_schema, 
           query_to_xml(format('select count(*) as cnt from %I.%I', table_schema, table_name), false, true, '') as xml_count
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  ) t ORDER BY total DESC;
"
```

### 2. Prueba de Humo de Endpoints (Backend FastAPI)
Ejecutar la suite de pruebas HTTP en vivo contra el servidor activo:
```powershell
sistema\backend\venv\Scripts\python -c "
import urllib.request, json
# Verificar Health
resp = urllib.request.urlopen('http://127.0.0.1:8000/health')
assert resp.status == 200, 'Health check fallo'
# Verificar Swagger
resp = urllib.request.urlopen('http://127.0.0.1:8000/docs')
assert resp.status == 200, 'Swagger no responde'
print('SMOKE TEST BACKEND: 100% OK')
"
```

### 3. Verificación de Compilación Frontend (Vite)
Garantizar que no existan errores de sintaxis, importaciones rotas o fallos de Tailwind:
```powershell
cd "sistema\frontend\portal"
npm run build
```

### 4. Verificación de Trazabilidad en Auditoría
Comprobar que las acciones recientes quedaron registradas en la tabla inmutable:
```powershell
$env:PGPASSWORD = "admin1234"
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d hospital_baquero -c "
  SELECT accion, usuario_cedula, exitoso, registrado_en 
  FROM auditoria_accesos ORDER BY registrado_en DESC LIMIT 5;
"
```
