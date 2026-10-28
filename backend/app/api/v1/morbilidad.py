"""
api/v1/morbilidad.py — Endpoints: Morbilidad y Control de Actividad Médica (M3)
===============================================================================
Control y registro de actividades clínicas diarias, chequeo por día,
chequeo por cédula de paciente y auditoría de productividad médica.
Instituto Municipal de Salud Ana Francisca Pérez de León.
"""

from datetime import date, datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.core.security import get_current_user, require_roles
from app.db.session import get_db
from app.models.morbilidad import ActividadMorbilidad
from app.models.paciente import Paciente
from app.models.usuario import Usuario
from app.models.security import AuditoriaAcceso
from app.schemas.morbilidad import (
    ActividadMorbilidadCreate,
    ActividadMorbilidadResponse,
    ResumenMorbilidadDiaria
)

router = APIRouter(prefix="/morbilidad", tags=["M3 — Morbilidad y Control Médico"])


def _limpiar_ip(ip: Optional[str]) -> str:
    if not ip or ip in ("testclient", "localhost"):
        return "127.0.0.1"
    return ip


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def registrar_actividad_morbilidad(
    payload: ActividadMorbilidadCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin", "medico")),
):
    """
    Registra una actividad médica en el censo de morbilidad hospitalaria.
    Verifica que el paciente exista y asocia al médico activo.
    """
    # 1. Buscar expediente del paciente
    paciente = db.query(Paciente).filter(
        Paciente.cedula == payload.cedula_paciente,
        Paciente.activo == True
    ).first()

    if not paciente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró un expediente activo para la cédula {payload.cedula_paciente}."
        )

    # 2. Crear actividad
    fecha_hoy = payload.fecha_actividad or date.today()
    hora_actual = datetime.now(timezone.utc).time()

    actividad = ActividadMorbilidad(
        paciente_id=paciente.id,
        cedula_paciente=paciente.cedula,
        nombre_paciente=paciente.nombre_completo,
        numero_historia=paciente.numero_historia,
        medico_id=current_user.id,
        medico_nombre=current_user.nombre_completo,
        medico_cedula=current_user.cedula,
        servicio=payload.servicio or "Emergencia Adultos",
        tipo_atencion=payload.tipo_atencion or "Emergencia",
        motivo_atencion=payload.motivo_atencion,
        diagnostico_cie10=payload.diagnostico_cie10,
        diagnostico_desc=payload.diagnostico_desc,
        conducta_tratamiento=payload.conducta_tratamiento,
        destino_egreso=payload.destino_egreso or "Alta Médica",
        fecha_actividad=fecha_hoy,
        hora_actividad=hora_actual,
        activo=True
    )
    db.add(actividad)
    db.flush()

    # 3. Auditoría inmutable
    client_ip = _limpiar_ip(request.client.host if request.client else None)
    auditoria = AuditoriaAcceso(
        usuario_id=current_user.id,
        usuario_cedula=current_user.cedula,
        usuario_rol=current_user.rol.nombre if current_user.rol else "medico",
        accion="REGISTRO_ACTIVIDAD_MORBILIDAD",
        descripcion=f"Registro de morbilidad médica en {payload.servicio} (CIE-10: {payload.diagnostico_cie10 or 'N/A'})",
        entidad="actividades_morbilidad",
        entidad_id=str(actividad.id),
        paciente_cedula=paciente.cedula,
        ip_origen=client_ip,
        modulo="M3_MORBILIDAD",
        exitoso=True
    )
    db.add(auditoria)
    db.commit()
    db.refresh(actividad)

    return {
        "status": "success",
        "data": ActividadMorbilidadResponse.model_validate(actividad).model_dump(mode="json"),
        "message": f"Atención médica registrada exitosamente en el libro de morbilidad."
    }


@router.get("/dia", response_model=dict)
async def consultar_morbilidad_por_dia(
    fecha: Optional[date] = Query(default=None, description="Fecha a consultar (YYYY-MM-DD). Por defecto: hoy"),
    servicio: Optional[str] = Query(default=None, description="Filtrar por servicio hospitalario"),
    medico_id: Optional[str] = Query(default=None, description="Filtrar por ID del médico tratante"),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin", "medico", "admision")),
):
    """
    CHEQUEO POR DÍA: Retorna todas las atenciones médicas y estadísticas
    agregadas para una fecha determinada.
    """
    fecha_consulta = fecha or date.today()

    query = db.query(ActividadMorbilidad).filter(
        ActividadMorbilidad.fecha_actividad == fecha_consulta,
        ActividadMorbilidad.activo == True
    )

    if servicio and servicio != "TODOS":
        query = query.filter(ActividadMorbilidad.servicio.ilike(f"%{servicio.strip()}%"))

    if medico_id:
        query = query.filter(ActividadMorbilidad.medico_id == medico_id)

    atenciones = query.order_by(ActividadMorbilidad.hora_actividad.desc()).all()

    # Métricas agregadas del día
    por_servicio = {}
    por_destino = {}
    diagnosticos_cont = {}
    pacientes_unicos = set()

    for a in atenciones:
        pacientes_unicos.add(a.cedula_paciente)
        por_servicio[a.servicio] = por_servicio.get(a.servicio, 0) + 1
        por_destino[a.destino_egreso] = por_destino.get(a.destino_egreso, 0) + 1
        if a.diagnostico_cie10:
            clave = f"{a.diagnostico_cie10} — {a.diagnostico_desc or ''}".strip()
            diagnosticos_cont[clave] = diagnosticos_cont.get(clave, 0) + 1

    top_diagnosticos = [
        {"diagnostico": k, "cantidad": v}
        for k, v in sorted(diagnosticos_cont.items(), key=lambda x: x[1], reverse=True)[:5]
    ]

    items = [ActividadMorbilidadResponse.model_validate(a).model_dump(mode="json") for a in atenciones]

    resumen = {
        "fecha": fecha_consulta.isoformat(),
        "total_atenciones": len(atenciones),
        "total_pacientes_unicos": len(pacientes_unicos),
        "por_servicio": por_servicio,
        "por_destino": por_destino,
        "top_diagnosticos": top_diagnosticos,
        "atenciones": items
    }

    return {
        "status": "success",
        "data": resumen,
        "message": f"Reporte de morbilidad del día {fecha_consulta.isoformat()} cargado con éxito."
    }


@router.get("/paciente/{cedula}", response_model=dict)
async def consultar_morbilidad_por_paciente(
    cedula: str,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin", "medico", "admision")),
):
    """
    CHEQUEO POR CÉDULA: Retorna el historial cronológico completo de atenciones
    recibidas por un paciente en el Instituto.
    """
    cedula_limpia = cedula.strip().upper()
    paciente = db.query(Paciente).filter(
        Paciente.cedula == cedula_limpia,
        Paciente.activo == True
    ).first()

    if not paciente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró ningún expediente activo para la cédula {cedula_limpia}."
        )

    atenciones = db.query(ActividadMorbilidad).filter(
        ActividadMorbilidad.paciente_id == paciente.id,
        ActividadMorbilidad.activo == True
    ).order_by(ActividadMorbilidad.fecha_actividad.desc(), ActividadMorbilidad.hora_actividad.desc()).all()

    items = [ActividadMorbilidadResponse.model_validate(a).model_dump(mode="json") for a in atenciones]

    # Auditoría de consulta
    client_ip = _limpiar_ip(request.client.host if request.client else None)
    auditoria = AuditoriaAcceso(
        usuario_id=current_user.id,
        usuario_cedula=current_user.cedula,
        usuario_rol=current_user.rol.nombre if current_user.rol else "medico",
        accion="CONSULTA_MORBILIDAD_PACIENTE",
        descripcion=f"Chequeo de historial de morbilidad para cédula {cedula_limpia}",
        entidad="actividades_morbilidad",
        entidad_id=str(paciente.id),
        paciente_cedula=cedula_limpia,
        ip_origen=client_ip,
        modulo="M3_MORBILIDAD",
        exitoso=True
    )
    db.add(auditoria)
    db.commit()

    return {
        "status": "success",
        "data": {
            "paciente": {
                "id": str(paciente.id),
                "numero_historia": paciente.numero_historia,
                "cedula": paciente.cedula,
                "nombre_completo": paciente.nombre_completo,
                "tipo_sangre": paciente.tipo_sangre,
                "alergias_conocidas": paciente.alergias_conocidas
            },
            "total_atenciones": len(items),
            "atenciones": items
        },
        "message": f"Historial de morbilidad recuperado para el paciente {paciente.nombre_completo}."
    }


@router.get("/doctor/resumen", response_model=dict)
async def control_actividad_doctor(
    fecha: Optional[date] = Query(default=None, description="Fecha a evaluar (por defecto: hoy)"),
    medico_id: Optional[str] = Query(default=None, description="ID del médico (por defecto: el usuario autenticado)"),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin", "medico")),
):
    """
    CONTROL DE ACTIVIDAD DEL DOCTOR: Métricas de atenciones, tiempo y destinos
    del médico de guardia o especialista.
    """
    target_medico_id = medico_id or str(current_user.id)
    fecha_eval = fecha or date.today()

    atenciones = db.query(ActividadMorbilidad).filter(
        ActividadMorbilidad.medico_id == target_medico_id,
        ActividadMorbilidad.fecha_actividad == fecha_eval,
        ActividadMorbilidad.activo == True
    ).order_by(ActividadMorbilidad.hora_actividad.desc()).all()

    por_servicio = {}
    por_destino = {}
    for a in atenciones:
        por_servicio[a.servicio] = por_servicio.get(a.servicio, 0) + 1
        por_destino[a.destino_egreso] = por_destino.get(a.destino_egreso, 0) + 1

    items = [ActividadMorbilidadResponse.model_validate(a).model_dump(mode="json") for a in atenciones]

    return {
        "status": "success",
        "data": {
            "fecha": fecha_eval.isoformat(),
            "medico_id": target_medico_id,
            "total_pacientes_atendidos": len(atenciones),
            "por_servicio": por_servicio,
            "por_destino": por_destino,
            "atenciones": items
        },
        "message": f"Resumen de actividad del doctor generado para el {fecha_eval.isoformat()}."
    }
