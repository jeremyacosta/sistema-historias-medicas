"""
api/v1/router.py — Router Principal v1
========================================
Agrupa todos los sub-routers de la versión 1 de la API.
Agregar aquí cada nuevo módulo (M1-M7) a medida que se construya.
"""

from fastapi import APIRouter
from app.api.v1 import auth, pacientes, historias, morbilidad

api_router = APIRouter(prefix="/api/v1")

# ── Módulos registrados ───────────────────────────────────────
api_router.include_router(auth.router)
api_router.include_router(pacientes.router)
api_router.include_router(historias.router)
api_router.include_router(morbilidad.router)

# ── Próximos módulos (descomentar al implementar) ─────────────
# from app.api.v1 import admision
# api_router.include_router(admision.router)

# from app.api.v1 import historias
# api_router.include_router(historias.router)

# from app.api.v1 import recetas
# api_router.include_router(recetas.router)

# from app.api.v1 import morbilidad
# api_router.include_router(morbilidad.router)

# from app.api.v1 import teleconsulta
# api_router.include_router(teleconsulta.router)
