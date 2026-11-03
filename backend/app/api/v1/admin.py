"""
api/v1/admin.py — Módulo M4: Gestión de Personal Hospitalario y Soporte
========================================================================
Endpoints administrativos para manejo de personal, estado de cuentas,
auditoría y telemetría del sistema.
Instituto Municipal de Salud Ana Francisca Pérez de León.
"""

from datetime import datetime, timezone
from typing import Optional, List, Union
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.db.session import get_db
from app.core.security import get_current_user, require_roles, hash_password
from app.models.usuario import Usuario, Rol
from app.models.security import AuditoriaAcceso

router = APIRouter(prefix="/admin", tags=["Administración M4"])


# ── Schemas Pydantic ──────────────────────────────────────────

class UsuarioOut(BaseModel):
    id: Union[UUID, str]
    nombre: str
    apellido: str
    cedula: str
    rol: str
    correo: Optional[str] = None
    telefono: Optional[str] = None
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


def _serializar_usuario(u: Usuario) -> dict:
    rol_nombre = u.rol.nombre if u.rol else "desconocido"
    estado = "activo" if u.activo else "suspendido"
    return {
        "id": str(u.id),
        "nombre": u.nombre,
        "apellido": u.apellido,
        "cedula": u.cedula,
        "rol": rol_nombre,
        "correo": u.email,
        "telefono": u.telefono,
        "estado": estado,
        "creado_en": u.creado_en,
        "ultimo_acceso": u.ultimo_acceso,
    }


# ── Endpoints ─────────────────────────────────────────────────

@router.get(
    "/usuarios",
    response_model=List[UsuarioOut],
    summary="Listar personal hospitalario registrado",
)
def listar_usuarios(
    rol: Optional[str] = None,
    estado: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin")),
):
    query = db.query(Usuario)
    if rol:
        query = query.join(Rol).filter(Rol.nombre == rol)
    if estado:
        if estado == "activo":
            query = query.filter(Usuario.activo == True)
        elif estado in ("suspendido", "bloqueado"):
            query = query.filter(Usuario.activo == False)

    usuarios = query.order_by(Usuario.nombre).all()
    return [_serializar_usuario(u) for u in usuarios]


@router.post(
    "/usuarios",
    status_code=status.HTTP_201_CREATED,
    summary="Dar de alta un nuevo miembro del personal",
)
def crear_usuario(
    datos: UsuarioCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin")),
):
    existente = db.query(Usuario).filter(Usuario.cedula == datos.cedula.strip()).first()
    if existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe un usuario registrado con la cédula {datos.cedula}.",
        )

    rol_obj = db.query(Rol).filter(Rol.nombre == datos.rol.lower().strip()).first()
    if not rol_obj:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El rol '{datos.rol}' no existe en el sistema.",
        )

    usuario = Usuario(
        nombre=datos.nombre.strip(),
        apellido=datos.apellido.strip(),
        cedula=datos.cedula.strip(),
        rol_id=rol_obj.id,
        email=datos.correo.strip() if datos.correo else None,
        telefono=datos.telefono.strip() if datos.telefono else None,
        password_hash=hash_password("Test1234!"),
        activo=True,
        debe_cambiar_pass=True,
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)

    return {
        "mensaje": f"Usuario {datos.nombre} {datos.apellido} registrado correctamente.",
        "id": str(usuario.id),
        "cedula": usuario.cedula,
        "rol": rol_obj.nombre,
        "estado": "activo",
    }


@router.patch(
    "/usuarios/{usuario_id}/estado",
    summary="Cambiar estado de acceso de un usuario",
)
def cambiar_estado(
    usuario_id: str,
    datos: EstadoUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin")),
):
    estados_validos = {"activo", "suspendido", "bloqueado"}
    if datos.estado not in estados_validos:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Estado inválido. Opciones: {', '.join(estados_validos)}.",
        )

    try:
        uid = UUID(usuario_id)
        usuario = db.query(Usuario).filter(Usuario.id == uid).first()
    except ValueError:
        usuario = db.query(Usuario).filter(Usuario.cedula == usuario_id).first()

    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")

    if usuario.cedula == "12345678" and datos.estado != "activo":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No se puede suspender ni bloquear la cuenta de administración principal del sistema.",
        )

    estado_anterior = "activo" if usuario.activo else "suspendido"
    usuario.activo = (datos.estado == "activo")
    db.commit()

    return {
        "mensaje": f"Estado del usuario actualizado: {estado_anterior} → {datos.estado}.",
        "id": str(usuario.id),
        "estado_anterior": estado_anterior,
        "estado_nuevo": datos.estado,
    }


@router.post(
    "/usuarios/{usuario_id}/reset-password",
    summary="Blanquear contraseña de un usuario",
)
def reset_password(
    usuario_id: str,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin")),
):
    try:
        uid = UUID(usuario_id)
        usuario = db.query(Usuario).filter(Usuario.id == uid).first()
    except ValueError:
        usuario = db.query(Usuario).filter(Usuario.cedula == usuario_id).first()

    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")

    usuario.password_hash = hash_password("Test1234!")
    usuario.debe_cambiar_pass = True
    db.commit()

    return {
        "mensaje": f"Contraseña de {usuario.nombre} {usuario.apellido} reseteada a temporal (Test1234!).",
        "id": str(usuario.id),
        "debe_cambiar_pass": True,
    }


@router.get(
    "/telemetria",
    response_model=TelemetriaOut,
    summary="Estado del sistema y métricas de PostgreSQL",
)
def telemetria(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin")),
):
    import platform

    try:
        result = db.execute(text("SELECT version()")).fetchone()
        bd_version = result[0].split(",")[0] if result else "PostgreSQL 16"
        bd_estado = "operativa"
    except Exception:
        bd_version = None
        bd_estado = "error_conexion"

    try:
        sesiones = db.execute(
            text("SELECT count(*) FROM sesiones_activas WHERE revocado = false")
        ).scalar() or 0
    except Exception:
        sesiones = 0

    total = db.query(Usuario).count()
    activos = db.query(Usuario).filter(Usuario.activo == True).count()

    return TelemetriaOut(
        bd_estado=bd_estado,
        bd_version=bd_version,
        sesiones_activas=sesiones,
        usuarios_totales=total,
        usuarios_activos=activos,
        uptime_servidor=platform.node(),
        timestamp=datetime.now(timezone.utc),
    )
