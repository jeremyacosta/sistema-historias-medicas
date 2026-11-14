"""
api/v1/recetas.py — Endpoints: Récipes Médicos Oficiales Formato 001 MPPS (M5)
=============================================================================
Prescripción médica oficial con cálculo de hash criptográfico SHA-256,
foliatura secuencial institucional y trazabilidad forense auditada.
Instituto Municipal de Salud Ana Francisca Pérez de León.
"""

import hashlib
from datetime import date, datetime, timedelta, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.security import get_current_user, require_roles
from app.db.session import get_db
from app.models.receta import RecetaMedica001
from app.models.paciente import Paciente
from app.models.usuario import Usuario
from app.models.security import AuditoriaAcceso
from app.schemas.receta import RecetaCreate, RecetaResponse

router = APIRouter(prefix="/recetas", tags=["M5 — Récipes Médicos Oficiales Formato 001"])


def _limpiar_ip(ip: Optional[str]) -> str:
    if not ip or ip in ("testclient", "localhost"):
        return "127.0.0.1"
    return ip


def _generar_folio(db: Session) -> str:
    """Genera folio correlativo anual: REC-2026-000001"""
    anio = date.today().year
    ultimo = (
        db.query(RecetaMedica001)
        .filter(RecetaMedica001.folio.like(f"REC-{anio}-%"))
        .order_by(desc(RecetaMedica001.id))
        .first()
    )
    if ultimo and ultimo.folio:
        try:
            sec = int(ultimo.folio.split("-")[-1]) + 1
        except Exception:
            sec = 1
    else:
        sec = 1
    return f"REC-{anio}-{sec:06d}"


def _calcular_hash(folio: str, cedula_paciente: str, medico_cedula: str, rp: str, fecha: str) -> str:
    """Calcula SHA-256 inmutable de la receta médica oficial."""
    raw = f"{folio}|{cedula_paciente}|{medico_cedula}|{rp.strip()}|{fecha}|MPPS-DS7"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def emitir_receta_medica(
    payload: RecetaCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin", "medico")),
):
    """
    Emite un récipe médico oficial Formato 001 MPPS.
    Registra folio secuencial, cálculo de hash SHA-256 y auditoría forense.
    """
    # 1. Validar que el paciente exista
    paciente = db.query(Paciente).filter(
        Paciente.cedula == payload.cedula_paciente,
        Paciente.activo == True
    ).first()

    if not paciente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró expediente activo para la cédula {payload.cedula_paciente}."
        )

    # 2. Generar folio institucional y fechas
    folio = _generar_folio(db)
    fecha_hoy = date.today()
    fecha_vence = fecha_hoy + timedelta(days=payload.dias_validez)

    # 3. Hash SHA-256 de integridad
    hash_sha256 = _calcular_hash(
        folio=folio,
        cedula_paciente=paciente.cedula,
        medico_cedula=current_user.cedula,
        rp=payload.prescripcion_rp,
        fecha=str(fecha_hoy)
    )

    # 4. Crear entidad
    receta = RecetaMedica001(
        folio=folio,
        paciente_id=paciente.id,
        cedula_paciente=paciente.cedula,
        nombre_paciente=paciente.nombre_completo,
        numero_historia=paciente.numero_historia,
        medico_id=current_user.id,
        medico_nombre=current_user.nombre_completo,
        medico_cedula=current_user.cedula,
        medico_mpps=getattr(current_user, "matricula_mpps", "MPPS-REGISTRADO"),
        diagnostico_cie10=payload.diagnostico_cie10,
        diagnostico_desc=payload.diagnostico_desc,
        prescripcion_rp=payload.prescripcion_rp,
        indicaciones=payload.indicaciones,
        dias_validez=payload.dias_validez,
        fecha_emision=fecha_hoy,
        fecha_vencimiento=fecha_vence,
        estado="activo",
        hash_integridad=hash_sha256,
        activo=True
    )
    db.add(receta)

    # 5. Auditoría inmutable obligatoria
    ip_cliente = _limpiar_ip(request.client.host if request.client else "127.0.0.1")
    auditoria = AuditoriaAcceso(
        usuario_id=current_user.id,
        cedula_usuario=current_user.cedula,
        nombre_usuario=current_user.nombre_completo,
        rol=current_user.rol.nombre if current_user.rol else "medico",
        accion="EMISION_RECETA_F001",
        modulo="M5_RECIPES",
        ip_origen=ip_cliente,
        user_agent=request.headers.get("user-agent", "FastAPI"),
        detalles=(
            f"Folio: {folio} | Paciente: {paciente.cedula} ({paciente.nombre_completo}) "
            f"| Vence: {fecha_vence} | SHA-256: {hash_sha256[:16]}..."
        )
    )
    db.add(auditoria)
    db.commit()
    db.refresh(receta)

    return {
        "status": "success",
        "data": RecetaResponse.from_orm(receta),
        "message": f"Récipe médico oficial emitido con éxito bajo folio {folio}."
    }


@router.get("/", response_model=dict)
async def listar_recetas_medicas(
    cedula_paciente: Optional[str] = Query(None, description="Filtrar por cédula del paciente"),
    folio: Optional[str] = Query(None, description="Filtrar por folio"),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """
    Lista recetas médicas registradas.
    Los médicos y administradores ven registros generales; pacientes solo sus propias recetas.
    """
    query = db.query(RecetaMedica001).filter(RecetaMedica001.activo == True)

    rol_usuario = current_user.rol.nombre if current_user.rol else "paciente"

    # Si es paciente, limitar estrictamente a su cédula
    if rol_usuario == "paciente":
        query = query.filter(RecetaMedica001.cedula_paciente == current_user.cedula)
    elif cedula_paciente:
        query = query.filter(RecetaMedica001.cedula_paciente == cedula_paciente)

    if folio:
        query = query.filter(RecetaMedica001.folio == folio)

    recetas = query.order_by(desc(RecetaMedica001.id)).limit(limit).all()

    return {
        "status": "success",
        "data": [RecetaResponse.from_orm(r) for r in recetas],
        "message": f"Se obtuvieron {len(recetas)} récipes médicos oficiales."
    }


@router.get("/{receta_id}", response_model=dict)
async def obtener_receta_por_id(
    receta_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Obtiene el detalle completo de un récipe médico oficial."""
    receta = db.query(RecetaMedica001).filter(
        RecetaMedica001.id == receta_id,
        RecetaMedica001.activo == True
    ).first()

    if not receta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Récipe médico no encontrado o inactivo."
        )

    rol_usuario = current_user.rol.nombre if current_user.rol else "paciente"
    if rol_usuario == "paciente" and receta.cedula_paciente != current_user.cedula:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tiene autorización para visualizar un récipe ajeno."
        )

    return {
        "status": "success",
        "data": RecetaResponse.from_orm(receta),
        "message": "Récipe médico oficial recuperado correctamente."
    }
