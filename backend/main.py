import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

from backend.config import settings
from backend.database import engine, Base
from backend.routers import (
    auth_router, jobs_router, candidate_router,
    owner_router, interview_router, admin_router, public_router
)
from backend.seed_data import seed_database

from backend.services.email_service import EmailService

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure database tables are created & pre-populate demo data
    print(f"Starting {settings.APP_NAME} by {settings.APP_CREATOR}...")
    try:
        await seed_database()
    except Exception as e:
        print(f"[Startup Warning] Database seed exception: {e}")
    
    # Verify Email Transport Connectivity
    try:
        EmailService.verify_connection()
    except Exception as email_err:
        print(f"[Startup Warning] Email service check exception: {email_err}")

    yield
    # Shutdown
    print(f"Shutting down {settings.APP_NAME}...")


app = FastAPI(
    title=settings.APP_NAME,
    description="AI-Powered Recruitment & Talent Intelligence Platform | Created & Developed by Sayan Rooj",
    version=settings.APP_VERSION,
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount private uploads directory for resumes
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/api/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR)), name="uploads")

# Include API Routers
app.include_router(auth_router)
app.include_router(jobs_router)
app.include_router(candidate_router)
app.include_router(owner_router)
app.include_router(interview_router)
app.include_router(admin_router)
app.include_router(public_router)

@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "app": settings.APP_NAME,
        "tagline": settings.APP_TAGLINE,
        "creator": settings.APP_CREATOR,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT
    }

@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.APP_NAME} API. Created & Developed by {settings.APP_CREATOR}.",
        "docs_url": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
