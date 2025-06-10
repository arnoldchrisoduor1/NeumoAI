# auth pydantic schemas
from pydantic import BaseModel, EmailStr
from typing import Optional

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    
class TokenData(BaseModel):
    user_id: Optional[int] = None
    username: Optional[str] = None
    
class LoginRequest(BaseModel):
    email: str
    password: str
    
class RegisterRequest(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None
    
class RefreshTokenRequest(BaseModel):
    refresh_token: str
    
class PasswordResetRequest(BaseModel):
    email: EmailStr
    
class PasswordResetRequest(BaseModel):
    email: EmailStr
    
class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str
    