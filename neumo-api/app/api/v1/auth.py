# authentication endpoints

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from ...core.database import get_db
from ...core.security import create_access_token, create_refresh_token
from ...schemas.auth import (
    Token, LoginRequest, RegisterRequest, RefreshTokenRequest
)
from ...schemas.user import User, UserCreate
from ...services.auth_service import AuthService
from ...api.deps import get_current_user
from ...models.user import User as UserModel

router = APIRouter()

@router.post("/register", response_model=Token)
async def register(
    user_data: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    """Register new user"""
    auth_service = AuthService(db)
    
    try:
        # create user
        user_create = UserCreate(**user_data.dict())
        user = await auth_service.create_user(user_create)
        # create tokens.
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        # store refresh token
        await auth_service.store_refresh_token(user.id, refresh_token)
        
        return Token(
            access_token=access_token,
            refresh_token=refresh_token
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
        
@router.post("/login", response_model=Token)
async def login(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """Login User"""
    auth_service = AuthService(db)
    
    # Authenticating the user.
    user = await auth_service.authenticate_user(login_data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
        
    # create token
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    # store refresh token
    await auth_service.store_refresh_token(user.id, refresh_token)
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token
    )
    
@router.post("/refresh", response_model=Token)
async def refresh_token(
    token_data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    """Refreshing the access token"""
    auth_service = AuthService(db)
    
    # verify refresh token
    user = await auth_service.verify_refresh_token(token_data.refresh_token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WW-Autheticate": "Bearer"},
        )
        
    # create new tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user)})
    
    # store new refresh token
    await auth_service.store_refresh(user.id, refresh_token)
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token
    )
    
@router.post("/logout")
async def logout(
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Logout user"""
    auth_service = AuthService(db)
    await auth_service.revoke_refresh_token(current_user.id)
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=User)
async def get_current_user_info(
    current_user: UserModel = Depends(get_current_user)
):
    """Get current user information"""
    return current_user

@router.get("/verify")
async def verify_token_endpoint(
    current_user: UserModel = Depends(get_current_user)
):
    """Verify if token is valid"""
    return {"valid": True, "user_id": current_user.id}