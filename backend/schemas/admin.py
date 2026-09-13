from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class OwnerCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str = Field(..., min_length=6)
    company_name: str = "FUTUREVERSE Corporate"
    department: str = "Talent Acquisition"
    designation: str = "Senior Technical Recruiter"
    permissions: List[str] = ["MANAGE_JOBS", "VIEW_APPLICATIONS", "INVITE_INTERVIEWS", "MAKE_DECISIONS"]

class OwnerUpdate(BaseModel):
    full_name: Optional[str] = None
    company_name: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    permissions: Optional[List[str]] = None
    is_disabled: Optional[bool] = None
    reset_password: Optional[str] = None

class OwnerResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    email: str
    company_name: str
    department: str
    designation: str
    permissions: List[str]
    is_disabled: bool
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

class CMSContentUpdate(BaseModel):
    section_key: str
    title: str
    subtitle: Optional[str] = None
    body: Optional[str] = None
    metadata_json: Dict[str, Any] = {}

class AchievementCreate(BaseModel):
    title: str
    description: str
    date_str: str
    category: str = "Milestone"
    metric: Optional[str] = None
    icon: str = "Award"
    is_active: bool = True

class EventCreate(BaseModel):
    title: str
    date_str: str
    time_str: str
    location: str = "Virtual / Hybrid"
    description: str
    image_url: Optional[str] = None
    registration_link: Optional[str] = None
    status: str = "UPCOMING"

class SupportTicketCreate(BaseModel):
    subject: str
    category: str = "General"
    message: str

class SupportTicketReply(BaseModel):
    message: str
    status: Optional[str] = None

class SupportTicketResponse(BaseModel):
    id: int
    user_id: int
    user_email: Optional[str] = None
    user_name: Optional[str] = None
    subject: str
    category: str
    message: str
    status: str
    replies: List[Dict[str, Any]] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AuditLogResponse(BaseModel):
    id: int
    user_id: Optional[int]
    user_role: Optional[str]
    user_email: Optional[str]
    action: str
    target_type: Optional[str]
    target_id: Optional[str]
    details: Dict[str, Any]
    ip_address: str
    timestamp: datetime

    class Config:
        from_attributes = True

class SystemHealthResponse(BaseModel):
    status: str = "HEALTHY"
    database_status: str = "CONNECTED"
    ai_engine_status: str = "OPERATIONAL"
    storage_status: str = "ONLINE"
    email_service_status: str = "CONFIGURED"
    active_users: int = 0
    total_jobs: int = 0
    total_applications: int = 0
    uptime_seconds: float = 0.0
