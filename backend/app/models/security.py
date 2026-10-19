"""
models/security.py — Modelos ORM: Seguridad y Auditoría
=========================================================
Mapea las tablas de seguridad del sistema:
  - SesionActiva    → Blacklist de tokens JWT (logout real)
  - IntentoLogin    → Registro de intentos de acceso
  - BloqueosCuenta  → Bloqueos temporales por intentos fallidos
  - AuditoriaAcceso → Log inmutable de acciones clínicas
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Boolean, Column, DateTime, ForeignKey,
    Integer, String, Text
)
from sqlalchemy.dialects.postgresql import UUID, INET
from sqlalchemy.orm import relationship

from app.db.session import Base


class SesionActiva(Base):
    """
    Registro de cada JWT emitido.
    Permite logout real: un token marcado como revocado
    es rechazado aunque su firma criptográfica sea válida.
    """
    __tablename__ = "sesiones_activas"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id  = Column(UUID(as_uuid=True), ForeignKey("usuarios.id", ondelete="CASCADE"),
                         nullable=False, index=True)
    token_jti   = Column(String(36), nullable=False, unique=True, index=True)
    ip_origen   = Column(INET)
    dispositivo = Column(Text)
    expira_en   = Column(DateTime(timezone=True), nullable=False)
    revocado    = Column(Boolean, default=False, nullable=False, index=True)
    revocado_en = Column(DateTime(timezone=True))
    creado_en   = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relaciones
    usuario     = relationship("Usuario", back_populates="sesiones")

    def __repr__(self):
        return f"<Sesion(jti='{self.token_jti}', revocado={self.revocado})>"


class IntentoLogin(Base):
    """
    Registro de cada intento de inicio de sesión.
    Usado para detección de fuerza bruta y bloqueo automático.
    """
    __tablename__ = "intentos_login"

    id            = Column(Integer, primary_key=True)
    cedula        = Column(String(15), nullable=False, index=True)
    ip_origen     = Column(INET)
    exitoso       = Column(Boolean, default=False, nullable=False)
    mensaje_fallo = Column(String(100))
    intentado_en  = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                           index=True)

    def __repr__(self):
        return f"<IntentoLogin(cedula='{self.cedula}', exitoso={self.exitoso})>"


class BloqueosCuenta(Base):
    """
    Bloqueos temporales de cuenta por intentos fallidos excesivos.
    Regla: 5 intentos fallidos en 15 min → bloqueo de 30 minutos.
    """
    __tablename__ = "bloqueos_cuenta"

    id              = Column(Integer, primary_key=True)
    cedula          = Column(String(15), nullable=False, index=True)
    bloqueado_hasta = Column(DateTime(timezone=True), nullable=False)
    motivo          = Column(Text)
    intentos        = Column(Integer, default=5, nullable=False)
    creado_en       = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<Bloqueo(cedula='{self.cedula}', hasta={self.bloqueado_hasta})>"


class AuditoriaAcceso(Base):
    """
    Registro INMUTABLE de todas las acciones sobre datos clínicos.
    NUNCA se deben emitir UPDATE ni DELETE sobre esta tabla.
    El backend nunca llama a db.delete() sobre instancias de esta clase.
    """
    __tablename__ = "auditoria_accesos"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # ¿Quién?
    usuario_id      = Column(UUID(as_uuid=True), ForeignKey("usuarios.id"), nullable=True)
    usuario_cedula  = Column(String(15))
    usuario_rol     = Column(String(50))
    # ¿Qué?
    accion          = Column(String(80), nullable=False)
    descripcion     = Column(Text)
    # ¿Sobre qué?
    entidad         = Column(String(50))
    entidad_id      = Column(Text)
    paciente_cedula = Column(String(15), index=True)
    # ¿Desde dónde?
    ip_origen       = Column(INET)
    modulo          = Column(String(50))
    # ¿Resultado?
    exitoso         = Column(Boolean, default=True, nullable=False)
    detalle_error   = Column(Text)
    registrado_en   = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                             index=True)

    def __repr__(self):
        return f"<Auditoria(accion='{self.accion}', cedula='{self.usuario_cedula}')>"
