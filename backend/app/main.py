"""
main.py — Instancia Principal FastAPI
=======================================
Punto de entrada del backend. Configura:
  - Instancia FastAPI con metadatos del sistema
  - Middleware CORS (acceso desde el frontend React)
  - Middleware de seguridad (cabeceras HTTP)
  - Registro de todos los routers de la API
  - Endpoint /health (verificación de estado del sistema)
"""

from datetime import datetime, timezone
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

from app.core.config import settings
from app.api.v1.router import api_router

# ============================================================
#  INSTANCIA FASTAPI
# ============================================================
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="""
## 🏥 Sistema Interoperable de Historias Médicas y Teleasistencia

**Hospital Periférico de Petare "Dr. Ana Francisca Pérez de León" — MPPS Distrito Sanitario N° 7**

API REST para la gestión digital de expedientes clínicos, récipes con QR
y teleasistencia entre médicos y pacientes.

### Autores
- Jeremy Acosta — C.I: 30.047.210
- Eli Araujo — C.I: 29.921.654

### Tutor Académico
Prof. Hildren Morales — Universidad Santa María

### Seguridad
Todos los endpoints (excepto `/health` y `/auth/login`) requieren un
**Bearer Token JWT** obtenido desde `POST /api/v1/auth/login`.
    """,
    docs_url="/docs",         # Swagger UI
    redoc_url="/redoc",       # ReDoc (alternativa)
    openapi_url="/openapi.json",
    contact={
        "name": "Equipo de Desarrollo — USM 2026",
        "email": "jacosta@usm.edu.ve",
    },
)

# ============================================================
#  MIDDLEWARE: CORS
#  Permite que el frontend React acceda al backend
# ============================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_origin_regex=r"^http://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
#  MIDDLEWARE: Cabeceras de Seguridad HTTP
#  Protege contra ataques comunes: XSS, clickjacking, sniffing
# ============================================================
@app.middleware("http")
async def security_headers(request: Request, call_next):
    """Añade cabeceras de seguridad a todas las respuestas."""
    if request.method == "OPTIONS":
        return await call_next(request)

    start_time = time.time()
    response = await call_next(request)

    # Tiempo de procesamiento (útil para debugging)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"

    # Cabeceras de seguridad estándar
    response.headers["X-Content-Type-Options"]    = "nosniff"
    response.headers["X-Frame-Options"]           = "DENY"
    response.headers["X-XSS-Protection"]          = "1; mode=block"
    response.headers["Referrer-Policy"]           = "strict-origin-when-cross-origin"
    response.headers["Cache-Control"]             = "no-store"

    return response

# ============================================================
#  MANEJO GLOBAL DE ERRORES — Formato estándar de respuesta
# ============================================================
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Captura errores no controlados y retorna respuesta estándar."""
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "error_code": 500,
            "message": "Error interno del servidor. El equipo técnico fue notificado.",
            "details": [],
        }
    )

# ============================================================
#  ROUTERS DE LA API
# ============================================================
app.include_router(api_router)

# ============================================================
#  ENDPOINT: /health — Estado del sistema
#  Público: no requiere autenticación.
#  Usado por monitoreo y verificación de despliegue.
# ============================================================
@app.get("/health", tags=["⚙️ Sistema"], summary="Estado del sistema")
async def health_check():
    """
    Verifica que el servidor esté en funcionamiento.
    Retorna la versión, entorno y timestamp UTC actual.
    """
    return {
        "status": "success",
        "data": {
            "sistema": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "entorno": settings.APP_ENV,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "docs": "http://localhost:8000/docs",
        },
        "message": "Sistema operativo y en línea.",
    }

# ============================================================
#  ARRANQUE DIRECTO (para desarrollo)
#  Producción: usar gunicorn + uvicorn workers
# ============================================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.APP_HOST,
        port=settings.APP_PORT,
        reload=settings.APP_DEBUG,
        log_level="debug" if settings.APP_DEBUG else "info",
    )
