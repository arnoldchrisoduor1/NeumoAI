# authentication logic.
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from ..models.user import User
from ..schemas.user import UserCreate
from ..schemas.auth import LoginRequest
from ..core.security import verify_password, get_password_hash, create_access_token, create_refresh_token, verify_token

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        
    async def authenticate_user(self, login_data: LoginRequest) -> Optional[User]:
        """Authenticate user by username/email and password"""
        # finding the user by email.
        query = select(User).where(
            # (User.username == login_data.username) |
            (User.email == login_data.email)
        )
        result = await self.db.execute(query)
        user = result.scalar_one_or_none()
        
        if not user:
            return None
        
        if not verify_password(login_data.password, user.hashed_password):
            return None
        
        if not user.is_active:
            return None
        
        return user
    
    async def create_user(self, user_data: UserCreate) -> User:
        """Create new User"""
        # Check if user already exists.
        query = select(User).where(
            (User.email == user_data.email) |
            (User.username == user_data.username)
        )
        result = await self.db.execute(query)
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            if existing_user.email == user_data.email:
                raise ValueError("Email already registered")
            if existing_user.username == user_data.username:
                raise ValueError("Username already taken")
            
        # creating the new user.
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            email=user_data.email,
            username=user_data.username,
            full_name=user_data.full_name,
            hashed_password=hashed_password,
            is_active=user_data.is_active
        )
        
        self.db.add(db_user)
        await self.db.commit()
        await self.db.refresh(db_user)
        return db_user
    
    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        query = select(User).where(User.id == user_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def get_user_by_username(self, username: str) -> Optional[User]:
        query = select(User).where(User.username == username)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def store_refresh_token(self, user_id: int, refresh_token: str):
        """Store refresh token for user"""
        query = select(User).where(User.id == user_id)
        result = await self.db.execute(query)
        user = result.scalar_one_or_none()
        
        if user:
            user.refresh_token = refresh_token
            await self.db.commit()
            
    async def verify_refresh_token(self, refresh_token: str) -> Optional[User]:
        """Verify refresh token and return user"""
        # we will verify the token signature and expiration.
        payload = verify_token(refresh_token, "refresh")
        if not payload:
            return None
        
        user_id = payload.get("sub")
        if not user_id:
            return None
        
        # check if token matches stored token.
        query = select(User).where(User.id == int(user_id))
        result = await self.db.execute(query)
        user = result.scalar_one_or_none()
        
        if not user or user.refresh_token != refresh_token:
            return None
        
        return user
    
    async def revoke_refresh_token(self, user_id: int):
        """Revoking refresh token(logout)"""
        query = select(User).where(User.id == user_id)
        result = await self.db.execute(query)
        user = result.scalar_one_or_none()
        
        if user:
            user.refresh_token = None
            await self.db.commit()