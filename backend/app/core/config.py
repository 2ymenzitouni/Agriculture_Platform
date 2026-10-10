from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Trace up from app/core/config.py to Agriculture_Platform/ where .env is located
ENV_PATH = Path(__file__).resolve().parent.parent.parent.parent / ".env"


class Settings(BaseSettings):
    APP_NAME: str = "AgriAI"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    DATABASE_URL: str
    SECRET_KEY: str

    # JWT Settings
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = SettingsConfigDict(
        env_file=ENV_PATH,
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()