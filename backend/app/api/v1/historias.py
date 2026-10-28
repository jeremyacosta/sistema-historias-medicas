"""
api/v1/historias.py — Endpoints: Historias Clínicas (051 Emergencia y Consulta)
================================================================================
Maneja el registro de Historias de Emergencia (F-051, 48 horas) por el médico de guardia
y la consulta unificada del expediente histórico para el Historial Clínico del Doctor.
Instituto Municipal de Salud Ana Francisca Pérez de León.
"""

from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user, require_roles
from app.db.session import get_db
from app.models.paciente import Paciente
from app.models.historia import HistoriaEmergencia051
from app.models.usuario import Usuario
from app.models.security import AuditoriaAcceso
from app.schemas.historia import HistoriaEmergencia051Create, HistoriaEmergencia051Response
from app.schemas.paciente import PacienteResponse

router = APIRouter(prefix="/historias", tags=["M2 — Historias Clínicas y Emergencias"])


def _limpiar_ip(ip: Optional[str]) -> str:
    if not ip or ip in ("testclient", "localhost"):
        return "127.0.0.1"
    return ip


@router.post("/emergencia-051", response_model=dict, status_code=status.HTTP_201_CREATED)
async def registrar_historia_051(
    payload: HistoriaEmergencia051Create,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin", "medico")),
):
    """
    Registro oficial de Historia Clínica de Emergencia F-051 (Validez: 48 Horas).
    Uso exclusivo para Médicos de Guardia.
    """
    # 1. Verificar existencia del paciente
    paciente = db.query(Paciente).filter(
        Paciente.cedula == payload.paciente_cedula,
        Paciente.activo == True
    ).first()

    if not paciente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró ningún expediente activo para la cédula {payload.paciente_cedula}."
        )

    # 2. Crear registro F-051
    nueva_historia = HistoriaEmergencia051(
        paciente_id=paciente.id,
        numero_historia=paciente.numero_historia,
        cedula_paciente=paciente.cedula,
        medico_id=current_user.id,
        fecha_atencion=datetime.now(timezone.utc),
        ta_sistolica=payload.ta_sistolica,
        ta_diastolica=payload.ta_diastolica,
        spo2=payload.spo2,
        frecuencia_cardiaca=payload.frecuencia_cardiaca,
        temperatura=payload.temperatura,
        motivo_consulta=payload.motivo_consulta,
        examen_fisico=payload.examen_fisico,
        diagnostico_cie10=payload.diagnostico_cie10,
        diagnostico_desc=payload.diagnostico_desc,
        tratamiento=payload.tratamiento,
        requiere_hospitalizacion=payload.requiere_hospitalizacion,
        derivado_cirugia=payload.derivado_cirugia,
        resolucion=payload.resolucion,
        activo=True
    )
    db.add(nueva_historia)
    db.flush()

    # 3. Auditoría inmutable de atención de emergencia
    client_ip = _limpiar_ip(request.client.host if request.client else None)
    auditoria = AuditoriaAcceso(
        usuario_id=current_user.id,
        usuario_cedula=current_user.cedula,
        usuario_rol=current_user.rol.nombre if current_user.rol else "medico",
        accion="REGISTRO_HISTORIA_EMERGENCIA_051",
        descripcion=f"Atención de emergencia F-051 para historia {paciente.numero_historia} (CIE-10: {payload.diagnostico_cie10 or 'N/A'})",
        entidad="historias_emergencia_051",
        entidad_id=str(nueva_historia.id),
        paciente_cedula=paciente.cedula,
        ip_origen=client_ip,
        modulo="M2_EMERGENCIA_051",
        exitoso=True
    )
    db.add(auditoria)
    db.commit()
    db.refresh(nueva_historia)

    # Formatear respuesta con nombre de médico
    resp_data = HistoriaEmergencia051Response.model_validate(nueva_historia).model_dump(mode="json")
    resp_data["medico_nombre"] = current_user.nombre_completo

    return {
        "status": "success",
        "data": resp_data,
        "message": f"Historia F-051 registrada exitosamente para el paciente {paciente.nombre_completo}."
    }


@router.get("/paciente/{cedula}", response_model=dict)
async def consultar_historial_paciente(
    cedula: str,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin", "medico", "admision")),
):
    """
    Consulta integral del historial del paciente para el HistorialClinicoPanel del Doctor.
    Retorna datos de filiación F-052 e histórico de atenciones de emergencia F-051.
    """
    paciente = db.query(Paciente).filter(
        Paciente.cedula == cedula,
        Paciente.activo == True
    ).first()

    if not paciente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró ningún paciente con la cédula {cedula}."
        )

    # Historias de emergencia 051
    historias = db.query(HistoriaEmergencia051).filter(
        HistoriaEmergencia051.paciente_id == paciente.id,
        HistoriaEmergencia051.activo == True
    ).order_by(HistoriaEmergencia051.fecha_atencion.desc()).all()

    items = []
    for h in historias:
        item = HistoriaEmergencia051Response.model_validate(h).model_dump(mode="json")
        item["medico_nombre"] = h.medico.nombre_completo if h.medico else "Médico de Guardia"
        items.append(item)

    # Auditoría de consulta médica de expediente
    client_ip = _limpiar_ip(request.client.host if request.client else None)
    auditoria = AuditoriaAcceso(
        usuario_id=current_user.id,
        usuario_cedula=current_user.cedula,
        usuario_rol=current_user.rol.nombre if current_user.rol else "medico",
        accion="CONSULTA_HISTORIAL_CLINICO",
        descripcion=f"Acceso al historial clínico del paciente cédula {cedula}",
        entidad="pacientes",
        entidad_id=str(paciente.id),
        paciente_cedula=cedula,
        ip_origen=client_ip,
        modulo="HISTORIAL_CLINICO",
        exitoso=True
    )
    db.add(auditoria)
    db.commit()

    return {
        "status": "success",
        "data": {
            "paciente": PacienteResponse.model_validate(paciente).model_dump(mode="json"),
            "historias_emergencia": items
        },
        "message": "Historial clínico recuperado con éxito."
    }
