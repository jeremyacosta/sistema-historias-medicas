"""
models/receta.py — Modelo ORM: Récipe Médico Oficial MPPS Formato 001 (M5)
===========================================================================
Almacena las prescripciones e indicaciones médicas oficiales emitidas
por los facultativos acreditados del hospital, con folio institucional,
integridad criptográfica SHA-256 y trazabilidad forense.
Instituto Municipal de Salud Ana Francisca Pérez de León.
"""

import uuid
from datetime import datetime, date, timezone
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Date, DateTime,
    ForeignKey
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.session import Base


class RecetaMedica001(Base):
    """
    Representa una prescripción médica oficial Formato 001 MPPS.
    """
    __tablename__ = "recetas_medicas"

    id = Column(Integer, primary_key=True, autoincrement=True)
    folio = Column(String(50), unique=True, nullable=False, index=True)
    
    # Vinculación con Paciente (UUID)
    paciente_id = Column(UUID(as_uuid=True), ForeignKey("pacientes.id"), nullable=False, index=True)
    cedula_paciente = Column(String(20), nullable=False, index=True)
    nombre_paciente = Column(String(200), nullable=False)
    numero_historia = Column(String(50), nullable=False, index=True)

    # Vinculación con Médico Emisor (UUID)
    medico_id = Column(UUID(as_uuid=True), ForeignKey("usuarios.id"), nullable=False, index=True)
    medico_nombre = Column(String(200), nullable=False)
    medico_cedula = Column(String(20), nullable=False)
    medico_mpps = Column(String(50), nullable=True)

    # Diagnóstico y Prescripción Médica
    diagnostico_cie10 = Column(String(20), nullable=True)
    diagnostico_desc = Column(String(300), nullable=True)
    prescripcion_rp = Column(Text, nullable=False)     # Medicamentos, concentración y dosis
    indicaciones = Column(Text, nullable=False)        # Horarios, pauta y duración
    
    # Vigencia
    dias_validez = Column(Integer, default=7, nullable=False)
    fecha_emision = Column(Date, default=date.today, nullable=False)
    fecha_vencimiento = Column(Date, nullable=False)
    estado = Column(String(20), default="activo", nullable=False) # activo, dispensado, vencido, anulado

    # Seguridad e Integridad Criptográfica
    hash_integridad = Column(String(64), nullable=False)  # SHA-256 de folio + paciente + rp + medico + fecha
    activo = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relaciones ORM
    paciente = relationship("Paciente", backref="recetas")
    medico = relationship("Usuario", backref="recetas_emitidas")

    def __repr__(self):
        return f"<RecetaMedica001 {self.folio} - Paciente: {self.cedula_paciente}>"
