"""
models/__init__.py — Registro central de modelos ORM
======================================================
Importa todos los modelos para que SQLAlchemy los registre
en el metadata de Base. Necesario para que Alembic detecte
los cambios y genere las migraciones correctamente.
"""

from app.models.usuario  import Rol, Permiso, RolPermiso, Usuario       # noqa: F401
from app.models.paciente import Paciente, PoliticaPrivacidadPaciente     # noqa: F401
from app.models.historia import HistoriaEmergencia051                    # noqa: F401
from app.models.morbilidad import ActividadMorbilidad                    # noqa: F401
from app.models.security import (                                         # noqa: F401
    SesionActiva,
    IntentoLogin,
    BloqueosCuenta,
    AuditoriaAcceso,
)
