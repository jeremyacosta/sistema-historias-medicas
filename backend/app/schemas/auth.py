"""
schemas/auth.py — Schemas Pydantic: Autenticación
===================================================
Define los contratos de entrada y salida (validación)
para todos los endpoints de autenticación.
Pydantic garantiza que los datos inválidos nunca lleguen
a la lógica de negocio ni a la base de datos.
"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, field_validator, EmailStr
import re


# ============================================================
#  ENTRADA — Lo que el cliente envía al servidor
# ============================================================

class LoginRequest(BaseModel):
    """Credenciales para iniciar sesión."""
    cedula:   str
    password: str

    @field_validator("cedula")
    @classmethod
    def cedula_valida(cls, v: str) -> str:
        v = v.strip().upper()
        # Normalizar: remover prefijos como 'V-', 'E-', 'V', etc. si existen
        v = re.sub(r"^[VEJPGvejpg]-?", "", v)
        if not re.match(r"^\d{6,15}$", v):
            raise ValueError("La cédula debe contener entre 6 y 15 dígitos numéricos.")
        return v

    @field_validator("password")
    @classmethod
    def password_no_vacio(cls, v: str) -> str:
        if not v or len(v.strip()) < 6:
            raise ValueError("La contraseña debe tener al menos 6 caracteres.")
        return v


class RefreshTokenRequest(BaseModel):
    """Token de refresco para obtener un nuevo access token."""
    refresh_token: str


# ============================================================
#  SALIDA — Lo que el servidor responde al cliente
# ============================================================

class TokenResponse(BaseModel):
    """Respuesta exitosa de login con tokens JWT."""
    access_token:  str
    refresh_token: str
    token_type:    str = "bearer"
    expires_in:    int                 # Segundos hasta expiración
    rol:           str
    permisos:      list[str]


class UsuarioPublico(BaseModel):
    """Datos del usuario autenticado (sin información sensible)."""
    id:             UUID
    cedula:         str
    nombre:         str
    apellido:       str
    nombre_completo: str
    email:          str | None
    telefono:       str | None
    rol:            str
    ultimo_acceso:  datetime | None
    creado_en:      datetime

    model_config = {"from_attributes": True}


class MeResponse(BaseModel):
    """Respuesta del endpoint /auth/me — perfil del usuario actual."""
    usuario:    UsuarioPublico
    permisos:   list[str]
    sesion_id:  str


# ============================================================
#  RESPUESTA ESTÁNDAR — Contrato universal de la API
# ============================================================

class APIResponse(BaseModel):
    """
    Contrato estándar de respuesta de la API.
    Todos los endpoints retornan este formato sin excepción.

    Éxito:  {"status": "success", "data": {...}, "message": "..."}
    Error:  {"status": "error",   "error_code": 404, "message": "...", "details": []}
    """
    status:     str
    data:       dict | list | None = None
    message:    str
    error_code: int | None = None
    details:    list[str] = []

    @classmethod
    def success(cls, data=None, message: str = "Operación completada con éxito") -> "APIResponse":
        return cls(status="success", data=data, message=message)

    @classmethod
    def error(cls, message: str, error_code: int = 400, details: list[str] = []) -> "APIResponse":
        return cls(status="error", message=message, error_code=error_code, details=details)
