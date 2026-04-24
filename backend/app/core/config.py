from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env"
    )
    # Security
    DEBUG: bool = False
    # Database
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str
    DB_URL: str | None = None
    
    @property
    def DATABASE_URL(self):
        if self.DB_URL and self.DB_URL.strip():
            return self.DB_URL
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        if self.DEBUG:
            return "*"
        return self.FRONTEND_URL


settings = Settings()
