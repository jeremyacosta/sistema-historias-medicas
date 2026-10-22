"""
api/v1/auth.py — Endpoints de Autenticación
=============================================
Módulo M0 — Seguridad de Acceso al Sistema
  POST   /api/v1/auth/login    → Iniciar sesión
  POST   /api/v1/auth/logout   → Cerrar sesión (revoca token JWT)
  POST   /api/v1/auth/refresh  → Renovar token de acceso
  GET    /api/v1/auth/me       → Perfil del usuario autenticado
"""

from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    get_current_user,
)
from app.db.session import get_db
from app.models.usuario  import Usuario
from app.models.paciente import Paciente
from app.models.security import SesionActiva, IntentoLogin, BloqueosCuenta, AuditoriaAcceso
from app.schemas.auth    import (
    LoginRequest, RefreshTokenRequest, TokenResponse, MeResponse, UsuarioPublico, APIResponse,
    OnboardingRequest, RecuperarPaso1Request, RecuperarPaso2Request
)

router = APIRouter(prefix="/auth", tags=["🔐 Autenticación"])


# ============================================================
#  FUNCIÓN AUXILIAR: Registrar auditoría
# ============================================================
def _auditar(
    db: Session,
    accion: str,
    descripcion: str,
    request: Request,
    usuario_id=None,
    cedula: str = None,
    rol: str = None,
    exitoso: bool = True,
    detalle_error: str = None,
):
    """Inserta un registro inmutable en auditoria_accesos."""
    ip = request.client.host if request.client else None
    registro = AuditoriaAcceso(
        usuario_id=usuario_id,
        usuario_cedula=cedula,
        usuario_rol=rol,
        accion=accion,
        descripcion=descripcion,
        modulo="auth",
        ip_origen=ip,
        exitoso=exitoso,
        detalle_error=detalle_error,
    )
    db.add(registro)
    db.commit()


# ============================================================
#  POST /auth/login
# ============================================================
@router.post("/login", response_model=APIResponse, summary="Iniciar sesión en el sistema")
async def login(
    body: LoginRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Flujo de autenticación seguro:
    1. Verifica si la cuenta está bloqueada.
    2. Busca el usuario por cédula.
    3. Verifica la contraseña con Bcrypt.
    4. Si falla: registra intento y evalúa bloqueo automático.
    5. Si éxito: emite Access Token + Refresh Token y registra sesión.
    """
    ip = request.client.host if request.client else None

    # ── 1. Verificar bloqueo activo ───────────────────────────
    bloqueo = db.query(BloqueosCuenta).filter(
        BloqueosCuenta.cedula == body.cedula,
        BloqueosCuenta.bloqueado_hasta > datetime.now(timezone.utc)
    ).order_by(BloqueosCuenta.creado_en.desc()).first()

    if bloqueo:
        minutos_restantes = int(
            (bloqueo.bloqueado_hasta - datetime.now(timezone.utc)).total_seconds() / 60
        )
        _auditar(db, "login:bloqueado",
                 f"Intento de login con cuenta bloqueada — cédula: {body.cedula}",
                 request, cedula=body.cedula, exitoso=False,
                 detalle_error=f"Cuenta bloqueada. Minutos restantes: {minutos_restantes}")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Cuenta bloqueada temporalmente. Intente en {minutos_restantes} minutos.",
        )

    # ── 2. Buscar usuario ─────────────────────────────────────
    usuario = db.query(Usuario).filter(
        Usuario.cedula == body.cedula,
        Usuario.activo == True
    ).first()

    def _registrar_fallo(mensaje: str):
        """Registra intento fallido y aplica bloqueo si corresponde."""
        db.add(IntentoLogin(cedula=body.cedula, ip_origen=ip,
                             exitoso=False, mensaje_fallo=mensaje))
        db.commit()

        # Contar intentos fallidos en los últimos 15 minutos
        ventana = datetime.now(timezone.utc) - timedelta(minutes=15)
        cantidad = db.query(IntentoLogin).filter(
            IntentoLogin.cedula == body.cedula,
            IntentoLogin.exitoso == False,
            IntentoLogin.intentado_en >= ventana,
        ).count()

        if cantidad >= settings.MAX_LOGIN_ATTEMPTS:
            bloqueo_hasta = datetime.now(timezone.utc) + timedelta(
                minutes=settings.LOCKOUT_DURATION_MINUTES
            )
            db.add(BloqueosCuenta(
                cedula=body.cedula,
                bloqueado_hasta=bloqueo_hasta,
                motivo=f"Superó {settings.MAX_LOGIN_ATTEMPTS} intentos fallidos",
                intentos=cantidad,
            ))
            db.commit()

        _auditar(db, "login:fallido", f"Login fallido — {mensaje}",
                 request, cedula=body.cedula, exitoso=False, detalle_error=mensaje)

    if not usuario:
        _registrar_fallo("Usuario no encontrado")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Cédula o contraseña incorrectos.")

    # ── 3. Verificar contraseña ───────────────────────────────
    if not verify_password(body.password, usuario.password_hash):
        _registrar_fallo("Contraseña incorrecta")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Cédula o contraseña incorrectos.")

    # ── 4. Emitir tokens ──────────────────────────────────────
    permisos = usuario.permisos_lista
    access_token, jti = create_access_token(
        subject=usuario.cedula,
        rol=usuario.rol.nombre,
        permisos=permisos,
    )
    refresh_token, refresh_jti = create_refresh_token(subject=usuario.cedula)

    # ── 5. Registrar sesión activa ────────────────────────────
    expira_en = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    db.add(SesionActiva(
        usuario_id=usuario.id,
        token_jti=jti,
        ip_origen=ip,
        dispositivo=request.headers.get("User-Agent"),
        expira_en=expira_en,
    ))

    # Registrar intento exitoso y actualizar último acceso
    db.add(IntentoLogin(cedula=body.cedula, ip_origen=ip, exitoso=True))
    usuario.ultimo_acceso = datetime.now(timezone.utc)
    db.commit()

    _auditar(db, "login:exitoso", f"Sesión iniciada — rol: {usuario.rol.nombre}",
             request, usuario_id=usuario.id, cedula=usuario.cedula,
             rol=usuario.rol.nombre, exitoso=True)

    token_data = TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        rol=usuario.rol.nombre,
        permisos=permisos,
    )

    return APIResponse.success(
        data=token_data.model_dump(),
        message=f"Bienvenido/a, {usuario.nombre_completo}."
    )


# ============================================================
#  POST /auth/logout
# ============================================================
@router.post("/logout", response_model=APIResponse, summary="Cerrar sesión (revoca JWT)")
async def logout(
    request: Request,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Logout real: marca el token JWT actual como revocado en la blacklist.
    Aunque el token siga siendo criptográficamente válido, el sistema
    lo rechazará en todas las solicitudes futuras.
    """
    # Extraer JTI del header Authorization
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "")
    payload = decode_token(token)
    jti = payload.get("jti")

    # Revocar sesión en la blacklist
    sesion = db.query(SesionActiva).filter(SesionActiva.token_jti == jti).first()
    if sesion:
        sesion.revocado = True
        sesion.revocado_en = datetime.now(timezone.utc)
        db.commit()

    _auditar(db, "logout", "Sesión cerrada por el usuario",
             request, usuario_id=current_user.id,
             cedula=current_user.cedula, rol=current_user.rol.nombre)

    return APIResponse.success(message="Sesión cerrada correctamente.")


# ============================================================
#  GET /auth/me
# ============================================================
@router.get("/me", response_model=APIResponse, summary="Perfil del usuario autenticado")
async def get_me(
    request: Request,
    current_user: Usuario = Depends(get_current_user),
):
    """
    Retorna el perfil completo del usuario autenticado:
    datos personales, rol y lista de permisos RBAC.
    """
    usuario_pub = UsuarioPublico(
        id=current_user.id,
        cedula=current_user.cedula,
        nombre=current_user.nombre,
        apellido=current_user.apellido,
        nombre_completo=current_user.nombre_completo,
        email=current_user.email,
        telefono=current_user.telefono,
        rol=current_user.rol.nombre,
        ultimo_acceso=current_user.ultimo_acceso,
        creado_en=current_user.creado_en,
        debe_cambiar_pass=current_user.debe_cambiar_pass,
        telefono_verificado=current_user.telefono_verificado,
        email_verificado=current_user.email_verificado,
    )
    return APIResponse.success(
        data={
            "usuario": usuario_pub.model_dump(mode="json"),
            "permisos": getattr(current_user, "_permisos_token", []),
        },
        message="Perfil cargado correctamente."
    )


# ============================================================
#  POST /auth/onboarding — Completar Onboarding de Paciente
# ============================================================
@router.post("/onboarding", response_model=APIResponse, summary="Completar Onboarding de Paciente")
async def completar_onboarding(
    body: OnboardingRequest,
    request: Request,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Permite al paciente cambiar su clave provisional, verificar teléfono y correo,
    y configurar su pregunta secreta de seguridad.
    """
    # 1. Actualizar contraseña
    current_user.password_hash = hash_password(body.password_nuevo)
    current_user.telefono = body.telefono
    current_user.email = body.email
    current_user.telefono_verificado = True
    current_user.email_verificado = True

    # 2. Guardar pregunta y hash de la respuesta (minúsculas y sin espacios extras)
    current_user.pregunta_seguridad = body.pregunta_seguridad.strip()
    respuesta_limpia = body.respuesta_seguridad.strip().lower()
    current_user.respuesta_seguridad_hash = hash_password(respuesta_limpia)

    # 3. Desactivar bandera de cambio de clave
    current_user.debe_cambiar_pass = False
    db.commit()

    _auditar(db, "paciente:onboarding_completado",
             "Onboarding de seguridad completado: clave y contacto actualizados",
             request, usuario_id=current_user.id, cedula=current_user.cedula,
             rol=current_user.rol.nombre, exitoso=True)

    return APIResponse.success(
        data={"debe_cambiar_pass": False},
        message="¡Onboarding completado con éxito! Tu Billetera de Salud está totalmente activa."
    )


# ============================================================
#  POST /auth/recuperar-paso1 — Validar Cédula y Fecha de Nacimiento
# ============================================================
@router.post("/recuperar-paso1", response_model=APIResponse, summary="Paso 1: Validar identidad para recuperación")
async def recuperar_paso1(
    body: RecuperarPaso1Request,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Verifica que la cédula y la fecha de nacimiento coincidan con un paciente registrado.
    Retorna la pregunta de seguridad configurada.
    """
    # 1. Buscar usuario
    usuario = db.query(Usuario).filter(Usuario.cedula == body.cedula, Usuario.activo == True).first()
    if not usuario:
        return APIResponse.error("No se encontró ningún expediente asociado a la cédula ingresada.", 404)

    # 2. Verificar datos en la tabla pacientes (cruce clínico)
    paciente = db.query(Paciente).filter(Paciente.cedula == body.cedula, Paciente.activo == True).first()
    if not paciente:
        return APIResponse.error("El usuario no posee historia clínica activa en el hospital.", 404)

    # Comparar fecha_nacimiento (formato YYYY-MM-DD)
    fecha_nac_str = paciente.fecha_nacimiento.strftime("%Y-%m-%d")
    if fecha_nac_str != body.fecha_nacimiento:
        return APIResponse.error("La fecha de nacimiento no coincide con los registros del hospital.", 400)

    # 3. Comprobar que tenga pregunta de seguridad configurada
    if not usuario.pregunta_seguridad or not usuario.respuesta_seguridad_hash:
        return APIResponse.error(
            "El paciente no ha configurado preguntas de seguridad. Debe acudir a la taquilla de Admisión del Hospital con su cédula para regenerar su acceso.",
            400
        )

    return APIResponse.success(
        data={
            "cedula": usuario.cedula,
            "nombre": f"{usuario.nombre} {usuario.apellido}",
            "pregunta_seguridad": usuario.pregunta_seguridad,
        },
        message="Identidad validada con éxito. Por favor responde tu pregunta secreta."
    )


# ============================================================
#  POST /auth/recuperar-paso2 — Responder Pregunta y Restablecer Clave
# ============================================================
@router.post("/recuperar-paso2", response_model=APIResponse, summary="Paso 2: Responder pregunta y restablecer clave")
async def recuperar_paso2(
    body: RecuperarPaso2Request,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Valida la respuesta a la pregunta secreta y actualiza la contraseña del paciente.
    """
    usuario = db.query(Usuario).filter(Usuario.cedula == body.cedula, Usuario.activo == True).first()
    if not usuario or not usuario.respuesta_seguridad_hash:
        return APIResponse.error("Solicitud inválida o expirada.", 400)

    # Validar respuesta
    respuesta_limpia = body.respuesta_seguridad.strip().lower()
    if not verify_password(respuesta_limpia, usuario.respuesta_seguridad_hash):
        _auditar(db, "paciente:recuperacion_fallida",
                 "Intento fallido de responder pregunta de seguridad",
                 request, usuario_id=usuario.id, cedula=usuario.cedula,
                 rol=usuario.rol.nombre, exitoso=False)
        return APIResponse.error("La respuesta de seguridad es incorrecta.", 400)

    # Actualizar contraseña
    usuario.password_hash = hash_password(body.password_nuevo)
    usuario.debe_cambiar_pass = False
    db.commit()

    _auditar(db, "paciente:password_restablecido",
             "Contraseña restablecida exitosamente mediante recuperación autónoma",
             request, usuario_id=usuario.id, cedula=usuario.cedula,
             rol=usuario.rol.nombre, exitoso=True)

    return APIResponse.success(
        message="¡Contraseña restablecida con éxito! Ya puedes iniciar sesión con tu nueva clave."
    )
