# database connection

import logging
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.exc import SQLAlchemyError
import asyncpg
from .config import settings

logger = logging.getLogger(__name__)

# Convert PostgreSQL URL for async if needed
ASYNC_DATABASE_URL = settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

# the async engine.
async_engine = create_async_engine(
    ASYNC_DATABASE_URL,
    echo=True,
    pool_timeout=30,
    pool_recycle=1800,
    pool_pre_ping=True
)
AsyncSessionLocal = sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)

# Sync engine for Alembic and utilities
sync_engine = create_engine(
    settings.DATABASE_URL,
    pool_timeout=30,
    pool_recycle=1800,
    pool_pre_ping=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=sync_engine)

Base = declarative_base()

# Dependency to get DB session
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

# Database utility functions
async def test_database_connection() -> dict:
    """
    Test database connection and return status information.
    
    Returns:
        dict: Connection status with details
    """
    try:
        # Test sync connection first (used by Alembic)
        with sync_engine.connect() as conn:
            # Test basic connection
            result = conn.execute(text("SELECT 1 as test"))
            test_value = result.fetchone()[0]
            
            if test_value != 1:
                raise Exception("Database test query returned unexpected value")
            
            # Get database info
            db_info_query = text("SELECT version()")
            db_version = conn.execute(db_info_query).fetchone()[0]
            
            # Check tables
            tables_query = text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            """)
            tables_result = conn.execute(tables_query)
            tables = [row[0] for row in tables_result.fetchall()]
            
            # Test async connection
            async_status = "not_tested"
            try:
                async with async_engine.begin() as async_conn:
                    async_result = await async_conn.execute(text("SELECT 1 as async_test"))
                    async_row = await async_result.fetchone()
                    async_test_value = async_row[0]
                    if async_test_value == 1:
                        async_status = "connected"
                    else:
                        async_status = "error"
            except Exception as e:
                async_status = f"error: {str(e)}"
            
            return {
                "status": "connected",
                "sync_engine": "connected",
                "async_engine": async_status,
                "database_version": db_version.split()[0:2],  # Just PostgreSQL version
                "tables_count": len(tables),
                "tables": tables,
                "connection_info": {
                    "sync_url": settings.DATABASE_URL.split('@')[1] if '@' in settings.DATABASE_URL else "hidden",
                    "async_url": ASYNC_DATABASE_URL.split('@')[1] if '@' in ASYNC_DATABASE_URL else "hidden"
                }
            }
            
    except SQLAlchemyError as e:
        logger.error(f"SQLAlchemy error: {e}")
        return {
            "status": "error",
            "error_type": "SQLAlchemyError",
            "error": str(e),
            "connection_info": {
                "sync_url": settings.DATABASE_URL.split('@')[1] if '@' in settings.DATABASE_URL else "hidden",
                "async_url": ASYNC_DATABASE_URL.split('@')[1] if '@' in ASYNC_DATABASE_URL else "hidden"
            }
        }
    except Exception as e:
        logger.error(f"Database connection error: {e}")
        return {
            "status": "error",
            "error_type": "ConnectionError", 
            "error": str(e),
            "connection_info": {
                "sync_url": settings.DATABASE_URL.split('@')[1] if '@' in settings.DATABASE_URL else "hidden",
                "async_url": ASYNC_DATABASE_URL.split('@')[1] if '@' in ASYNC_DATABASE_URL else "hidden"
            }
        }

def check_migrations_status() -> dict:
    """
    Check if database migrations are up to date.
    
    Returns:
        dict: Migration status information
    """
    try:
        with sync_engine.connect() as conn:
            # Check if alembic_version table exists
            alembic_check = text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'alembic_version'
                )
            """)
            has_alembic = conn.execute(alembic_check).fetchone()[0]
            
            if not has_alembic:
                return {
                    "status": "no_migrations",
                    "message": "No migrations have been run. Execute 'alembic upgrade head'",
                    "has_alembic_table": False
                }
            
            # Get current migration version
            version_query = text("SELECT version_num FROM alembic_version")
            current_version = conn.execute(version_query).fetchone()
            
            if current_version:
                return {
                    "status": "migrations_applied",
                    "current_version": current_version[0],
                    "message": "Database migrations are applied",
                    "has_alembic_table": True
                }
            else:
                return {
                    "status": "unknown",
                    "message": "Alembic table exists but no version found",
                    "has_alembic_table": True
                }
                
    except Exception as e:
        logger.error(f"Migration status check error: {e}")
        return {
            "status": "error",
            "error": str(e),
            "message": "Could not check migration status"
        }

def test_sync_connection() -> bool:
    """
    Simple sync connection test for startup checks.
    
    Returns:
        bool: True if connection successful, False otherwise
    """
    try:
        with sync_engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            return result.fetchone()[0] == 1
    except Exception as e:
        logger.error(f"Sync connection test failed: {e}")
        return False

async def test_async_connection() -> bool:
    """
    Simple async connection test.
    
    Returns:
        bool: True if connection successful, False otherwise
    """
    try:
        async with async_engine.begin() as conn:
            result = await conn.execute(text("SELECT 1"))
            row = await result.fetchone()
            return row[0] == 1
    except Exception as e:
        logger.error(f"Async connection test failed: {e}")
        return False

# Health check function for FastAPI endpoint
async def get_database_health() -> dict:
    """
    Comprehensive database health check.
    
    Returns:
        dict: Health status information
    """
    connection_info = await test_database_connection()
    migration_info = check_migrations_status()
    
    overall_status = "healthy" if connection_info["status"] == "connected" else "unhealthy"
    
    return {
        "overall_status": overall_status,
        "connection": connection_info,
        "migrations": migration_info,
        "engines": {
            "sync_engine_echo": sync_engine.echo,
            "async_engine_echo": async_engine.echo
        }
    }