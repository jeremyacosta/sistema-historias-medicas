"""
api/v1/router.py — Router Principal v1
========================================
Agrupa todos los sub-routers de la versión 1 de la API.
Instituto Municipal de Salud Ana Francisca Pérez de León.
"""

from fastapi import APIRouter
from app.api.v1 import auth, pacientes, historias, morbilidad, admin, recetas

api_router = APIRouter(prefix="/api/v1")

# ── Módulos registrados ───────────────────────────────────────
api_router.include_router(auth.router)
api_router.include_router(pacientes.router)
api_router.include_router(historias.router)
api_router.include_router(morbilidad.router)
api_router.include_router(admin.router)
api_router.include_router(recetas.router)
