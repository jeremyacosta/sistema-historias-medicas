# Sistema Interoperable para la Gestión de Historias Médicas y Teleasistencia

**Caso de Estudio:** Hospital Dr. Ricardo Baquero González (Hospital Periférico de Petare)  
**Institución:** Universidad Santa María — Escuela de Ingeniería en Sistemas  
**Autores:** Jeremy Acosta & Eli Araujo  
**Tutora:** Prof. Hildren Morales  

---

## 📌 Descripción del Proyecto
Plataforma digital interoperable de salud con enfoque dual:
1. **Portal Web Hospitalario:** Gestión de Historias Clínicas (Emergencia Form. 051, Admisión Form. 052, Adultos Form. 230-232, Pediatría Form. 042-043), Visor de Rayos X / Ecos, Récipe Oficial Form. 001 con QR y Generación Automática de Morbilidad Diaria (Form. 004-008).
2. **App Móvil del Paciente (PWA):** Carnet digital QR de emergencia, acceso a historial médico, descarga de placas y récipes oficiales, alarma y seguimiento de adherencia al tratamiento (%), y sala de teleasistencia médica por videollamada.

---

## 🏗️ Estructura del Repositorio
```text
sistema-historias-medicas/
├── backend/          # API RESTful (Python + FastAPI + SQLAlchemy)
├── frontend/         # Portal Web Hospitalario y WebApp Paciente (React / Vite)
├── database/         # Scripts DDL / DML PostgreSQL (Basados en formatos oficiales)
└── docs/             # Documentación técnica, diagramas y especificaciones
```

---

## 🔄 Flujo de Trabajo en Equipo (Git)
Antes de comenzar cada jornada de desarrollo:
```bash
git pull origin main
```

Al finalizar las tareas o cambios probados:
```bash
git add .
git commit -m "feat: descripcion del cambio realizado"
git push origin main
```
