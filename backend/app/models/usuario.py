"""
models/usuario.py — Modelos ORM: Rol, Permiso y Usuario
=========================================================
Mapea las tablas de roles, permisos, rol_permisos y usuarios
a clases Python usando SQLAlchemy 2.0.
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Boolean, Column, DateTime, ForeignKey,
    Integer, String, Text
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.session import Base


class Rol(Base):
    __tablename__ = "roles"

    id          = Column(Integer, primary_key=True, index=True)
    nombre      = Column(String(50), nullable=False, unique=True)
    descripcion = Column(Text)
    creado_en   = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo      = Column(Boolean, default=True, nullable=False)

    # Relaciones
    usuarios    = relationship("Usuario", back_populates="rol")
    permisos    = relationship("Permiso", secondary="rol_permisos", back_populates="roles")

    def __repr__(self):
        return f"<Rol(nombre='{self.nombre}')>"


class Permiso(Base):
    __tablename__ = "permisos"

    id          = Column(Integer, primary_key=True)
    codigo      = Column(String(80), nullable=False, unique=True)
    descripcion = Column(Text)
    modulo      = Column(String(50), nullable=False)

    # Relación M2M con Rol
    roles       = relationship("Rol", secondary="rol_permisos", back_populates="permisos")

    def __repr__(self):
        return f"<Permiso(codigo='{self.codigo}')>"


class RolPermiso(Base):
    """Tabla de unión M2M entre Rol y Permiso (RBAC)."""
    __tablename__ = "rol_permisos"

    rol_id      = Column(Integer, ForeignKey("roles.id",     ondelete="CASCADE"), primary_key=True)
    permiso_id  = Column(Integer, ForeignKey("permisos.id",  ondelete="CASCADE"), primary_key=True)


class Usuario(Base):
    __tablename__ = "usuarios"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cedula          = Column(String(15), nullable=False, unique=True, index=True)
    nombre          = Column(String(100), nullable=False)
    apellido        = Column(String(100), nullable=False)
    email           = Column(String(150), unique=True, index=True)
    telefono        = Column(String(20))
    password_hash   = Column(Text, nullable=False)
    rol_id          = Column(Integer, ForeignKey("roles.id"), nullable=False)
    activo          = Column(Boolean, default=True, nullable=False)
    ultimo_acceso   = Column(DateTime(timezone=True))
    creado_en       = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    actualizado_en  = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                             onupdate=lambda: datetime.now(timezone.utc))

    # Control de Onboarding y Recuperación de Pacientes
    debe_cambiar_pass        = Column(Boolean, default=False, nullable=False)
    pregunta_seguridad       = Column(String(200), nullable=True)
    respuesta_seguridad_hash = Column(Text, nullable=True)
    telefono_verificado      = Column(Boolean, default=False, nullable=False)
    email_verificado         = Column(Boolean, default=False, nullable=False)

    # Relaciones
    rol             = relationship("Rol", back_populates="usuarios")
    sesiones        = relationship("SesionActiva", back_populates="usuario",
                                   cascade="all, delete-orphan")

    @property
    def nombre_completo(self) -> str:
        return f"{self.nombre} {self.apellido}"

    @property
    def permisos_lista(self) -> list[str]:
        """Retorna la lista de códigos de permiso del rol del usuario."""
        if self.rol and self.rol.permisos:
            return [p.codigo for p in self.rol.permisos]
        return []

    def __repr__(self):
        return f"<Usuario(cedula='{self.cedula}', rol='{self.rol.nombre if self.rol else None}')>"
