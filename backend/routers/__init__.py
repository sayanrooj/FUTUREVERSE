from backend.routers.auth_router import router as auth_router
from backend.routers.jobs_router import router as jobs_router
from backend.routers.candidate_router import router as candidate_router
from backend.routers.owner_router import router as owner_router
from backend.routers.interview_router import router as interview_router
from backend.routers.admin_router import router as admin_router
from backend.routers.public_router import router as public_router

__all__ = [
    "auth_router",
    "jobs_router",
    "candidate_router",
    "owner_router",
    "interview_router",
    "admin_router",
    "public_router"
]
