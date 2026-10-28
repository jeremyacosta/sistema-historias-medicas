"""
models/historia.py — Modelo ORM: Historias Clínicas (051 y Expedientes)
========================================================================
Mapea la tabla 'historias_emergencia_051' correspondiente a la Historia
Clínica de Emergencia (F-051, 48 horas) del Instituto Municipal de Salud
"Ana Francisca Pérez de León".
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Boolean, Column, DateTime, ForeignKey,
    SmallInteger, Numeric, String, Text
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.session import Base


class HistoriaEmergencia051(Base):
    """
    Historia Clínica de Emergencia Oficial F-051 (Validez: 48 Horas).
    Atendida exclusivamente por Médico de Guardia para pacientes Manchester Nivel I y II.
    """
    __tablename__ = "historias_emergencia_051"

    id                  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    paciente_id         = Column(UUID(as_uuid=True), ForeignKey("pacientes.id"), nullable=False, index=True)
    numero_historia     = Column(String(20), nullable=False)
    cedula_paciente     = Column(String(15), nullable=False, index=True)
    medico_id           = Column(UUID(as_uuid=True), ForeignKey("usuarios.id"), nullable=False, index=True)
    fecha_atencion      = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)

    # Signos vitales al ingreso
    ta_sistolica        = Column(SmallInteger)
    ta_diastolica       = Column(SmallInteger)
    spo2                = Column(SmallInteger)
    frecuencia_cardiaca = Column(SmallInteger)
    temperatura         = Column(Numeric(4, 1))

    # Datos clínicos
    motivo_consulta     = Column(Text, nullable=False)
    examen_fisico       = Column(Text)
    diagnostico_cie10   = Column(String(20))
    diagnostico_desc    = Column(Text)
    tratamiento         = Column(Text)

    # Control de hospitalización y derivación
    requiere_hospitalizacion = Column(Boolean, default=False, nullable=False)
    derivado_cirugia         = Column(Boolean, default=False, nullable=False)
    resolucion               = Column(String(50), default="En Atención")

    # Auditoría
    creado_en           = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    actualizado_en      = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                                 onupdate=lambda: datetime.now(timezone.utc))
    activo              = Column(Boolean, default=True, nullable=False)

    # Relaciones
    paciente            = relationship("Paciente", backref="historias_emergencia")
    medico              = relationship("Usuario", foreign_keys=[medico_id])

    def __repr__(self):
        return f"<Historia051(id={self.id}, cedula='{self.cedula_paciente}', fecha={self.fecha_atencion})>"
