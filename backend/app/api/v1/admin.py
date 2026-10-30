"""
api/v1/admin.py — Módulo M4: Gestión de Personal Hospitalario
==============================================================
Endpoints administrativos para manejo de personal, estado de cuentas
y telemetría del sistema.

Rutas registradas:
  GET    /api/v1/admin/usuarios           — Listar personal del sistema
  POST   /api/v1/admin/usuarios           — Alta de nuevo usuario
  PATCH  /api/v1/admin/usuarios/{id}/estado — Cambiar estado activo/suspendido/bloqueado
  POST   /api/v1/admin/usuarios/{id}/reset-password — Resetear contraseña
  GET    /api/v1/admin/telemetria         — Estado PostgreSQL y métricas del servidor
"""

from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.v1.auth import get_current_user, require_permission

router = APIRouter(prefix="/admin", tags=["Administración M4"])

# ── Schemas Pydantic ──────────────────────────────────────────

class UsuarioOut(BaseModel):
    id: int
    nombre: str
    apellido: str
    cedula: str
    rol: str
    correo: Optional[str] = None
    estado: str  # activo | suspendido | bloqueado
    creado_en: Optional[datetime] = None
    ultimo_acceso: Optional[datetime] = None

    class Config:
        from_attributes = True


class UsuarioCreate(BaseModel):
    nombre: str
    apellido: str
    cedula: str
    rol: str        # admin | medico | admision | enfermeria
    correo: Optional[str] = None
    telefono: Optional[str] = None
    especialidad: Optional[str] = None


class EstadoUpdate(BaseModel):
    estado: str     # activo | suspendido | bloqueado


class TelemetriaOut(BaseModel):
    bd_estado: str
    bd_version: Optional[str] = None
    sesiones_activas: int
    usuarios_totales: int
    usuarios_activos: int
    uptime_servidor: str
    timestamp: datetime


# ── Endpoints ─────────────────────────────────────────────────

@router.get(
    "/usuarios",
    response_model=List[UsuarioOut],
    summary="Listar personal hospitalario registrado",
    description="Devuelve la lista completa de usuarios del sistema con su estado y último acceso.",
)
def listar_usuarios(
    rol: Optional[str] = None,
    estado: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_permission("admin:total")),
):
    """
    Parámetros de filtro opcionales:
    - rol: medico | admision | admin | enfermeria
    - estado: activo | suspendido | bloqueado
    """
    from app.db.models import Usuario  # import local para evitar circularidades

    query = db.query(Usuario)
    if rol:
        query = query.filter(Usuario.rol == rol)
    if estado:
        query = query.filter(Usuario.estado == estado)

    return query.order_by(Usuario.nombre).all()


@router.post(
    "/usuarios",
    status_code=status.HTTP_201_CREATED,
    summary="Dar de alta un nuevo miembro del personal",
    description="Crea un usuario con contraseña temporal Test1234! que debe ser cambiada en el primer inicio de sesión.",
)
def crear_usuario(
    datos: UsuarioCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_permission("admin:total")),
):
    from app.db.models import Usuario
    from app.core.security import hash_password

    # Verificar que la cédula no esté duplicada
    existente = db.query(Usuario).filter(Usuario.cedula == datos.cedula).first()
    if existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe un usuario registrado con la cédula {datos.cedula}.",
        )

    usuario = Usuario(
        nombre=datos.nombre,
        apellido=datos.apellido,
        cedula=datos.cedula,
        rol=datos.rol,
        correo=datos.correo,
        hashed_password=hash_password("Test1234!"),
        estado="activo",
        debe_cambiar_pass=True,
        creado_en=datetime.utcnow(),
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)

    return {
        "mensaje": f"Usuario {datos.nombre} {datos.apellido} registrado correctamente.",
        "id": usuario.id,
        "cedula": usuario.cedula,
        "rol": usuario.rol,
        "estado": "activo",
    }


@router.patch(
    "/usuarios/{usuario_id}/estado",
    summary="Cambiar estado de acceso de un usuario",
    description="Permite activar, suspender o bloquear el acceso de un miembro del personal.",
)
def cambiar_estado(
    usuario_id: int,
    datos: EstadoUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_permission("admin:total")),
):
    from app.db.models import Usuario

    estados_validos = {"activo", "suspendido", "bloqueado"}
    if datos.estado not in estados_validos:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Estado inválido. Opciones: {', '.join(estados_validos)}.",
        )

    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")

    # Proteger la cuenta admin principal
    if usuario.cedula == "12345678" and datos.estado != "activo":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No se puede suspender ni bloquear la cuenta de administración principal del sistema.",
        )

    estado_anterior = usuario.estado
    usuario.estado = datos.estado
    db.commit()

    return {
        "mensaje": f"Estado del usuario actualizado: {estado_anterior} → {datos.estado}.",
        "id": usuario_id,
        "estado_anterior": estado_anterior,
        "estado_nuevo": datos.estado,
    }


@router.post(
    "/usuarios/{usuario_id}/reset-password",
    summary="Blanquear contraseña de un usuario",
    description="Resetea la contraseña a Test1234! y marca la cuenta para forzar cambio en el próximo inicio de sesión.",
)
def reset_password(
    usuario_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_permission("admin:total")),
):
    from app.db.models import Usuario
    from app.core.security import hash_password

    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")

    usuario.hashed_password = hash_password("Test1234!")
    usuario.debe_cambiar_pass = True
    db.commit()

    return {
        "mensaje": f"Contraseña de {usuario.nombre} {usuario.apellido} reseteada a temporal.",
        "id": usuario_id,
        "debe_cambiar_pass": True,
    }


@router.get(
    "/telemetria",
    response_model=TelemetriaOut,
    summary="Estado del sistema y métricas de PostgreSQL",
    description="Devuelve información de salud del servidor: versión BD, sesiones activas y conteo de usuarios.",
)
def telemetria(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_permission("admin:total")),
):
    from app.db.models import Usuario
    import platform

    # Intentar consultar versión de PostgreSQL
    try:
        result = db.execute("SELECT version()").fetchone()
        bd_version = result[0].split(",")[0] if result else "Desconocida"
        bd_estado = "operativa"
    except Exception:
        bd_version = None
        bd_estado = "error_conexion"

    # Sesiones activas en PostgreSQL
    try:
        sesiones = db.execute(
            "SELECT count(*) FROM pg_stat_activity WHERE state = 'active'"
        ).scalar()
    except Exception:
        sesiones = 0

    total    = db.query(Usuario).count()
    activos  = db.query(Usuario).filter(Usuario.estado == "activo").count()

    return TelemetriaOut(
        bd_estado=bd_estado,
        bd_version=bd_version,
        sesiones_activas=sesiones,
        usuarios_totales=total,
        usuarios_activos=activos,
        uptime_servidor=platform.node(),
        timestamp=datetime.utcnow(),
    )
