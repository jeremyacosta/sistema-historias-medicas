"""
models/morbilidad.py — Modelo ORM: Actividades Clínicas y Morbilidad (M3)
==========================================================================
Mapea la tabla 'actividades_morbilidad' para el control de pacientes atendidos,
actividad y rendimiento del médico, y reportes estadísticos diarios y por cédula.
Instituto Municipal de Salud Ana Francisca Pérez de León.
"""

import uuid
from datetime import date, time, datetime, timezone
from sqlalchemy import (
    Boolean, Column, Date, Time, DateTime,
    ForeignKey, String, Text
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.session import Base


class ActividadMorbilidad(Base):
    """
    Registro diario de atenciones de morbilidad por servicio y médico tratante.
    Permite auditar y consultar:
      1. Chequeo por día (todas las atenciones del hospital o servicio en una fecha).
      2. Chequeo por cédula (historial de morbilidad del paciente).
      3. Control de productividad y consultas realizadas por doctor.
    """
    __tablename__ = "actividades_morbilidad"

    id                   = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    paciente_id          = Column(UUID(as_uuid=True), ForeignKey("pacientes.id"), nullable=False, index=True)
    cedula_paciente      = Column(String(15), nullable=False, index=True)
    nombre_paciente      = Column(String(150), nullable=False)
    numero_historia      = Column(String(20), nullable=False, index=True)

    # Identificación del Médico Tratante
    medico_id            = Column(UUID(as_uuid=True), ForeignKey("usuarios.id"), nullable=False, index=True)
    medico_nombre        = Column(String(150), nullable=False)
    medico_cedula        = Column(String(15), nullable=False)

    servicio             = Column(String(100), nullable=False, default="Emergencia Adultos", index=True)
    tipo_atencion        = Column(String(50), nullable=False, default="Emergencia")

    # Datos Clínicos y Epidemiológicos
    motivo_atencion      = Column(Text, nullable=False)
    diagnostico_cie10    = Column(String(20))
    diagnostico_desc     = Column(Text)
    conducta_tratamiento = Column(Text)
    destino_egreso       = Column(String(50), nullable=False, default="Alta Médica")

    # Registro de Tiempos
    fecha_actividad      = Column(Date, nullable=False, default=date.today, index=True)
    hora_actividad       = Column(Time, nullable=False, default=lambda: datetime.now(timezone.utc).time())

    # Auditoría
    registrado_en        = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    actualizado_en       = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                                  onupdate=lambda: datetime.now(timezone.utc))
    activo               = Column(Boolean, default=True, nullable=False)

    # Relaciones
    paciente             = relationship("Paciente")
    medico               = relationship("Usuario", foreign_keys=[medico_id])

    def __repr__(self):
        return f"<ActividadMorbilidad(fecha={self.fecha_actividad}, paciente={self.cedula_paciente}, medico={self.medico_nombre})>"
