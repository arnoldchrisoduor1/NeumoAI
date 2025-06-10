# app configuration

from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # ===================== DATABASE SETTINGS =====================
    DATABASE_URL: str
    
    # ====================== JWT SETTINGS ==================
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # ================= API SETTINGS =========================
    API_VI_STR: str = "/api/vi"
    PROJECT_NAME: str = "Neumo AI API"
    
    # ================================= CORS =====================
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        
settings = Settings()