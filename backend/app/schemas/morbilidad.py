"""
schemas/morbilidad.py — Schemas Pydantic: Control de Morbilidad y Actividad Médica (M3)
========================================================================================
Define los contratos de entrada y salida para el registro diario de atenciones,
chequeo por día, chequeo por cédula y métricas de desempeño médico.
Instituto Municipal de Salud Ana Francisca Pérez de León.
"""

from datetime import date, time, datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, field_validator
import re


class ActividadMorbilidadCreate(BaseModel):
    """Payload para registrar una atención clínica en el libro de morbilidad."""
    cedula_paciente: str
    servicio: Optional[str] = "Emergencia Adultos"
    tipo_atencion: Optional[str] = "Emergencia"
    motivo_atencion: str
    diagnostico_cie10: Optional[str] = None
    diagnostico_desc: Optional[str] = None
    conducta_tratamiento: Optional[str] = None
    destino_egreso: Optional[str] = "Alta Médica"
    fecha_actividad: Optional[date] = None

    @field_validator("cedula_paciente")
    @classmethod
    def validar_cedula(cls, v: str) -> str:
        v = v.strip().upper()
        v = re.sub(r"^[VEJPGvejpg]-?", "", v)
        if not re.match(r"^\d{6,15}$", v):
            raise ValueError("La cédula debe contener entre 6 y 15 dígitos numéricos.")
        return v

    @field_validator("tipo_atencion")
    @classmethod
    def validar_tipo_atencion(cls, v: Optional[str]) -> str:
        if not v:
            return "Emergencia"
        validos = [
            "Emergencia", "Consulta Primera Vez", "Consulta Sucesiva",
            "Triaje Ambulatorio", "Control Post-Operatorio", "Interconsulta"
        ]
        if v not in validos:
            return "Emergencia"
        return v

    @field_validator("destino_egreso")
    @classmethod
    def validar_destino(cls, v: Optional[str]) -> str:
        if not v:
            return "Alta Médica"
        validos = [
            "Alta Médica", "En Observación", "Hospitalización",
            "Quirófano / Cirugía", "Referido", "Fallecido"
        ]
        if v not in validos:
            return "Alta Médica"
        return v


class ActividadMorbilidadResponse(BaseModel):
    """Representación de una atención registrada en el censo de morbilidad."""
    id: UUID
    paciente_id: UUID
    cedula_paciente: str
    nombre_paciente: str
    numero_historia: str

    medico_id: UUID
    medico_nombre: str
    medico_cedula: str

    servicio: str
    tipo_atencion: str
    motivo_atencion: str
    diagnostico_cie10: Optional[str] = None
    diagnostico_desc: Optional[str] = None
    conducta_tratamiento: Optional[str] = None
    destino_egreso: str

    fecha_actividad: date
    hora_actividad: time
    registrado_en: datetime

    class Config:
        from_attributes = True


class ResumenMorbilidadDiaria(BaseModel):
    """Estadísticas agregadas para el chequeo por día."""
    fecha: date
    total_atenciones: int
    total_pacientes_unicos: int
    por_servicio: dict
    por_destino: dict
    top_diagnosticos: List[dict]
    atenciones: List[ActividadMorbilidadResponse]
