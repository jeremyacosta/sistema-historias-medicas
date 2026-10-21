# ============================================================
#  README.md — Sistema Interoperable de Historias Médicas
#  Hospital Dr. Ricardo Baquero González — Petare, Caracas
#  Universidad Santa María | Ingeniería de Sistemas | 2026
# ============================================================

# 🏥 Sistema Interoperable de Historias Médicas y Teleasistencia

**Autores:** Jeremy Acosta (C.I: 30.047.210) — Eli Araujo (C.I: 29.921.654)  
**Tutor Académico:** Prof. Hildren Morales  
**Universidad Santa María — Facultad de Ingeniería y Arquitectura**

---

## 📁 Estructura del Proyecto

```
sistema/
├── database/              # Esquemas SQL y datos de prueba
│   ├── 01_schema.sql      # Tablas: roles, usuarios, pacientes
│   └── 02_seed_data.sql   # Datos de prueba para desarrollo
├── backend/               # API REST (Python 3.11+ / FastAPI)
│   ├── app/
│   │   ├── core/          # Configuración, seguridad JWT
│   │   ├── db/            # Conexión PostgreSQL (SQLAlchemy)
│   │   ├── models/        # Modelos ORM de base de datos
│   │   ├── schemas/       # Validaciones Pydantic
│   │   └── api/v1/        # Endpoints por módulo clínico
│   └── requirements.txt
├── frontend/              # Portal Web + App (React.js / Vite)
│   └── src/
│       ├── api/           # Cliente HTTP (Axios + contrato JSON)
│       ├── components/    # Componentes reutilizables
│       ├── layouts/       # HospitalLayout / PacienteLayout
│       └── modules/       # Vistas por módulo (M1-M7 / P1-P7)
├── .gitignore
├── .env.example           # ⚠️ Copiar a .env y rellenar localmente
└── README.md
```

---

## ⚡ Arranque Rápido del Proyecto

### Pre-requisitos
- PostgreSQL 15+ instalado y corriendo en `localhost:5432`
- Python 3.11+ con pip
- Node.js 18+ con npm

### 1. Clonar y Configurar Entorno

```bash
# Clonar el repositorio
git clone <URL_REPOSITORIO>
cd sistema

# Copiar plantilla de variables de entorno
copy .env.example .env        # Windows
# cp .env.example .env        # Linux/Mac

# → Abrir .env y completar DB_USER, DB_PASSWORD y SECRET_KEY
```

### 2. Preparar la Base de Datos

```bash
# Crear la base de datos en PostgreSQL
psql -U postgres -c "CREATE DATABASE hospital_baquero;"

# Ejecutar esquema y datos de prueba
psql -U postgres -d hospital_baquero -f database/01_schema.sql
psql -U postgres -d hospital_baquero -f database/02_seed_data.sql
psql -U postgres -d hospital_baquero -f database/03_security_schema.sql
```

### 3. Levantar el Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate         # Windows
# source venv/bin/activate    # Linux/Mac
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# → Swagger disponible en: http://localhost:8000/docs
```

### 4. Levantar el Frontend

```bash
cd frontend
npm install
npm run dev
# → Portal Web en: http://localhost:5173
```

---

## 🌿 Protocolo de Ramas Git (Obligatorio — 2 Desarrolladores)

```
main          ← Código estable y aprobado (solo merge desde dev)
dev           ← Integración continua (todos hacen merge aquí)
├── feature/jeremy-admision      ← Rama personal de Jeremy
└── feature/eli-paciente-app     ← Rama personal de Eli
```

### Rutina Diaria Obligatoria

```bash
# Al INICIAR la jornada (recibir cambios del compañero)
git checkout dev
git pull origin dev

# Trabajar en tu rama personal
git checkout feature/TU_NOMBRE-modulo
git merge dev   # integrar últimos cambios antes de programar

# Al TERMINAR una tarea probada
git add .
git commit -m "feat(modulo): descripcion clara del cambio"
git push origin feature/TU_NOMBRE-modulo

# Crear Pull Request → dev (revisión de compañero antes de merge)
```

---

## 🔒 Usuarios de Prueba (Solo Desarrollo)

| Rol       | Cédula   | Contraseña |
|-----------|----------|------------|
| Admin     | 12345678 | Test1234!  |
| Médico    | 18765432 | Test1234!  |
| Admisión  | 25333444 | Test1234!  |

> ⚠️ **NUNCA usar estas credenciales en el piloto real del hospital.**

---

## 📋 Contrato Estándar de Respuestas API

Todos los endpoints respetan este formato JSON sin excepción:

```json
// Éxito
{ "status": "success", "data": { ... }, "message": "Operación completada" }

// Error
{ "status": "error", "error_code": 404, "message": "Paciente no encontrado", "details": [] }
```

---

## 📌 Estado de Fases

| Fase | Descripción                        | Estado     |
|------|------------------------------------|------------|
| 0    | Cimientos: Estructura y BD Base    | ✅ Aprobada |
| 1    | Backend: Auth JWT + Admisión (M1)  | 🔲 Pendiente |
| 2    | Frontend: Portal de Admisión       | 🔲 Pendiente |
| 3    | Módulo Historia de Emergencia      | 🔲 Pendiente |
| 4    | Módulo Historia Adulto/Pediátrica  | 🔲 Pendiente |
| 5    | Récipes con Código QR              | 🔲 Pendiente |
| 6    | Morbilidad Diaria Automática       | 🔲 Pendiente |
| 7    | App Paciente + Carnet Digital      | 🔲 Pendiente |
| 8    | Teleasistencia (Videoconsulta)     | 🔲 Pendiente |
| 9    | Módulos IA (OCR + Agente Voz)      | 🔲 Pendiente |
| 10   | Prueba Piloto en el Hospital       | 🔲 Pendiente |
