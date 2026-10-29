"""
api/v1/pacientes.py — Endpoints: Admisión y Expedientes Clínicos (M1)
=====================================================================
Implementa el ciclo completo de Admisión (Formato 052 Parte 1),
búsqueda clínica, listado general de pacientes y actualización autónoma
de datos por el paciente.
Instituto Municipal de Salud Ana Francisca Pérez de León.
"""

from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session
from sqlalchemy import text, or_

from app.core.security import get_current_user, require_roles, hash_password
from app.db.session import get_db
from app.models.paciente import Paciente, PoliticaPrivacidadPaciente
from app.models.usuario import Usuario, Rol
from app.models.security import AuditoriaAcceso
from app.schemas.paciente import (
    PacienteCreateRequest,
    PacienteUpdateClinicoRequest,
    PacienteUpdateContactoRequest,
    PacienteResponse,
    PacienteCreateResponse
)

router = APIRouter(prefix="/pacientes", tags=["M1 — Admisión y Pacientes"])


def _limpiar_ip(ip: Optional[str]) -> str:
    if not ip or ip in ("testclient", "localhost"):
        return "127.0.0.1"
    return ip


@router.get("/", response_model=dict)
async def listar_pacientes(
    q: Optional[str] = Query(None, description="Búsqueda por cédula, nombre, apellido o historia"),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin", "admision", "medico")),
):
    """
    Lista todos los pacientes registrados en la base de datos PostgreSQL.
    Permite filtrar por término de búsqueda (cédula, nombre, etc.).
    """
    query = db.query(Paciente).filter(Paciente.activo == True)
    if q and q.strip():
        termino = f"%{q.strip()}%"
        query = query.filter(
            or_(
                Paciente.cedula.ilike(termino),
                Paciente.nombre.ilike(termino),
                Paciente.apellido.ilike(termino),
                Paciente.numero_historia.ilike(termino)
            )
        )
    pacientes = query.order_by(Paciente.created_at.desc()).limit(100).all()
    items = [PacienteResponse.model_validate(p).model_dump(mode="json") for p in pacientes]
    return {
        "status": "success",
        "data": items,
        "message": f"Se listaron {len(items)} pacientes activos."
    }


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def registrar_paciente(
    payload: PacienteCreateRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin", "admision")),
):
    """
    Apertura oficial de expediente clínico (Formato 052 Parte 1).
    Solo para personal de Admisión y Administradores.
    """
    # 1. Verificar existencia
    paciente_existente = db.query(Paciente).filter(Paciente.cedula == payload.cedula).first()
    if paciente_existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe un expediente activo para la cédula {payload.cedula} (Historia: {paciente_existente.numero_historia})."
        )

    # 2. Obtener siguiente correlativo de historia clínica
    try:
        seq_res = db.execute(text("SELECT nextval('historia_seq')")).scalar()
        anio = datetime.now().year
        numero_historia = f"HPL-{anio}-{str(seq_res).zfill(5)}"
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generando el correlativo de historia: {str(e)}"
        )

    # 3. Crear usuario asociado para portal paciente
    usuario_existente = db.query(Usuario).filter(Usuario.cedula == payload.cedula).first()
    password_provisional = f"{payload.cedula}{anio}"
    rol_paciente = db.query(Rol).filter(Rol.nombre == "paciente").first()

    if not usuario_existente:
        nuevo_usuario = Usuario(
            cedula=payload.cedula,
            nombre=payload.nombre,
            apellido=payload.apellido,
            telefono=payload.telefono_principal,
            password_hash=hash_password(password_provisional),
            rol_id=rol_paciente.id if rol_paciente else 4,
            debe_cambiar_pass=True,
            activo=True
        )
        db.add(nuevo_usuario)
        db.flush()
        usuario_id = nuevo_usuario.id
    else:
        usuario_id = usuario_existente.id

    # 4. Crear registro Paciente
    nuevo_paciente = Paciente(
        numero_historia=numero_historia,
        cedula=payload.cedula,
        nombre=payload.nombre,
        apellido=payload.apellido,
        fecha_nacimiento=payload.fecha_nacimiento,
        sexo=payload.sexo,
        estado_civil=payload.estado_civil,
        direccion=payload.direccion,
        municipio=payload.municipio,
        estado_residencia=payload.estado_residencia,
        telefono_principal=payload.telefono_principal,
        telefono_emergencia=payload.telefono_emergencia,
        nombre_contacto_emergencia=payload.nombre_contacto_emergencia,
        tipo_sangre=payload.tipo_sangre,
        alergias_conocidas=payload.alergias_conocidas,
        usuario_id=usuario_id,
        activo=True
    )
    db.add(nuevo_paciente)
    db.flush()

    # 5. Inicializar política de privacidad por defecto (Soberanía del Dato)
    politica = PoliticaPrivacidadPaciente(
        paciente_id=nuevo_paciente.id,
        permite_ver_historia=True,
        permite_teleconsulta=True,
        permite_compartir_qr=True,
        acepto_terminos=False
    )
    db.add(politica)

    # 6. Registrar en auditoría
    client_ip = _limpiar_ip(request.client.host if request.client else None)
    auditoria = AuditoriaAcceso(
        usuario_id=current_user.id,
        usuario_cedula=current_user.cedula,
        usuario_rol=current_user.rol.nombre if current_user.rol else "admision",
        accion="APERTURA_EXPEDIENTE_052",
        descripcion=f"Apertura de expediente F-052 Parte 1 asignando historia {numero_historia}",
        entidad="pacientes",
        entidad_id=str(nuevo_paciente.id),
        paciente_cedula=payload.cedula,
        ip_origen=client_ip,
        modulo="M1_ADMISION",
        exitoso=True
    )
    db.add(auditoria)
    db.commit()
    db.refresh(nuevo_paciente)

    return {
        "status": "success",
        "data": {
            "paciente": PacienteResponse.model_validate(nuevo_paciente).model_dump(mode="json"),
            "numero_historia": numero_historia,
            "credenciales_provisionales": {
                "cedula": payload.cedula,
                "password_temporal": password_provisional,
                "debe_cambiar_pass": True
            }
        },
        "message": f"Expediente aperturado exitosamente con el número {numero_historia}."
    }


@router.get("/buscar", response_model=dict)
async def buscar_pacientes(
    q: str = Query(..., min_length=2, description="Cédula, nombre o apellido"),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_roles("admin", "admision", "medico")),
):
    """
    Búsqueda rápida de pacientes por cédula, nombre o apellido.
    Accesible para Admisión y Médicos.
    """
    termino = f"%{q.strip()}%"
    pacientes = db.query(Paciente).filter(
        Paciente.activo == True,
        or_(
            Paciente.cedula.ilike(termino),
            Paciente.nombre.ilike(termino),
            Paciente.apellido.ilike(termino),
            Paciente.numero_historia.ilike(termino)
        )
    ).limit(25).all()

    items = [PacienteResponse.model_validate(p).model_dump(mode="json") for p in pacientes]
    return {
        "status": "success",
        "data": {
            "total": len(items),
            "pacientes": items
        },
        "message": f"Se encontraron {len(items)} registros."
    }


@router.get("/me", response_model=dict)
async def obtener_perfil_propio(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """
    Retorna la ficha del paciente autenticado para la Billetera Digital.
    """
    paciente = db.query(Paciente).filter(
        Paciente.cedula == current_user.cedula,
        Paciente.activo == True
    ).first()

    if not paciente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontró un expediente clínico asociado a esta cuenta de usuario."
        )

    return {
        "status": "success",
        "data": PacienteResponse.model_validate(paciente).model_dump(mode="json"),
        "message": "Ficha de paciente cargada con éxito."
    }


@router.patch("/me/clinico", response_model=dict)
async def actualizar_datos_clinicos_propios(
    payload: PacienteUpdateClinicoRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """
    Permite al paciente actualizar de forma autónoma su Tipo de Sangre
    y Alergias Conocidas desde su Billetera Digital.
    """
    paciente = db.query(Paciente).filter(
        Paciente.cedula == current_user.cedula,
        Paciente.activo == True
    ).first()

    if not paciente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No existe expediente clínico asociado a este usuario."
        )

    cambios = []
    if payload.tipo_sangre is not None and payload.tipo_sangre != paciente.tipo_sangre:
        paciente.tipo_sangre = payload.tipo_sangre
        cambios.append(f"tipo_sangre: {payload.tipo_sangre}")

    if payload.alergias_conocidas is not None and payload.alergias_conocidas != paciente.alergias_conocidas:
        paciente.alergias_conocidas = payload.alergias_conocidas
        cambios.append(f"alergias: {payload.alergias_conocidas[:40]}")

    if not cambios:
        return {
            "status": "success",
            "data": PacienteResponse.model_validate(paciente).model_dump(mode="json"),
            "message": "No se realizaron modificaciones."
        }

    # Registro de auditoría
    client_ip = _limpiar_ip(request.client.host if request.client else None)
    auditoria = AuditoriaAcceso(
        usuario_id=current_user.id,
        usuario_cedula=current_user.cedula,
        usuario_rol=current_user.rol.nombre if current_user.rol else "paciente",
        accion="AUTOGESTION_DATOS_CLINICOS",
        descripcion=f"Paciente actualizó: {', '.join(cambios)}",
        entidad="pacientes",
        entidad_id=str(paciente.id),
        paciente_cedula=paciente.cedula,
        ip_origen=client_ip,
        modulo="BILLETERA_PACIENTE",
        exitoso=True
    )
    db.add(auditoria)
    db.commit()
    db.refresh(paciente)

    return {
        "status": "success",
        "data": PacienteResponse.model_validate(paciente).model_dump(mode="json"),
        "message": "Datos clínicos actualizados correctamente en su expediente."
    }


@router.patch("/me/contacto", response_model=dict)
async def actualizar_datos_contacto_propios(
    payload: PacienteUpdateContactoRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """
    Permite al paciente actualizar sus números de teléfono, dirección, municipio
    y contacto de emergencia de forma autónoma.
    """
    paciente = db.query(Paciente).filter(
        Paciente.cedula == current_user.cedula,
        Paciente.activo == True
    ).first()

    if not paciente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No existe expediente clínico asociado a este usuario."
        )

    cambios = []
    if payload.telefono_principal is not None and payload.telefono_principal != paciente.telefono_principal:
        paciente.telefono_principal = payload.telefono_principal.strip()
        cambios.append("teléfono principal")

    if payload.telefono_emergencia is not None and payload.telefono_emergencia != paciente.telefono_emergencia:
        paciente.telefono_emergencia = payload.telefono_emergencia.strip()
        cambios.append("teléfono de emergencia")

    if payload.nombre_contacto_emergencia is not None and payload.nombre_contacto_emergencia != paciente.nombre_contacto_emergencia:
        paciente.nombre_contacto_emergencia = payload.nombre_contacto_emergencia.strip()
        cambios.append("contacto de emergencia")

    if payload.direccion is not None and payload.direccion != paciente.direccion:
        paciente.direccion = payload.direccion.strip()
        cambios.append("dirección")

    if payload.municipio is not None and payload.municipio != paciente.municipio:
        paciente.municipio = payload.municipio.strip()
        cambios.append("municipio")

    if not cambios:
        return {
            "status": "success",
            "data": PacienteResponse.model_validate(paciente).model_dump(mode="json"),
            "message": "No se realizaron modificaciones."
        }

    # También actualizar el teléfono en la tabla de usuarios si cambió el principal
    if payload.telefono_principal is not None:
        current_user.telefono = payload.telefono_principal.strip()

    client_ip = _limpiar_ip(request.client.host if request.client else None)
    auditoria = AuditoriaAcceso(
        usuario_id=current_user.id,
        usuario_cedula=current_user.cedula,
        usuario_rol=current_user.rol.nombre if current_user.rol else "paciente",
        accion="AUTOGESTION_DATOS_CONTACTO",
        descripcion=f"Paciente actualizó datos personales: {', '.join(cambios)}",
        entidad="pacientes",
        entidad_id=str(paciente.id),
        paciente_cedula=paciente.cedula,
        ip_origen=client_ip,
        modulo="BILLETERA_PACIENTE",
        exitoso=True
    )
    db.add(auditoria)
    db.commit()
    db.refresh(paciente)

    return {
        "status": "success",
        "data": PacienteResponse.model_validate(paciente).model_dump(mode="json"),
        "message": "Datos de contacto y domicilio actualizados correctamente."
    }
