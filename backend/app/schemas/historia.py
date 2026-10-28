"""
schemas/historia.py — Schemas Pydantic: Historias Clínicas de Emergencia (051)
==============================================================================
Define los contratos para el registro y consulta de historias de emergencia
F-051 (48 horas) en el Instituto Municipal de Salud Ana Francisca Pérez de León.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, field_validator
import re


class HistoriaEmergencia051Create(BaseModel):
    """Datos clínicos ingresados por el médico de guardia en la F-051."""
    paciente_cedula: str
    ta_sistolica: Optional[int] = None
    ta_diastolica: Optional[int] = None
    spo2: Optional[int] = None
    frecuencia_cardiaca: Optional[int] = None
    temperatura: Optional[float] = None

    motivo_consulta: str
    examen_fisico: Optional[str] = None
    diagnostico_cie10: Optional[str] = None
    diagnostico_desc: Optional[str] = None
    tratamiento: Optional[str] = None

    requiere_hospitalizacion: bool = False
    derivado_cirugia: bool = False
    resolucion: str = "En Atención"

    @field_validator("paciente_cedula")
    @classmethod
    def validar_cedula(cls, v: str) -> str:
        v = v.strip().upper()
        v = re.sub(r"^[VEJPGvejpg]-?", "", v)
        if not re.match(r"^\d{6,15}$", v):
            raise ValueError("La cédula debe contener entre 6 y 15 dígitos numéricos.")
        return v

    @field_validator("resolucion")
    @classmethod
    def validar_resolucion(cls, v: str) -> str:
        validos = ["En Atención", "Alta Médica", "Hospitalizado", "Referido", "Fallecido"]
        if v not in validos:
            raise ValueError(f"Resolución no válida. Opciones permitidas: {validos}")
        return v


class HistoriaEmergencia051Response(BaseModel):
    """Respuesta con los datos de la Historia 051."""
    id: UUID
    paciente_id: UUID
    numero_historia: str
    cedula_paciente: str
    medico_id: UUID
    medico_nombre: Optional[str] = None
    fecha_atencion: datetime

    ta_sistolica: Optional[int] = None
    ta_diastolica: Optional[int] = None
    spo2: Optional[int] = None
    frecuencia_cardiaca: Optional[int] = None
    temperatura: Optional[float] = None

    motivo_consulta: str
    examen_fisico: Optional[str] = None
    diagnostico_cie10: Optional[str] = None
    diagnostico_desc: Optional[str] = None
    tratamiento: Optional[str] = None

    requiere_hospitalizacion: bool
    derivado_cirugia: bool
    resolucion: str
    creado_en: datetime

    class Config:
        from_attributes = True
