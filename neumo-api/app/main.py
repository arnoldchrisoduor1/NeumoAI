from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from .core.config import settings
from .core.database import test_database_connection, check_migrations_status, get_database_health
from .api.v1.auth import router as auth_router
from .api.v1.predictions import router as prediction_router
from prometheus_fastapi_instrumentator import Instrumentator
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
from fastapi.responses import JSONResponse

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    
    # Startup
    logger.info("🚀 Starting Pneumonia API...")
    
    # Test database connection
    try:
        logger.info("🔌 Testing database connection...")
        connection_result = await test_database_connection()
        
        if connection_result["status"] == "connected":
            logger.info("✅ Database connection successful!")
            logger.info(f"📊 Found {connection_result['tables_count']} table(s)")
            
            if connection_result["tables"]:
                logger.info(f"   Tables: {', '.join(connection_result['tables'])}")
            
            # Check sync and async engines
            if connection_result.get("async_engine") == "connected":
                logger.info("✅ Async database engine working!")
            else:
                logger.warning(f"⚠️  Async engine issue: {connection_result.get('async_engine', 'unknown')}")
            
            # Check migrations
            migration_status = check_migrations_status()
            if migration_status["status"] == "migrations_applied":
                logger.info(f"✅ Migrations up to date (version: {migration_status['current_version']})")
            elif migration_status["status"] == "no_migrations":
                logger.warning("⚠️  No migrations found. Run: alembic upgrade head")
            else:
                logger.warning(f"⚠️  Migration status: {migration_status['message']}")
                
        else:
            logger.error(f"❌ Database connection failed: {connection_result.get('error', 'Unknown error')}")
            logger.error("🔧 Please check your DATABASE_URL and ensure the database is accessible")
            logger.warning("⚠️  Continuing startup without database connection...")
            
    except Exception as e:
        logger.error(f"❌ Database startup check failed: {e}")
        logger.warning("⚠️  Continuing startup without database connection...")
    
    logger.info("✅ Pneumonia API startup complete!")
    logger.info("📊 Prometheus metrics available at /metrics")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down Pneumonia API...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Initialize and configure Prometheus instrumentator
instrumentator = Instrumentator(
    should_group_status_codes=False,
    should_ignore_untemplated=True,
    should_respect_env_var=True,
    should_instrument_requests_inprogress=True,
    excluded_handlers=[".*admin.*"],
    env_var_name="ENABLE_METRICS",
    inprogress_name="fastapi_inprogress",
    inprogress_labels=True,
)

instrumentator.instrument(app)

# setting up the cors.
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=["*"]
)

# including the routers.
app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["authentication"])
app.include_router(prediction_router, prefix=f"{settings.API_V1_STR}/prediction", tags=["prediction"])

@app.get("/")
async def root():
    print("Making request to root route")
    return {"message": "Pneumonia API is running"}

@app.get("/health")
async def health_check():
    print("Making request to health route")
    return JSONResponse(content={"status": "healthy"}, status_code=200)

@app.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.get("/db-health")
async def db_health_check():
    """Comprehensive database health check endpoint."""
    return await get_database_health()