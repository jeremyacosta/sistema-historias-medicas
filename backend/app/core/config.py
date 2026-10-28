"""
core/config.py — Configuración Central del Sistema
====================================================
Lee TODAS las variables de entorno desde el archivo .env
usando Pydantic Settings. Un único punto de verdad para
la configuración de toda la aplicación.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    """
    Configuración global del sistema.
    Todas las variables se leen automáticamente del archivo .env
    """

    # ── Información de la Aplicación ──────────────────────────
    APP_NAME: str = 'Sistema Interoperable de Historias Médicas y Teleasistencia'
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000

    # ── Base de Datos PostgreSQL ───────────────────────────────
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "hospital_baquero"
    DB_USER: str
    DB_PASSWORD: str

    @property
    def DATABASE_URL(self) -> str:
        """URL de conexión construida desde las variables individuales."""
        return (
            f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    # ── Seguridad JWT ──────────────────────────────────────────
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480    # 8 horas sesión clínica
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── Política de Seguridad: Intentos de Login ──────────────
    MAX_LOGIN_ATTEMPTS: int = 5               # Intentos antes del bloqueo
    LOCKOUT_DURATION_MINUTES: int = 30        # Duración del bloqueo

    # ── CORS: Orígenes permitidos ─────────────────────────────
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )


@lru_cache()
def get_settings() -> Settings:
    """
    Retorna la instancia de configuración (cacheada).
    Usar con FastAPI Depends: settings = Depends(get_settings)
    """
    return Settings()


# Instancia global para importar directamente en cualquier módulo
settings = get_settings()
