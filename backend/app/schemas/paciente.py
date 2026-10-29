"""
schemas/paciente.py — Schemas Pydantic: Pacientes y Admisión (Formato 052)
==========================================================================
Define los contratos de entrada y salida para la apertura de expedientes
clínicos por parte del departamento de Admisión (Parte 1 Formato 052) y
la auto-gestión del perfil clínico del paciente.
"""

from datetime import date, datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, field_validator
import re


class PacienteCreateRequest(BaseModel):
    """
    Datos requeridos por Admisión para abrir un expediente nuevo (Formato 052 Parte 1).
    Genera automáticamente el Número de Historia Único HPL-YYYY-NNNNN y las
    credenciales de acceso para el portal del paciente.
    """
    cedula: str
    nombre: str
    apellido: str
    fecha_nacimiento: date
    sexo: str
    estado_civil: Optional[str] = "Soltero(a)"
    direccion: Optional[str] = None
    municipio: Optional[str] = "Sucre"
    estado_residencia: Optional[str] = "Miranda"
    telefono_principal: Optional[str] = None
    telefono_emergencia: Optional[str] = None
    nombre_contacto_emergencia: Optional[str] = None
    tipo_sangre: Optional[str] = None
    alergias_conocidas: Optional[str] = None

    @field_validator("estado_civil")
    @classmethod
    def validar_estado_civil(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            return "soltero"
        v_clean = v.lower().strip()
        mapa = {
            "soltero": "soltero",
            "soltera": "soltera",
            "soltero(a)": "soltero",
            "casado": "casado",
            "casada": "casada",
            "casado(a)": "casado",
            "divorciado": "divorciado",
            "divorciada": "divorciada",
            "divorciado(a)": "divorciado",
            "viudo": "viudo",
            "viuda": "viuda",
            "viudo(a)": "viudo",
            "unión libre": "union_libre",
            "union libre": "union_libre",
            "union_libre": "union_libre",
        }
        return mapa.get(v_clean, "soltero")

    @field_validator("cedula")
    @classmethod
    def validar_cedula(cls, v: str) -> str:
        v = v.strip().upper()
        v = re.sub(r"^[VEJPGvejpg]-?", "", v)
        if not re.match(r"^\d{6,15}$", v):
            raise ValueError("La cédula debe contener entre 6 y 15 dígitos numéricos.")
        return v

    @field_validator("sexo")
    @classmethod
    def validar_sexo(cls, v: str) -> str:
        v = v.strip().upper()
        if v not in ("M", "F"):
            raise ValueError("El sexo debe ser 'M' (Masculino) o 'F' (Femenino).")
        return v


class PacienteUpdateClinicoRequest(BaseModel):
    """
    Actualización autónoma de datos clínicos permitidos al paciente:
    Tipo de sangre y Alergias conocidas.
    """
    tipo_sangre: Optional[str] = None
    alergias_conocidas: Optional[str] = None

    @field_validator("tipo_sangre")
    @classmethod
    def validar_tipo_sangre(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            return None
        v = v.strip().upper()
        validos = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]
        if v not in validos:
            raise ValueError(f"Tipo de sangre inválido. Debe ser uno de: {', '.join(validos)}")
        return v


class PacienteUpdateContactoRequest(BaseModel):
    """
    Actualización autónoma de datos personales y de contacto por el paciente:
    Teléfonos, contacto de emergencia, dirección y municipio.
    """
    telefono_principal: Optional[str] = None
    telefono_emergencia: Optional[str] = None
    nombre_contacto_emergencia: Optional[str] = None
    direccion: Optional[str] = None
    municipio: Optional[str] = None


class PacienteResponse(BaseModel):
    """Estructura de respuesta de un paciente."""
    id: UUID
    numero_historia: str
    cedula: str
    nombre: str
    apellido: str
    fecha_nacimiento: date
    sexo: str
    estado_civil: Optional[str] = None
    direccion: Optional[str] = None
    municipio: Optional[str] = None
    estado_residencia: Optional[str] = None
    telefono_principal: Optional[str] = None
    telefono_emergencia: Optional[str] = None
    nombre_contacto_emergencia: Optional[str] = None
    tipo_sangre: Optional[str] = None
    alergias_conocidas: Optional[str] = None
    creado_en: Optional[datetime] = None

    class Config:
        from_attributes = True


class PacienteCreateResponse(BaseModel):
    """Respuesta tras el alta de expediente por Admisión."""
    paciente: PacienteResponse
    numero_historia: str
    credenciales_provisionales: dict
    mensaje: str
