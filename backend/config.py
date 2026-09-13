import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent

# 1. Load environment variables from .env files (.env in project root, fallback to backend/.env)
def _load_env_fallback(filepath: Path):
    """Zero-dependency fallback .env loader ensuring environment files are always parsed."""
    if not filepath.exists() or not filepath.is_file():
        return
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                k = k.strip()
                v = v.strip().strip("'\"")
                if k and k not in os.environ:
                    os.environ[k] = v
    except Exception as e:
        print(f"[Config Loader Warning] Could not parse {filepath}: {e}")

try:
    from dotenv import load_dotenv
    # Load project root .env first, then backend/.env
    if (PROJECT_ROOT / ".env").exists():
        load_dotenv(PROJECT_ROOT / ".env", override=False)
    if (BASE_DIR / ".env").exists():
        load_dotenv(BASE_DIR / ".env", override=False)
except ImportError:
    pass

# Always run fallback parser to ensure any unparsed custom variables are registered
_load_env_fallback(PROJECT_ROOT / ".env")
_load_env_fallback(BASE_DIR / ".env")


class Settings:
    APP_NAME: str = "FUTUREVERSE"
    APP_TAGLINE: str = "Intelligent Recruitment. Better Talent. Future Ready."
    APP_CREATOR: str = "Sayan Rooj"
    APP_VERSION: str = "2026.1.0"
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "futureverse-super-secret-key-sayan-rooj-2026-production-grade")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    # Defaults to SQLite async for immediate out-of-the-box local Windows execution
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite+aiosqlite:///{BASE_DIR}/futureverse.db")
    
    # Storage
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    MAX_UPLOAD_SIZE_MB: int = 15
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # AI Engine settings
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "futureverse-native")
    AI_MODEL: str = os.getenv("AI_MODEL", "futureverse-cognitive-v2.6")
    AI_CONFIDENCE_THRESHOLD: float = 0.70
    
    # Email / SMTP settings (Compatible with Gmail, SendGrid, Mailgun, Amazon SES)
    SMTP_HOST: str = os.getenv("EMAIL_HOST", os.getenv("SMTP_HOST", "smtp.gmail.com"))
    SMTP_PORT: int = int(os.getenv("EMAIL_PORT", os.getenv("SMTP_PORT", "587")))
    SMTP_USER: str = os.getenv("EMAIL_USERNAME", os.getenv("SMTP_USER", ""))
    SMTP_PASSWORD: str = os.getenv("EMAIL_PASSWORD", os.getenv("SMTP_PASSWORD", ""))
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", os.getenv("SMTP_FROM", "recruitment@futureverse.ai"))
    EMAIL_FROM_NAME: str = os.getenv("EMAIL_FROM_NAME", os.getenv("SMTP_FROM_NAME", "FUTUREVERSE"))
    
    # TLS / SSL security handling
    _tls_env: str = os.getenv("EMAIL_USE_TLS", os.getenv("EMAIL_SECURE", "True")).lower()
    EMAIL_USE_TLS: bool = _tls_env in ("true", "1", "tls")
    EMAIL_USE_SSL: bool = _tls_env in ("ssl") or (SMTP_PORT == 465)

    # Real Email Dispatch Flag:
    # Enabled if explicitly set or if valid username and password credentials exist
    _enable_env: str = os.getenv("ENABLE_REAL_EMAIL", "").lower()
    if _enable_env in ("true", "1"):
        ENABLE_REAL_EMAIL: bool = True
    elif _enable_env in ("false", "0"):
        ENABLE_REAL_EMAIL: bool = False
    else:
        ENABLE_REAL_EMAIL: bool = bool(SMTP_USER and SMTP_PASSWORD)

settings = Settings()
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
