# app configuration

from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # ===================== DATABASE SETTINGS =====================
    DATABASE_URL: str
    NEON_DATABASE_URL: str
    
    # ====================== JWT SETTINGS ==================
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # ================= API SETTINGS =========================
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Neumo AI API"
    VERSION: str
    DEBUG: bool
    
    # ========= AWS ACCESS ============
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_REGION: str
    S3_BUCKET_NAME: str
    
    # =========== AI MODEL VERSIONING ==============
    MODEL_PATH: str
    MODEL_VERSION: str
    
    # ================================= CORS =====================
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        
settings = Settings()