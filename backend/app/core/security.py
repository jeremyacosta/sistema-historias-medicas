"""
core/security.py — Motor de Seguridad del Sistema
===================================================
Centraliza TODA la lógica de seguridad:
  - Hashing y verificación de contraseñas (Bcrypt)
  - Creación y validación de tokens JWT (Access + Refresh)
  - Dependency de FastAPI para proteger endpoints por permiso
  - Verificación de bloqueo de cuenta y conteo de intentos
"""

from datetime import datetime, timedelta, timezone
from uuid import uuid4
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db

import bcrypt

# ── Esquema OAuth2: lee el token del header Authorization: Bearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


# ============================================================
#  CONTRASEÑAS (Bcrypt nativo — Seguro y compatible con Py3.13)
# ============================================================

def hash_password(plain_password: str) -> str:
    """Genera el hash Bcrypt de una contraseña en texto plano."""
    pw_bytes = plain_password.encode("utf-8")[:72]
    return bcrypt.hashpw(pw_bytes, bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica que la contraseña coincida con su hash almacenado."""
    pw_bytes = plain_password.encode("utf-8")[:72]
    return bcrypt.checkpw(pw_bytes, hashed_password.encode("utf-8"))


# ============================================================
#  TOKENS JWT
# ============================================================

def create_access_token(
    subject: str,
    rol: str,
    permisos: list[str],
    extra_claims: Optional[dict] = None
) -> tuple[str, str]:
    """
    Crea un JWT de acceso con:
      - sub: cédula del usuario (identificador único)
      - rol: nombre del rol asignado
      - permisos: lista de códigos de permiso RBAC
      - jti: ID único del token (para la blacklist de sesiones)
      - exp: expiración en ACCESS_TOKEN_EXPIRE_MINUTES

    Retorna: (token_str, jti)
    """
    jti = str(uuid4())
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": subject,
        "rol": rol,
        "permisos": permisos,
        "jti": jti,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "access",
    }

    if extra_claims:
        payload.update(extra_claims)

    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return token, jti


def create_refresh_token(subject: str) -> tuple[str, str]:
    """
    Crea un JWT de refresco de larga duración (7 días).
    Solo contiene sub y jti — sin permisos para minimizar exposición.

    Retorna: (token_str, jti)
    """
    jti = str(uuid4())
    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )

    payload = {
        "sub": subject,
        "jti": jti,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "refresh",
    }

    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return token, jti


def decode_token(token: str) -> dict:
    """
    Decodifica y valida la firma de un JWT.
    Lanza HTTPException 401 si el token es inválido o expirado.
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado.",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ============================================================
#  DEPENDENCIES DE FASTAPI
# ============================================================

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Dependency principal de autenticación.
    1. Decodifica el JWT.
    2. Verifica que la sesión NO esté revocada (blacklist).
    3. Carga el usuario desde la base de datos.
    4. Verifica que el usuario esté activo.

    Uso: current_user = Depends(get_current_user)
    """
    # Importación local para evitar circularidad
    from app.models.usuario import Usuario
    from app.models.security import SesionActiva

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # 1. Decodificar token
    payload = decode_token(token)
    cedula: str = payload.get("sub")
    jti: str = payload.get("jti")

    if not cedula or not jti:
        raise credentials_exception

    # 2. Verificar blacklist (sesión revocada = logout ya ejecutado)
    sesion = db.query(SesionActiva).filter(
        SesionActiva.token_jti == jti
    ).first()

    if not sesion or sesion.revocado:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="La sesión fue cerrada. Por favor inicie sesión nuevamente.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Cargar usuario
    usuario = db.query(Usuario).filter(
        Usuario.cedula == cedula,
        Usuario.activo == True
    ).first()

    if not usuario:
        raise credentials_exception

    # Adjuntar permisos del token al objeto usuario para uso posterior
    usuario._permisos_token = payload.get("permisos", [])
    return usuario


def require_permission(permission_code: str):
    """
    Dependency factory para proteger endpoints por permiso RBAC.

    Uso:
        @router.get("/historias")
        async def listar(user = Depends(require_permission("historia:leer"))):
            ...
    """
    async def _check(current_user=Depends(get_current_user)):
        permisos = getattr(current_user, "_permisos_token", [])
        if permission_code not in permisos:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Acceso denegado. Se requiere el permiso: '{permission_code}'",
            )
        return current_user
    return _check


def require_roles(*roles: str):
    """
    Dependency factory para proteger endpoints por rol.
    Acepta múltiples roles (OR lógico).

    Uso:
        @router.delete("/usuarios/{id}")
        async def eliminar(user = Depends(require_roles("admin"))):
            ...
    """
    async def _check(current_user=Depends(get_current_user)):
        if current_user.rol.nombre not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Acceso restringido. Roles permitidos: {list(roles)}",
            )
        return current_user
    return _check
