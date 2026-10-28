"""
models/paciente.py — Modelo ORM: Paciente
==========================================
Mapea la tabla 'pacientes' con los campos del Formato Oficial 052
del Instituto Municipal de Salud Ana Francisca Pérez de León.
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Boolean, Column, Date, DateTime,
    ForeignKey, String, Text, CheckConstraint
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.session import Base


class Paciente(Base):
    __tablename__ = "pacientes"

    id                  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    numero_historia     = Column(String(20), nullable=False, unique=True, index=True)
    cedula              = Column(String(15), nullable=False, unique=True, index=True)
    nombre              = Column(String(100), nullable=False)
    apellido            = Column(String(100), nullable=False, index=True)
    fecha_nacimiento    = Column(Date, nullable=False)
    sexo                = Column(String(1), nullable=False)
    estado_civil        = Column(String(20))

    # Contacto y domicilio (Formato 052)
    direccion                       = Column(Text)
    municipio                       = Column(String(100))
    estado_residencia               = Column(String(100))
    telefono_principal              = Column(String(20))
    telefono_emergencia             = Column(String(20))
    nombre_contacto_emergencia      = Column(String(150))

    # Datos de salud básicos
    tipo_sangre         = Column(String(5))
    alergias_conocidas  = Column(Text)

    # Control de registro
    usuario_id          = Column(UUID(as_uuid=True), ForeignKey("usuarios.id"))
    creado_en           = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    actualizado_en      = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                                 onupdate=lambda: datetime.now(timezone.utc))
    activo              = Column(Boolean, default=True, nullable=False)

    # Relaciones
    usuario             = relationship("Usuario")
    politica_privacidad = relationship("PoliticaPrivacidadPaciente",
                                       back_populates="paciente",
                                       uselist=False,
                                       cascade="all, delete-orphan")

    @property
    def nombre_completo(self) -> str:
        return f"{self.nombre} {self.apellido}"

    def __repr__(self):
        return f"<Paciente(cedula='{self.cedula}', historia='{self.numero_historia}')>"


class PoliticaPrivacidadPaciente(Base):
    """
    Consentimientos del paciente sobre el uso de su información.
    Principio de Soberanía del Dato — Ley de Infogobierno (2013).
    """
    __tablename__ = "politica_privacidad_paciente"

    id                      = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    paciente_id             = Column(UUID(as_uuid=True), ForeignKey("pacientes.id"),
                                     nullable=False, unique=True)
    permite_ver_historia    = Column(Boolean, default=True, nullable=False)
    permite_teleconsulta    = Column(Boolean, default=True, nullable=False)
    permite_compartir_qr    = Column(Boolean, default=True, nullable=False)
    acepto_terminos         = Column(Boolean, default=False, nullable=False)
    fecha_aceptacion        = Column(DateTime(timezone=True))
    actualizado_en          = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                                     onupdate=lambda: datetime.now(timezone.utc))

    # Relaciones
    paciente                = relationship("Paciente", back_populates="politica_privacidad")

    def __repr__(self):
        return f"<Politica(paciente={self.paciente_id}, terminos={self.acepto_terminos})>"
