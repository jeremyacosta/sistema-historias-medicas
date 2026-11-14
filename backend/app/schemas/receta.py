"""
schemas/receta.py — Schemas Pydantic: Récipes Médicos Oficiales MPPS (M5)
========================================================================
Validación estricta de prescripciones médicas oficiales Formato 001.
Instituto Municipal de Salud Ana Francisca Pérez de León.
"""

import uuid
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field


class RecetaCreate(BaseModel):
    cedula_paciente: str = Field(..., min_length=5, max_length=20, description="Cédula de identidad del paciente")
    diagnostico_cie10: Optional[str] = Field(None, max_length=20, description="Código CIE-10")
    diagnostico_desc: Optional[str] = Field(None, max_length=300, description="Diagnóstico textual")
    prescripcion_rp: str = Field(..., min_length=3, description="Cuerpo de la prescripción Rp. (medicamento y dosis)")
    indicaciones: str = Field(..., min_length=3, description="Instrucciones al paciente para la toma")
    dias_validez: int = Field(7, ge=1, le=90, description="Días de vigencia del récipe")


class RecetaResponse(BaseModel):
    id: int
    folio: str
    paciente_id: uuid.UUID
    cedula_paciente: str
    nombre_paciente: str
    numero_historia: str
    medico_id: uuid.UUID
    medico_nombre: str
    medico_cedula: str
    medico_mpps: Optional[str] = None
    diagnostico_cie10: Optional[str] = None
    diagnostico_desc: Optional[str] = None
    prescripcion_rp: str
    indicaciones: str
    dias_validez: int
    fecha_emision: date
    fecha_vencimiento: date
    estado: str
    hash_integridad: str
    created_at: datetime

    class Config:
        from_attributes = True
